const express = require("express");
const router = express.Router();
const Seller = require('../../models/admin/Seller');
const Orders = require("../../models/Orders");
const Post = require('../../models/Post')
const Evaluation = require('../../models/admin/Evaluation')
const { validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const {s3Upload} = require('../../functions/s3upload')

const {postNewItem} = require('../../functions/postFunctions');

const AuthController = require("../../controllers/authController");
const { AlexaForBusiness } = require("aws-sdk");

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

    

    const sellers = new Seller(data)
    
    try {
        const savedSeller = await sellers.save();
        res.json(savedSeller);
        console.log('success')
      } catch (err) {
        res.json({ message: err });
      }
})

router.post("/post",AuthController.authAdmin, upload.fields([{name: 'images'}, {name: 'featured'}, {name : 'data'}]), async (req,res,next) =>{

    const featured = req.files['featured']

    const images = req.files['images']

    const data = JSON.parse(req.body.data)

    let tempArr = []

    data.feature_image = await s3Upload(featured[0])

    if(images!== undefined){
      for(let i = 0; i< images.length; i++){
        tempArr.push(await s3Upload(images[i]))
      }
    }

    data.images = tempArr

    const seller = await Seller.findOne({usercode : data.testSeller})

    const categoryCode = data.category.slice(0,2).toUpperCase();

    const errors = validationResult(data);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.end();
      // res.status(422).json({ success: false, errors: errors.array() });
    } else {
      const postClothings = {};

      postClothings.seller = req.user.id;
      postClothings.platform_fee = data.selling_price * 0.3;
      postClothings.commission = data.selling_price * 0.7;

      if(data.images){
        postClothings.images = data.images
      }
      if(data.feature_image){
        postClothings.feature_image = data.feature_image
      }

      if (data.listing_name) {
        postClothings.listing_name = data.listing_name;
      }
      if (data.listing_type) {
        postClothings.listing_type = data.listing_type;
      }
      if (data.occassion) {
        postClothings.occassion = data.occassion;
      }
      if (data.gender) {
        postClothings.gender = data.gender;
      }
      if (data.category) {
        postClothings.category = data.category;
      }
      if (data.design) {
        postClothings.design = data.design;
      }
      if (data.purchase_price) {
        postClothings.purchase_price = data.purchase_price;
      }
      if (data.selling_price) {
        postClothings.selling_price = data.selling_price;
      }
      if (data.purchase_date) {
        postClothings.purchase_date = data.purchase_date;
      }
      if (data.condition) {
        postClothings.condition = data.condition;
      }
      if (data.measurement) {
        postClothings.measurement = data.measurement;
      }
      if (data.fabric) {
        postClothings.fabric = data.fabric;
      }
      if (data.color) {
        postClothings.color = data.color;
      }
      if(data.testSeller){
        postClothings.testSeller = seller.id
        
        var asd = data.testSeller.concat(categoryCode)

        asd = asd.concat('-')
        
        const dataz = await Post.find({ item_code : {$regex : "^" + asd + "[0-9]*\-[0-9]*$"}}).sort({date: -1})

        let tempCode ;

        if(dataz.length == 0){
          tempCode = '001'
        }else{
          let temp =  dataz[0].item_code.match(/\d+/g)

          let tempCodeEndA = parseInt(temp[1], 10)

          tempCodeEndA ++

          if(tempCodeEndA < 10 ){
            tempCodeEndA = '00' + tempCodeEndA 
          }
          if(tempCodeEndA > 9 && tempCodeEndA < 100){
            tempCodeEndA = '0' + tempCodeEndA
          }

          tempCode = tempCodeEndA
        }

        asd = asd.concat(tempCode)

        asd = asd.concat('-')

        asd = asd.concat(data.boxNumber)
        
        postClothings.item_code = asd

      }

       const post = postNewItem(postClothings)
       const ePost = Evaluation.findByIdAndUpdate(data.evId, {status: 'completed'})
       res.send({success: true});
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