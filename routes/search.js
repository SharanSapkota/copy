const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const abc = req.query.search;

    const search1 = await Post.find(
      { listing_name: { $regex: abc, $options: "i" } },
      function (err, docs) {
        console.log("Partial Search Begins");
      }
    );

    console.log(req.query);
    // console.log(req.params.listing_name)
    res.json(search1);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/searchAll", async (req, res) => {
  try {
    const searchFromBody = req.body.search;

    const search2 = await Post.find(
      { $regex: searchFromBody, $options: "i" },
      function (err, docs) {
        console.log("Partial Search for 'search all' Begins");
      }
    );

    console.log(req.query);
    // console.log(req.params.listing_name)
    res.json(search2);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
