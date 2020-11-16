const express = require("express");
const router = express.Router();
const Seller = require('../../models/admin/Seller')
const Post = require('../../models/Post')

router.get("/seller", async(req,res) => {
    const seller = await Seller.find({})
    res.status(200).json(seller)
})

router.post("/seller", async (req,res) =>{
    const sellers = new Seller(req.body)
    try {
        const savedSeller = await sellers.save();
        res.json(savedSeller);
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

module.exports = router;