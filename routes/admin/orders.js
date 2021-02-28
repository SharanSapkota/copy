const express = require("express");
const orderFunctions = require("../../functions/admins/orders");
const Orders = require("../../models/Orders");
const AuthController = require("../../controllers/authController");

const {
  getTotalAmount,
  changeClothingStatus,
} = require("../../functions/postFunctions");

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
    await changeClothingStatus(items, "Unavailable");

    return res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, errors: [{ msg: "Server Error." }] });
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
