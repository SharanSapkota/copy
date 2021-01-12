const express = require("express");
const orderFunctions = require("../../../functions/orders");
const AuthController = require("../../../controllers/authController");

const router = express.Router();

//Get all orders
router.get(
  "/",
  // AuthController.authAdmin,
  async (req, res) => {
    const getAllOrders = await orderFunctions.getAllOrders();
    res.status(200).json(getAllOrders);
  }
);

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
