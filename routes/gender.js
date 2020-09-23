const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/men", async (req, res) => {
  try {
    const menPost = await Post.find({ gender: "men" });
    res.json(menPost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/women", async (req, res) => {
  try {
    const womenPost = await Post.find({ gender: "women" });
    res.json(womenPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
