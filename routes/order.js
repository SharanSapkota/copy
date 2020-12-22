const express = require("express");
const Order = require("../models/Orders");
const User = require("../models/Users");
const Post = require("../models/Post");
const UserDetails = require("../models/UserDetails");
const mail = require ("../pagination/nodemailer")
const orderFunctions = require("../functions/orders")

const router = express.Router();
var a;

router.get("/",  async(req, res) => {
    const getAllOrder = await orderFunctions.getAllOrders()

    res.json(getAllOrder)

  // res.send('I am in order.js')
});

router.get("/:orderId", async (req, res) => {
  var id = req.params.orderId
    var getOrderById1 = await orderFunctions.getOrderById(id, "clothes")

    console.log(getOrderById1)

    res.json(getOrderById1);

});

router.post("/", async (req, res) => {
  const { buyer, clothes } = req.body;
  orderDestructure = {};

  if (buyer) {
    orderDestructure.buyer = buyer;
    orderDestructure.delivery_location = buyer.address;
  }
  if (clothes) {
    orderDestructure.clothes = clothes;
  }

  orderDestructure.delivery_charge = 100;

  try {
    
    const postOrder = await orderFunctions.postOrder(clothes, "seller")
      console.log(postOrder)
  //  const postOrder = await Post.findById(clothes).populate('seller')
   
   // orderDestructure.total_amount = postOrder.selling_price;

    orderDestructure.total_order_amount =
      orderDestructure.delivery_charge + orderDestructure.total_amount;

      console.log(orderDestructure.total_order_amount)


    const seller = await UserDetails.findOne({ user: postOrder.seller });

    orderDestructure.pickup_location = seller.address;

    const orderPost = new Order(orderDestructure);
    try {
      orderPost.save();
      postOrder.status = "Processing";
      postOrder.save();
      res
        .status(200)
        .json({ success: true, msg: "Order placed successfully!" });

        console.log(postOrder.feature_image)

        const sellerEmail = postOrder.seller.email
       

        const mailt = {subject:"New Order Alert!", html :`<h2> wants </h2> to buy ${postOrder.listing_name}`}

     mail (sellerEmail, mailt)
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
});


router.get("/to/:UserId", async (req, res) => {
  let ordersArr = [];
  console.log(req.params.UserId);

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
        console.log(order)
        if (
          order.clothes.seller == req.params.UserId ||
          order.buyer == req.params.UserId
        ) {
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

router.get("/cancelorder", (req, res) => {
  res.send("I am in cancel order.js");
});

module.exports = router;
