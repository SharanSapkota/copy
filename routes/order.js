const express = require("express");
const Order = require("../models/Orders");
const User = require("../models/Users");
const Post = require("../models/Post");
const UserDetails = require("../models/UserDetails");

const mail = require ("../pagination/nodemailer")
const orderFunctions = require("../functions/orders")

const AuthController = require("../controllers/authController");

const { createNotification } = require("../functions/notificationFunctions");

const router = express.Router();
var a;

router.get("/",  async(req, res) => {
    const getAllOrder = await orderFunctions.getAllOrders()

    res.json(getAllOrder)
});

router.get("/:orderId", async (req, res) => {
  var id = req.params.orderId
    var getOrderById1 = await orderFunctions.getOrderById(id, "clothes")

    console.log(getOrderById1)

    res.json(getOrderById1);

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
    
    const postOrder = await orderFunctions.postOrder(clothes, "seller")
      console.log(postOrder)
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

router.patch("/:orderId", async (req, res) => {
  const id = req.params.orderId

  const { pickup_location, delivery_location } = req.body;

  orderUpdateDestructure = {};

  if (pickup_location) {
    orderUpdateDestructure.pickup_location = pickup_location;
  }
  if (delivery_location) {
    orderUpdateDestructure.delivery_location = delivery_location;
  }

  try {
    const patchOrders = await orderFunctions.patchOrder(id, orderUpdateDestructure)

    res.status(200).json(patchOrders);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Change Order
router.patch("/:orderId/complete", async (req, res) => {
var id = req.params.orderId;
  try {
    const changeOrder = await orderFunctions.changeOrder(id, "completed")
   
    if(changeOrder){
     changeOrder.save();  
     res.status(201).json(changeOrder);
    }
    else {
      res.status(404).json({error: "Order not found."})
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Change Order
router.patch("/:orderId/cancel", async (req, res) => {
  var id = req.params.orderId;

  try {
    const changeOrder = await orderFunctions.changeOrder(id, "cancelled")
    if(changeOrder){
     changeOrder.save();  
     res.status(201).json(changeOrder); 
    }
    else {
      res.status(404).json({error: "Order not found."})
    }

  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Change Order
router.patch("/:orderId/pending", async (req, res) => {
const id = req.params.orderId;
  try {
    const changeOrder = await orderFunctions.changeOrder(id, "pending")
    if(changeOrder){
     changeOrder.save();  
     res.status(201).json(changeOrder);
    }
    else {
      res.status(404).json({error: "Order not found."})
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
);

router.get("/to/", AuthController.authBuyer, async (req, res) => {
  let ordersArr = [];

  Order.find()
    .populate({
      path: "clothes"
    })
    .sort({ date: -1 })
    .exec(function(err, orders) {
      let ordersArr = [];
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
