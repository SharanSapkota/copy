const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

router.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  try {
    // let regex = new RegExp(QUERY,'i');

    //    const search1 = await Post.find({listing_name: req.query.search})
    const abc = req.query.search;

    const search1 = await Post.find(
      { listing_name: { $regex: abc, $options: "i" } },
      function(err, docs) {
        console.log("Partial Search Begins");

        // console.log(docs);
        // res.json(docs)
      }
    );
    //  const search1 = await Post.find({listing_name: { $regex: "s" , $options: "i"} })
    console.log(req.query);
    // console.log(req.params.listing_name)
    res.json(search1);
  } catch (err) {
    res.json({ message: err });
  }
});
// var q = req.query.q

// Post.find({
//     listing_name:{
//         $regex: new RegExp(q)
//     }},
//     { _id: 0,
//     _v:0
// }, function(err, docs){
//     res.json(docs)
// }).limit(10)
//})

module.exports = router;
