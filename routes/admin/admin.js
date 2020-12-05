const express = require("express");
const router = express.Router();
const Seller = require('../../models/admin/Seller');
const Orders = require("../../models/Orders");
const Post = require('../../models/Post')

router.get("/seller", async(req,res) => {
    const seller = await Seller.find({})
    res.status(200).json(seller)
})

router.get('/seller/:sellerId', async(req,res) =>{
  try{
    const seller = await Seller.findById(req.params.sellerId) 
    res.json(seller) 
  }catch(err){
    res.json(err)
  }
})

router.patch('/seller/:sellerId', async(req,res) =>{
  const seller = await Seller.findById(req.params.sellerId)
  if(seller.username === req.body.seller_name){
    seller.remove();
    res.json('success')
  }else{
    res.json('failure')
  }
})

router.get('/posts', async(req,res) =>{
    const allPosts = await Post.find({testSeller : {  $exists : true}})
    res.status(200).json(allPosts)
})

router.post("/seller", async (req,res) =>{

  const data = req.body;
  let usercode = req.body.username.split(' ').map((x) =>{
    return x[0].toUpperCase()
  }).join("")

  // console.log(usercode)

  const seller = await Seller.find({ usercode : {$regex : "^" + usercode + "[0-9]*$"}}).sort({date: -1})

  let tempCodeEnd;
  
  if(seller.length == 0){
    // console.log('here')
    tempCodeEnd = '00'
  }else{
    let tempCode =  seller[0].usercode.match(/\d+/g)

    // console.log(tempCode[0])

    let tempCodeEndA = parseInt(tempCode[0],10)

    tempCodeEndA ++;

    if( tempCodeEndA < 9){
      tempCodeEndA = "0" + tempCodeEndA
    }else{
      tempCodeEndA = tempCodeEndA
    }

    tempCodeEnd = tempCodeEndA

  }

  data.usercode = usercode.concat(tempCodeEnd)

  console.log(data)

    const sellers = new Seller(data)
    
    try {
        const savedSeller = await sellers.save();
        res.json(savedSeller);
        console.log('success')
      } catch (err) {
        res.json({ message: err });
      }
})

router.post("/post", async (req,res) =>{
    console.log(req.body)

    const post = new Post(req.body)
    try{
        const savedPost = await post.save();
        res.json(savedPost);
      } catch (err) {
        res.json({ message: err });
      }
})

// router.post('/orders', async (req,res) =>{
//   console.log(req.body)
//   const order = new Orders(req.body)
//   order.save().then((res) =>{
//     res.json(res.status)
//   })
// })

router.patch('/orders/:orderId', async(req,res) =>{
  try {
    const updateStatus = await Orders.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: req.body }
    );
    res.status(201).json(updateStatus);
  } catch (err) {
    res.status(400).json({ message: err });
  }
})



router.post("/orders", async (req, res) => {

  const { buyerTest, clothes, delivery_location } = req.body;
  orderDestructure = {};

  if (buyerTest) {
    orderDestructure.buyerTest = buyerTest;
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

    const seller = await Seller.findById(orderClothes.testSeller);

    orderDestructure.pickup_location = seller.address;

    const orderPost = new Orders(orderDestructure);

    try {
      orderPost.save().then(async(res) =>{
        await Seller.findByIdAndUpdate({_id : orderClothes.testSeller}, {$inc : {credits: orderClothes.selling_price}})

        res.status(200).json({ success: true, msg: "Order placed successfully!" });
      }).catch(err => res.status(400).json(err))

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

module.exports = router;