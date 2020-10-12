const express = require("express");
const Order = require("../models/Orders");
const User = require("../models/Users");
const Post = require("../models/Post");
const UserDetails = require("../models/UserDetails");

const router = express.Router();

router.get("/", async (req, res) => {
  // res.send('I am in order.js')
  try {
    const getAllOrder = await Order.find().populate("clothes");
    res.json(getAllOrder);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:orderId", async (req, res) => {
  // res.send('I am in order.js')
  const order_status = "pending";
  try {
    const getOrderById = await Order.findById({ _id: req.params.orderId });
    res.json({ getOrderById });
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req, res) => {
  const { buyer, clothes, delivery_location } = req.body;
  orderDestructure = {};

  if (buyer) {
    orderDestructure.buyer = buyer;
  }
  if (clothes) {
    orderDestructure.clothes = clothes;
  }
  if (delivery_location) {
    orderDestructure.delivery_location = delivery_location;
  }
  orderDestructure.delivery_charge = 100;

  try {
    const orderClothes = await Post.findById(clothes);

    orderDestructure.total_amount = orderClothes.selling_price;

    orderDestructure.total_order_amount =
      orderDestructure.delivery_charge + orderDestructure.total_amount;

    const seller = await UserDetails.findOne({ user: orderClothes.seller });

    orderDestructure.pickup_location = seller.address;

    const orderPost = new Order(orderDestructure);
    try {
      orderPost.save();
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

router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const updateStatus = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: { order_status: "cancelled" } }
    );
    res.status(201).json(updateStatus);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.patch("/:orderId/complete", async (req, res) => {
  //const order_status = "cancelled"

  // const getOrderById = await Order.findById({_id: req.params.orderId})
  // res.json({getOrderById, order_status})

  try {
    const updateStatus = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: { order_status: "completed" } }
    );
    res.status(201).json(updateStatus);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/to/:UserId", async (req, res) => {
  console.log("this is the population");
  try {
    const getUsers = await User.find();
    //console.log(getUsers)
    //await Order.find({buyer: User._id}).populate("clothes").exec((err, docs) => {
    const buyerOrders = await Order.find({
      $or: [{ buyer: User._id }, { seller: User._id }]
    }).populate("clothes");

    res.json(buyerOrders);
  } catch (err) {
    res.json(err);
  }
});

router.get("/cancelorder", (req, res) => {
  res.send("I am in cancel order.js");
});

module.exports = router;
