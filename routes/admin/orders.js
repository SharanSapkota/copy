const express = require("express");
const orderFunctions = require("../../functions/admins/orders");
const Orders = require("../../models/Orders");
const { Post } = require("../../models/Post");
const Sellers = require("../../models/admin/Seller");
const AuthController = require("../../controllers/authController");

const {
  getTotalAmount,
  changeClothingStatus,
} = require("../../functions/postFunctions");
const UserDetails = require("../../models/UserDetails");

const router = express.Router();

//Get all orders
router.get("/", AuthController.authAdmin, async (req, res) => {
  const getAllOrders = await orderFunctions.getAllOrders();
  res.status(200).json(getAllOrders);
});

router.get("/completed", AuthController.authAdmin, async (req, res) => {
  const result = await orderFunctions.getAllCompletedOrders();
  if (result.success) {
    return res.json(result);
  }
  return res
    .status(500)
    .json({ success: false, errors: [{ msg: "Server Error." }] });
});
router.get("/pending", AuthController.authAdmin, async (req, res) => {
  const result = await orderFunctions.getAllPendingOrders();
  if (result.success) {
    return res.json(result);
  }
  return res
    .status(500)
    .json({ success: false, errors: [{ msg: "Server Error." }] });
});
router.get("/processing", AuthController.authAdmin, async (req, res) => {
  const result = await orderFunctions.getAllProcessingOrders();
  if (result.success) {
    return res.json(result);
  }
  return res
    .status(500)
    .json({ success: false, errors: [{ msg: "Server Error." }] });
});
router.get("/cancelled", AuthController.authAdmin, async (req, res) => {
  const result = await orderFunctions.getAllCancelledOrders();
  if (result.success) {
    return res.json(result);
  }
  return res
    .status(500)
    .json({ success: false, errors: [{ msg: "Server Error." }] });
});

router.post("/", AuthController.authAdmin, async (req, res) => {
  const {
    items,
    name,
    phone_number,
    address,
    city,
    email,
    delivery_type,
  } = req.body;

  orderDestructure = {};

  if (
    !items ||
    !name ||
    !phone_number ||
    !address ||
    !city ||
    !email ||
    !delivery_type
  ) {
    return res.json({
      success: false,
      errors: [{ msg: "All fields are required." }],
    });
  }

  orderDestructure.buyer = { name, phone_number, email, address, city };

  orderDestructure.clothes = items.map((item) => ({
    item,
    seller: req.user.id,
  }));

  orderDestructure.address = address;
  orderDestructure.city = city;

  orderDestructure.delivery_type = delivery_type;

  orderDestructure.delivery_charge = (function () {
    switch (delivery_type) {
      case "Inside Ringroad":
        return 100;
      case "Outside Ringroad":
        return 120;
      case "Outside Valley":
        return 150;
    }
  })();

  try {
    orderDestructure.total_amount = await getTotalAmount(items);
    orderDestructure.total_order_amount =
      orderDestructure.delivery_charge + orderDestructure.total_amount;

    const order = new Orders(orderDestructure);
    await order.save();
    await Orders.populate(order, { path: "clothes.item" });
    await changeClothingStatus(items, "Booked");

    return res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: "Server Error." }] });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    const res = await Orders.deleteOne({ _id: req.params.orderId });
    if (res.deletedCount > 0) {
      return res.json({ success: true });
    } else return res.json({ success: false });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

router.patch("/:oid/items", AuthController.authAdmin, async (req, res) => {
  try {
    const item = await Post.findById(req.body.item_id);
    const amount = item.selling_price;
    const order = await Orders.findOneAndUpdate(
      { _id: req.params.oid },
      {
        $pull: { clothes: { _id: req.body.id } },
        $inc: { total_amount: -amount, total_order_amount: -amount },
      },
      { new: true }
    );
    await changeClothingStatus(req.body.item_id, "Available");
    await Orders.populate(order, { path: "clothes.item" });
    item.status = "Available";
    return res.json({ success: true, order, item });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, errors: [{ msg: "Server Error." }] });
  }
});

// Update order
router.patch("/:orderId", async (req, res) => {
  try {
    const order = await Orders.findOneAndUpdate(
      { _id: req.params.orderId },
      req.body,
      { new: true }
    );
    await Orders.populate(order, { path: "clothes.item" });
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// get orders by Id
router.get("/:orderId", async (req, res) => {
  var id = req.params.orderId;
  var getOrderById1 = await orderFunctions.getOrderById(id, "clothes");

  res.json(getOrderById1);
});

// delivery complete
router.patch("/:orderId/delivery", async (req, res) => {
  const oid = req.params.orderId;

  try {
    const order = await Orders.findById(oid);
    const item = order.clothes.find((c) => c._id.toString() === req.body.item);
    item.delivered = { status: true, date: Date.now() };

    const delivered = order.clothes.filter(
      (item) => item.delivered.status === true
    ).length;

    if (delivered === order.clothes.length) {
      order.order_status = "completed";
    }

    await order.save();
    await Orders.populate(order, { path: "clothes.item" });

    return res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// payment complete
router.patch(
  "/:orderId/payment",
  AuthController.authAdmin,
  async (req, res) => {
    const oid = req.params.orderId;
    const user = req.user.id;

    try {
      const order = await Orders.findById(oid);
      const item = order.clothes.find(
        (c) => c._id.toString() === req.body.item
      );
      item.payment = { status: true, date: Date.now() };

      await order.save();
      await Orders.populate(order, { path: "clothes.item" });

      const post = await Post.findById(item.item);

      if (item.seller.toString() !== user.toString()) {
        await UserDetails.findOneAndUpdate(
          { user: item.seller },
          { $inc: { credits: post.commission } }
        );
      } else {
        await Sellers.findOneAndUpdate(
          { _id: post.originalSeller },
          { $inc: { credits: post.commission } }
        );
      }

      return res.json({ success: true, order });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// order cancelled
router.patch("/:orderId/cancel", async (req, res) => {
  var id = req.params.orderId;

  try {
    const order = await orderFunctions.patchOrder(id, {
      order_status: "cancelled",
    });
    const items = order.clothes.map((item) => item.item);
    await changeClothingStatus(items, "Available");
    const updated = await Post.find({ _id: { $in: items } });
    await Orders.populate(order, { path: "clothes.item" });
    res.status(201).json({ success: true, order, items: updated });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

//order status to pending
router.patch("/:orderId/pending", async (req, res) => {
  const id = req.params.orderId;
  try {
    const changeOrder = await orderFunctions.changeOrder(id, "pending");
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
