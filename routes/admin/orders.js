const express = require("express");
const orderFunctions = require("../../functions/admins/orders");
const Orders = require("../../models/Orders");
const AuthController = require("../../controllers/authController");

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

router.post("/orders", AuthController.authAdmin, async (req, res) => {
  const {
    buyerTest,
    phone_number,
    clothes,
    delivery_location,
    delivery_type,
  } = req.body;
  orderDestructure = {};

  if (
    !buyerTest ||
    !phone_number ||
    !clothes ||
    !delivery_location ||
    !delivery_type
  ) {
    return res.json({
      success: false,
      errors: [{ msg: "All fields are required." }],
    });
  }

  orderDestructure.buyer = buyerTest;

  orderDestructure.phone_number = phone_number;

  orderDestructure.clothes = {
    item: clothes,
    seller: req.user.id,
  };

  orderDestructure.delivery_location = delivery_location;

  orderDestructure.delivery_type = delivery_type;

  orderDestructure.delivery_charge =
    delivery_type === "Inside Ringroad"
      ? 100
      : delivery_type === "Outside Ringroad"
      ? 150
      : delivery_type === "Outside Valley"
      ? 250
      : 100;

  try {
    const orderClothes = await Post.findById(clothes);

    orderDestructure.total_amount = orderClothes.selling_price;

    orderDestructure.total_order_amount =
      orderDestructure.delivery_charge + orderDestructure.total_amount;

    orderDestructure.pickup_location = "Antidote Apparel, Kupondole, Lalitpur";

    const orderPost = new Orders(orderDestructure);

    orderPost.save();
    await changeClothingStatus(clothes, "Unavailable");

    // console.log(orderPost)

    console.log(orderClothes);

    // if(orderClothes.payment_status === "completed") {
    //   await Seller.findByIdAndUpdate(
    //     {_id: orderClothes.originalSeller},
    //     { $inc: { credits: orderClothes.selling_price } }
    //   )
    // }

    // .then(async res => {
    //   await Seller.findByIdAndUpdate(
    //     { _id: orderClothes.originalSeller },
    //     { $inc: { credits: orderClothes.selling_price } }
    //   );

    // })

    return res
      .status(200)
      .json({ success: true, msg: "Order placed successfully!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, errors: { msg: "Order failed." } });
  }
});

// Update order
router.patch("/:orderId", async (req, res) => {
  const id = req.params.orderId;

  const { pickup_location, delivery_location } = req.body;

  orderUpdateDestructure = {};

  if (pickup_location) {
    orderUpdateDestructure.pickup_location = pickup_location;
  }
  if (delivery_location) {
    orderUpdateDestructure.delivery_location = delivery_location;
  }

  try {
    const patchOrders = await orderFunctions.patchOrder(
      id,
      orderUpdateDestructure
    );

    res.status(200).json(patchOrders);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// get orders by Id
router.get("/:orderId", async (req, res) => {
  var id = req.params.orderId;
  var getOrderById1 = await orderFunctions.getOrderById(id, "clothes");

  console.log(getOrderById1);

  res.json(getOrderById1);
});

// order complete
router.patch("/:orderId/complete", async (req, res) => {
  var id = req.params.orderId;
  try {
    const changeOrder = await orderFunctions.changeOrder(id, "completed");

    if (changeOrder) {
      changeOrder.save();
      res.status(201).json(changeOrder);
    } else {
      res.status(404).json({ error: "Order not found." });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// order cancelled
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
