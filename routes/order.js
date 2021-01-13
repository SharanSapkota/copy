const express = require("express");
const Order = require("../models/Orders");

const mail = require("../pagination/nodemailer");
const orderFunctions = require("../functions/orders");
const {
  getUserDetailsById,
  getUserById,
  getUserDetails
} = require("../functions/users");

const AuthController = require("../controllers/authController");

const {
  getOrderById,
  getOrdersBySeller,
  getOrdersBySellerAlt
} = require("../functions/orderFunctions");

const { getPostById } = require("../functions/postFunctions");

const { createNotification } = require("../functions/notificationFunctions");

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

router.get("/pending", async (req, res) => {
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

router.get("/testing", async (req, res) => {
  const result = await getOrdersBySellerAlt(
    "5fd1f46057412e6a880ed54f",
    "5fd8a2a595640736bc8877c3"
  );
  console.log(result);
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

  console.log(req.body);

  orderFields = {};
  orderFields.buyer = req.user.id;

  if (!delivery_type || !clothes || !payment_type) {
    return res
      .status(401)
      .json({ error: { msg: "Delivery details are required." } });
  }

  orderFields.delivery_type = delivery_type;
  orderFields.clothes = clothes;
  orderFields.payment_type = payment_type;
  if (discount) {
    const dis = await getDiscountAmount(discount);
    orderFields.discount = dis.amount;
  } else {
    orderFields.discount = 0;
  }

  if (delivery_type === "Inside Ringroad") {
    orderFields.delivery_charge = 100;
  } else if (delivery_type === "Outside Ringroad") {
    orderFields.delivery_charge = 150;
  } else if (delivery_type === "Outside Valley") {
    orderFields.delivery_charge = 250;
  }

  try {
    const post = await getPostById(clothes);
    const seller = await getUserById(post.seller);
    const sellerDetails = await getUserDetails({ user: seller }, "address");
    const buyerDetails = await getUserDetails(
      { user: req.user.id },
      "address city"
    );

    orderFields.pickup_location = sellerDetails.address;
    orderFields.total_amount = post.selling_price;
    orderFields.total_after_discount =
      orderFields.total_amount +
      orderFields.delivery_charge -
      orderFields.discount;
    orderFields.delivery_location =
      buyerDetails.address + ", " + buyerDetails.city;

    try {
      const order = new Order(orderFields);
      order.save();

      let notdata = {
        user: post.seller,
        title: "Someone wants to buy your item: " + post.listing_name,
        image: post.feature_image,
        description: "Open to view order details.",
        actions: {
          actionType: "orders",
          actionValue: order._id
        }
      };

      await createNotification(notdata);

      // const mailt = {
      //   subject: "New Order Alert!",
      //   html: `<h2>Someone wants to buy your item: ${post.listing_name}`
      // };

      // mail(sellerEmail, mailt);

      return res
        .status(200)
        .json({ success: true, msg: "Order placed successfully!" });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: false, errors: { msg: "Order failed." } });
    }
  } catch (err) {
    return res.status(404).json({ errors: [{ msg: "Clothes not found." }] });
  }
});

// Change Order
router.patch("/:orderId/cancel", async (req, res) => {
  var id = req.params.orderId;

  try {
    const changeOrder = await orderFunctions.changeOrder(id, "cancelled");
    if (changeOrder) {
      changeOrder.save();
      res.status(201).json(changeOrder);
    } else {
      res.status(404).json({ error: "Order not found." });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
