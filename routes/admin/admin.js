const express = require("express");
const router = express.Router();
const Seller = require('../../models/admin/Seller');
const Orders = require("../../models/Orders");
const Post = require('../../models/Post')

router.get("/seller", async(req,res) => {
    const seller = await Seller.find({})
    res.status(200).json(seller)
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

module.exports = router;