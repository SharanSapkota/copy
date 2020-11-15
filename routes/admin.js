const express = require("express");
const mongoose = require("mongoose");


const router = express.Router();
const Seller = require('../models/Seller')
const Post = require('../models/Post')

router.get("/", (req,res) => {
    res.status(200).json("Success")
})

router.post("/seller", async (req,res) =>{
    const seller = new Seller(req.body)
    try {
        const savedSeller = await seller.save();
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