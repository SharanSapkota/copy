const express = require("express");
const Order = require("../models/Orders");

const mail = require("../pagination/nodemailer");
const { sendMailNew } = require("../functions/mailing");
const {
  getUserDetailsById,
  getUserById,
  getUserDetails,
  getUserCredits
} = require("../functions/users");

const AuthController = require("../controllers/authController");

const {
  getOrderById,
  getOrdersBySeller,
  getOrdersBySellerAlt,
  verifyOrderSeller,
  createAgreement,
  placeOrder
} = require("../functions/orderFunctions");

const {
  getOneDiscount,
  calcDiscount,
  validateDiscount
} = require("../functions/discounts");

const {
  getOnePost,
  getPostById,
  getTotalAmount,
  getTotalCreditDiscount,
  changeClothingStatus
} = require("../functions/postFunctions");

const {
  createNotification,
  createOrderNotifications
} = require("../functions/notificationFunctions");

const { createBuyerCredits } = require("../functions/credits");

const router = express.Router();

router.get("/", AuthController.authSeller, async (req, res) => {
  try {
    const result = await getOrdersBySeller(req.user.id);

    if (result.length > 0) {
      res.json({ success: true, orders: result });
    } else {
      res.json({ success: false, errors: [{ msg: "No orders for seller." }] });
    }
  } catch (err) {
    res.status(404).json({ success: false, errors: [{ msg: "Server error" }] });
  }
});

router.get("/pending", AuthController.authSeller, async (req, res) => {
  let filters = { order_status: "pending" };
  try {
    const result = await getOrdersBySeller(req.user._id, filters);

    if (result.length > 0) {
      res.json({ success: true, orders: result });
    } else {
      res.json({ success: false, errors: [{ msg: "No orders pending." }] });
    }
  } catch (err) {
    res.status(404).json({ success: false, errors: [{ msg: "Server error" }] });
  }
});

router.get("/completed", AuthController.authSeller, async (req, res) => {
  let filters = { order_status: "completed" };
  try {
    const result = await getOrdersBySeller(req.user._id, filters);
    if (result.length > 0) {
      res.json({ success: true, orders: result });
    } else {
      res.json({ success: false, errors: [{ msg: "No orders completed." }] });
    }
  } catch (err) {
    res.status(404).json({ success: false, errors: [{ msg: "Server error" }] });
  }
});

router.get("/orderById/:id", AuthController.authSeller, async (req, res) => {
  var user = req.user.id;
  var oid = req.params.id;
  const result = await getOrderById(oid);

  if (String(result.buyer) === user || String(result.clothes.seller) === user) {
    return res.json({ success: true, order: result });
  } else {
    return res
      .status(404)
      .json({ success: false, errors: [{ msg: "Order not found." }] });
  }
});

router.post("/", AuthController.authBuyer, async (req, res) => {
  const { clothes, delivery_type, payment_type, discount } = req.body;

  if (!delivery_type || !clothes || !payment_type) {
    return res
      .status(401)
      .json({ error: { msg: "Delivery details are required." } });
  }

  const user = req.user.id;
  const buyerDetails = await getUserDetails({ user: user });

  const total_result = await getTotalAmount(clothes);
  const total_amount = total_result[0].sum;
  var delivery_charge =
    delivery_type === "Inside Ringroad"
      ? 100
      : delivery_type === "Outside Ringroad"
      ? 150
      : delivery_type === "Outside Valley"
      ? 250
      : 100;

  var total_order_amount = total_amount + delivery_charge;
  var total_after_discount = total_order_amount;

  var orderFields = {
    buyer: user,
    payment_type: payment_type,
    total_amount: total_amount,
    delivery_charge: delivery_charge,
    total_order_amount: total_order_amount
  };

  var clothesDetails = Promise.all(
    clothes.map(async item => {
      const post = await getOnePost({ _id: item }, "seller");
      return {
        item: post._id,
        seller: post.seller
      };
    })
  );

  orderFields.clothes = await clothesDetails.then(deets => {
    return deets;
  });

  if (discount) {
    const discount_verified = await validateDiscount(discount);
    orderFields.discount = discount;
    if (discount_verified) {
      total_after_discount =
        total_order_amount -
        calcDiscount(
          total_amount + delivery_charge,
          discount_verified.amount,
          discount_verified.discount_type
        );
    } else {
      return res.json({
        success: false,
        errors: [{ msg: "Discount coupon invalid!" }]
      });
    }
  }

  orderFields.total_after_discount = total_after_discount;
  orderFields.delivery_location =
    buyerDetails.address + ", " + buyerDetails.city;

  orderFields.delivery_type = delivery_type;

  if (payment_type === "credits") {
    const creditsAvailable = await getUserCredits(user);

    var creditDiscount = await getTotalCreditDiscount(clothes);
    total_after_discount = total_after_discount - creditDiscount;

    if (creditsAvailable < total_after_discount) {
      return res.json({
        success: false,
        errors: [{ msg: "Not enough credits to place order." }]
      });
    }
  }

  const order = await placeOrder(orderFields);

  if (order) {
    if (payment_type === "credits") {
      await createBuyerCredits(user, order._id, total_after_discount);
    }
    // await createBuyerNotification(order._id);
    await createOrderNotifications(clothes, order._id);

    await changeClothingStatus(clothes, "Unavailable");

    // const mailt = {
    //   subject: "New Order Alert!",
    //   html: `<h2>Someone wants to buy your item: ${post.listing_name}`
    // };

    // sendMailNew(sellerEmail, mailt);

    return res
      .status(200)
      .json({ success: true, msg: "Order placed successfully!" });
  } else {
    return res.json({ success: false, errors: [{ msg: "Order failed." }] });
  }
});

router.patch("/:orderId/agree", AuthController.authSeller, async (req, res) => {
  const user = req.user;
  const order = req.params.orderId;

  const result = await verifyOrderSeller(order, user);

  if (result) {
    await createAgreement(user, order);
    result.order_status = "processing";
    result.save();

    res.json({ success: true, order: result });
  } else {
    res.json({ success: false, errors: [{ msg: "Order not found." }] });
  }
});

// Change Order
router.patch("/:orderId/cancel", async (req, res) => {
  var id = req.params.orderId;

  try {
    const changeOrder = await patchOrder(id, { order_status: "cancelled" });
    if (changeOrder) {
      changeOrder.save();
      changeClothingStatus(changeOrder.clothes, "Available");
      return res.status(201).json(changeOrder);
    } else {
      return res.status(404).json({ error: "Order not found." });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

module.exports = router;
