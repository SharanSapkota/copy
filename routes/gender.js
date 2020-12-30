const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const functions = require('../functions/genders')

router.get("/:gender", async (req, res) => {
  
  try {
   const genderPost = await functions(req)
    res.json(genderPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
