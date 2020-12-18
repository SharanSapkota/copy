const express = require("express");
const router = express.Router();
const Seller = require('../../models/admin/Seller');
const Orders = require("../../models/Orders");
const Post = require('../../models/Post')
const { validationResult } = require("express-validator");

const {postNewItem} = require('../../functions/postFunctions');

const AuthController = require("../../controllers/authController");

router.get("/seller", AuthController.authAdmin, async(req,res) => {
    const seller = await Seller.find({})
    res.status(200).json(seller)
})

router.get('/seller/:sellerId', AuthController.authAdmin,async(req,res) =>{
  try{
    const seller = await Seller.findById(req.params.sellerId) 
    res.json(seller) 
  }catch(err){
    res.json(err)
  }
})

router.patch('/seller/:sellerId',AuthController.authAdmin, async(req,res) =>{
  const seller = await Seller.findById(req.params.sellerId)
  if(seller.username === req.body.seller_name){
    seller.remove();
    res.json('success')
  }else{
    res.json('failure')
  }
})


router.get('/posts',AuthController.authAdmin, async(req,res) =>{
    const allPosts = await Post.find({testSeller : {  $exists : true}})
    res.status(200).json(allPosts)
})

router.post("/seller",AuthController.authAdmin, async (req,res) =>{

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

router.post("/post",AuthController.authAdmin, async (req,res) =>{

    const {
      listing_name,
      listing_type,
      occassion,
      gender,
      design,
      feature_image,
      purchase_price,
      images,
      selling_price,
      purchase_date,
      condition,
      category,
      measurement,
      fabric,
      color,
      testSeller
    } = req.body;

    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.end();
      // res.status(422).json({ success: false, errors: errors.array() });
    } else {
      const postClothings = {};

      postClothings.seller = req.user.id;
      postClothings.platform_fee = selling_price * 0.3;
      postClothings.commission = selling_price * 0.7;

      if (listing_name) {
        postClothings.listing_name = listing_name;
      }
      if (listing_type) {
        postClothings.listing_type = listing_type;
      }
      if (occassion) {
        postClothings.occassion = occassion;
      }
      if (gender) {
        postClothings.gender = gender;
      }
      if (category) {
        postClothings.category = category;
      }
      if (images) {
        postClothings.images = images;
      }
      if (design) {
        postClothings.design = design;
      }
      if (feature_image) {
        postClothings.feature_image = feature_image;
      }
      if (purchase_price) {
        postClothings.purchase_price = purchase_price;
      }
      if (selling_price) {
        postClothings.selling_price = selling_price;
      }
      if (purchase_date) {
        postClothings.purchase_date = purchase_date;
      }
      if (condition) {
        postClothings.condition = condition;
      }
      if (measurement) {
        postClothings.measurement = measurement;
      }
      if (fabric) {
        postClothings.fabric = fabric;
      }
      if (color) {
        postClothings.color = color;
      }
      if(testSeller){
        postClothings.testSeller = testSeller
      }

       const asd = postNewItem(postClothings)
       res.send(asd);
    }

})


router.patch('/orders/:orderId',AuthController.authAdmin, async(req,res) =>{
  try {
    const updateStatus = await Orders.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: req.body }
    );
    res.status(200).json(updateStatus);
  } catch (err) {
    res.status(400).json({ message: err });
  }
})

router.post("/orders",AuthController.authAdmin, async (req, res) => {

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