const express = require("express");
const jwt = require("jsonwebtoken");
// const pagination = require('../pagination/pagination');
// const verifyToken = require('../controllers/jwtVerify')

const router = express.Router();
const Post = require("../models/Post");
// const multer = require('multer')

//GET ALL
router.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");


  try {
    const getAll = await Post.find();
    // res.status(200).json(getAll);

    const page = req.query.page
    const limit = req.query.limit

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const resultUsers = getAll.slice(startIndex, endIndex)


    
 
    res.json(resultUsers)





  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// POST
router.post("/", async (req, res) => {
  //Jwt verification

  // jwt.verify(req.token, process.env.SECRET_KEY, (err, data) => {
  //     if (err) {
  //         res.status(403)
  //     }
  //     else{
  //         res.json({
  //             data,
  //             text: "this is protected"
  //         })
  //     }
  // })

  const {
    listing_name,
    listing_type,
    occassion,
    gender,
    design,
    feature,
    purchase_price,
    images,
    selling_price,
    commission,
    platform_fee,
    purchase_date,
    condition,
    likes,
    category,
    measurement,
    fabric,
    color,
    status
  } = req.body;

  const postClothings = {};

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
  if (feature) {
    postClothings.feature = feature;
  }
  if (purchase_price) {
    postClothings.purchase_price = purchase_price;
  }
  if (selling_price) {
    postClothings.selling_price = selling_price;
  }
  if (commission) {
    postClothings.commission = commission;
  }
  if (platform_fee) {
    postClothings.platform_fee = platform_fee;
  }
  if (purchase_date) {
    postClothings.purchase_date = purchase_date;
  }
  if (likes) {
    postClothings.likes = likes;
  }
  if (status) {
    postClothings.status = status;
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

  const posts = new Post(postClothings);
  try {
    const savedPost = await posts.save();




    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//GET BY ID
router.get("/:postId", async (req, res) => {
  console.log(req.params.postId);
  try {
    const posts = await Post.findById(req.params.postId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//DELETE
router.delete("/:postId", async (req, res) => {
  try {
    const removedPosts = await Post.remove({ _id: req.params.postId });
    res.status(200).json(removedPosts);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//UPDATE
router.patch("/:postId", async (req, res) => {
  try {
    const {
      listing_name,
      listing_type,
      occassion,
      gender,
      design,
      feature,
      purchase_price,

      selling_price,
      commission,
      platform_fee,
      purchase_date,
      condition,
      likes,
      measurement,
      fabric,
      color,
      status
    } = req.body;

    const update = {};

    if (listing_name) {
      update.listing_name = req.body.listing_name;
    }
    if (listing_type) {
      update.listing_type = req.body.listing_type;
    }
    if (occassion) {
      update.occasion = req.body.occasion;
    }
    if (gender) {
      update.gender = req.body.gender;
    }
    if (design) {
      update.design = req.body.design;
    }
    if (feature) {
      update.feature = req.body.feature;
    }
    if (purchase_price) {
      update.purchase_price = req.body.purchase_price;
    }
    if (selling_price) {
      update.selling_price = req.body.selling_price;
    }
    if (commission) {
      update.commission = req.body.commission;
    }
    if (platform_fee) {
      update.platform_fee = req.body.platform_fee;
    }
    if (purchase_date) {
      update.purchase_date = req.body.purchase_date;
    }
    if (likes) {
      update.likes = req.body.likes;
    }
    if (status) {
      update.status = req.body.status;
    }
    if (condition) {
      update.condition = req.body.condition;
    }
    if (measurement) {
      update.measurement = req.body.measurement;
    }
    if (fabric) {
      update.fabric = req.body.fabric;
    }
    if (color) {
      update.color = req.body.color;
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId },

      { $set: update }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});


module.exports = router;
