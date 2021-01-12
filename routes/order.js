const express = require("express");
const Order = require("../models/Orders");
const UserDetails = require("../models/UserDetails");

const mail = require("../pagination/nodemailer");
const orderFunctions = require("../functions/orders");

const AuthController = require("../controllers/authController");

const {
  getOrderById,
  getOrdersBySeller
} = require("../functions/orderFunctions");
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
  const {
    product_seller,
    clothes,
    delivery_location,
    delivery_type
  } = req.body;

  orderFields = {};
  orderFields.buyer = req.user.id;

  if (delivery_location) orderFields.delivery_location = delivery_location;
  else {
    res.status(401).json({ error: { msg: "Delivery location is required." } });
  }

  if (delivery_type) orderFields.delivery_type = delivery_type;

  if (clothes) {
    orderFields.clothes = clothes;
  }

  if (delivery_type === "Inside Ringroad") {
    orderFields.delivery_charge = 100;
  } else if (delivery_type === "Outside Ringroad") {
    orderFields.delivery_charge = 150;
  } else if (delivery_type === "Outside Valley") {
    orderFields.delivery_charge = 250;
  }

  try {
    const postOrder = await orderFunctions.postOrder(clothes, "seller");
    console.log(postOrder);
    //  const postOrder = await Post.findById(clothes).populate('seller')

    // orderDestructure.total_amount = postOrder.selling_price;

    orderDestructure.total_order_amount =
      orderDestructure.delivery_charge + orderDestructure.total_amount;

    orderFields.total_amount = orderClothes.selling_price;

    orderFields.total_order_amount =
      orderFields.delivery_charge + orderFields.total_amount;

    const seller = await UserDetails.findOne({ user: postOrder.seller });

    orderFields.pickup_location = seller.address;

    const orderPost = new Order(orderFields);
    try {
      orderPost.save();

      postOrder.status = "Processing";
      postOrder.save();

      let notdata = {
        user: product_seller,
        title: "Someone wants to buy your item: " + orderClothes.listing_name,
        image: orderClothes.feature_image,
        description: "Open to view order details.",
        actions: {
          actionType: "orders",
          actionValue: orderPost._id
        }
      };

      await createNotification(notdata);

      const mailt = {
        subject: "New Order Alert!",
        html: `<h2>Someone wants to buy your item: ${orderClothes.listing_name}`
      };

      mail(sellerEmail, mailt);

      res
        .status(200)
        .json({ success: true, msg: "Order placed successfully!" });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ success: false, errors: { msg: "Order failed." } });
    }
  } catch (err) {
    console.log(err);
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
