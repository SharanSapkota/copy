const express = require("express");
const Order = require("../models/Orders");
const User = require("../models/Users");
const Post = require("../models/Post");
const UserDetails = require("../models/UserDetails");
const mail = require("../pagination/nodemailer");
const AuthController = require("../controllers/authController");

const { createNotification } = require("../functions/notificationFunctions");

const router = express.Router();

router.get("/", AuthController.authAdmin, async (req, res) => {
  // res.send('I am in order.js')
  try {
    const getAllOrder = await Order.find().populate("clothes");
    res.json(getAllOrder);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const getOrderById = await Order.findById({
      _id: req.params.orderId
    }).populate("clothes");
    res.json(getOrderById);
  } catch (err) {
    res.json(err);
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
    const orderClothes = await Post.findById(clothes).populate("seller");

    orderFields.total_amount = orderClothes.selling_price;

    orderFields.total_order_amount =
      orderFields.delivery_charge + orderFields.total_amount;

    const seller = await UserDetails.findOne({ user: product_seller });
    const sellerEmail = await User.findById(product_seller).select("email");

    orderFields.pickup_location = seller.address;

    const orderPost = new Order(orderFields);
    try {
      orderPost.save();
      orderClothes.status = "Processing";
      orderClothes.save();

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

router.patch("/:orderId", async (req, res) => {
  const { pickup_location, delivery_location } = req.body;

  orderUpdateDestructure = {};

  if (pickup_location) {
    orderUpdateDestructure.pickup_location = pickup_location;
  }
  if (delivery_location) {
    orderUpdateDestructure.delivery_location = delivery_location;
  }

  try {
    const updateOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: orderUpdateDestructure }
    );

    res.status(200).json(updateOrder);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/:orderId/cancel", AuthController.authBuyer, async (req, res) => {
  try {
    const updateStatus = await Order.findOneAndUpdate(
      { _id: req.params.orderId, buyer: req.user._id },
      { $set: { order_status: "cancelled" } }
    );
    res.status(201).json(updateStatus);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.patch(
  "/:orderId/complete",
  AuthController.authAdmin,
  async (req, res) => {
    try {
      const updateStatus = await Order.findOneAndUpdate(
        { _id: req.params.orderId },
        { $set: { order_status: "completed" } }
      );
      res.status(201).json(updateStatus);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }
);

router.get("/to/", AuthController.authBuyer, async (req, res) => {
  let ordersArr = [];

  Order.find()
    .populate({
      path: "clothes"
    })
    .populate({
      path: "buyer",
      select: "username"
    })
    .sort({ date: -1 })
    .exec(function(err, orders) {
      orders.forEach(order => {
        if (order.clothes.seller == req.user.id || order.buyer == req.user.id) {
          ordersArr.push(order);
        }
      });
      if (ordersArr.length > 0) {
        return res.status(200).json({ orders: ordersArr, success: true });
      } else {
        return res.status(404).json({
          success: false,
          errors: { msg: "No orders found for seller." }
        });
      }
    });
});

module.exports = router;
