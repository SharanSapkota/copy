const express = require("express");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const router = express.Router();

const { Post, Archive, Unverified } = require("../models/Post");
const AuthController = require("../controllers/authController");
const { updateItemsListed } = require("../functions/profileFunctions");
const limiter = require("./rateLimiter");
const functions = require("../functions/posts")

const postValidator = require("../controllers/validate");

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const { s3Upload } = require("../functions/s3upload");

const {
  postNewItem,
  postWithoutPublish
} = require("../functions/postFunctions");

//GET ALL
router.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("this is the all post")

  const abc = req.query.search;

  const filters = req.query.filters;

  var customQuery = {};
  if (filters && filters.length > 0) {
    let parsed = JSON.parse(filters);
    if (parsed.gender && parsed.gender.length > 0)
      customQuery.gender = { $in: parsed.gender };
    if (parsed.category && parsed.category.length > 0)
      customQuery.category = { $in: parsed.category };
  }

  if (customQuery.gender)
    customQuery.gender.$in = [...customQuery.gender.$in, "both"];

  customQuery.status = "Available";

  try {
    let getAll;
    if (!abc) {
      getAll = await Post.find(customQuery)
        .populate("seller", "username")
        .sort({ date: -1 });
    } else {
      customQuery.listing_name = { $regex: abc, $options: "i" };
      getAll = await Post.find(customQuery)
        .populate("seller", "username")
        .sort({ date: -1 });
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < getAll.length) {
      result.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit
      };
    }

    result.resultUsers = getAll.slice(startIndex, endIndex);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// POST
router.post(
  "/",
  AuthController.authCheck,
  upload.fields([
    { name: "images" },
    { name: "feature_image" },
    { name: "data" }
  ]),
  limiter,
  async (req, res) => {
    const feature_image = req.files["feature_image"];

    const images = req.files["images"];

    const data = JSON.parse(req.body.data);

    let tempArr = [];

    const {
      listing_name,
      description,
      category,
      gender,
      purchase_price,
      selling_price,
      condition,
      purchase_date,
      measurements,
      brand,
      color,
      fabric
    } = data;

    data.feature_image = await s3Upload(feature_image[0]);

    if (images !== undefined) {
      for (let i = 0; i < images.length; i++) {
        tempArr.push(await s3Upload(images[i]));
      }
    }

    data.images = tempArr;

    const postClothings = {};

    postClothings.platform_fee = selling_price * 0.15;
    postClothings.commission = selling_price * 0.85;

    postClothings.seller = req.user.id;

    if (listing_name) {
      postClothings.listing_name = listing_name;
    }
    if (description) {
      postClothings.description = description;
    }
    if (gender) {
      postClothings.gender = gender;
    }
    if (category) {
      postClothings.category = category;
    }
    if (data.images) {
      postClothings.images = data.images;
    }
    if (data.feature_image) {
      postClothings.feature_image = data.feature_image;
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
    if (measurements) {
      postClothings.measurements = measurements;
    }
    if (brand) {
      postClothings.brand = brand;
    }
    if (fabric) {
      postClothings.fabric = fabric;
    }
    if (color) {
      postClothings.color = color;
    }
    if (req.verified) {
      const result = await postNewItem(postClothings);
      if (result) {
        updateItemsListed(req.user.id);

      }
      res.send(result);
    } else {
      const result = await postWithoutPublish(postClothings);
      res.send(result);
    }
  }
);


//GET BY ID
router.get("/:postId", async (req, res) => {

  console.log("this is the post by id")
  try {

    
    const posts = await functions.getPostById(req.params.postId)
    // const posts = await Post.findById(req.params.postId).populate(
    //   "seller",
    //   "username"
    // );
    console.log(posts)
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: "Product Not Found!" });
  }
});

//GET ALL POSTS BY SELLER
router.get("/seller/:userId", AuthController.authCheck, async (req, res) => {
  if (req.verified) {
    try {
      const posts = await Post.find({ seller: req.user._id })
        .select("-seller")
        .sort({ date: -1 });

      if (!posts.length > 0) {
        return res.status(400).json({
          success: false,
          error: { msg: "User has no clothes listed." }
        });
      }
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  } else {
    try {
      const posts = await Unverified.find({ seller: req.user._id })
        .select("-seller")
        .sort({ date: -1 });

      if (!posts.length > 0) {
        return res.status(400).json({
          success: false,
          error: { msg: "User has no clothes listed." }
        });
      }
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
});

//DELETE
router.delete("/:postId", AuthController.authSeller, async (req, res) => {
  await mongoose
    .model("Posts")
    .findOne({ _id: req.params.postId, seller: req.user._id }, function(
      err,
      result
    ) {
      let swap = new Archive(result.toJSON()); //or result.toObject

      result.remove();
      swap.save();
      res.json(swap);
    });
});

//UPDATE
router.patch("/:postId", AuthController.authSeller, async (req, res) => {
  try {
    const {
      listing_name,
      
      occassion,
      gender,
      
      feature_image,
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
   
    if (occassion) {
      update.occasion = req.body.occasion;
    }
    if (gender) {
      update.gender = req.body.gender;
    }
   
    if (feature_image) {
      update.feature_image = req.body.feature_image;
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
      { _id: req.params.postId, seller: req.user._id },
      { $set: update },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.patch(
  "/unpublish/:postId",
  AuthController.authSeller,
  async (req, res) => {
    const posts = await Post.findById(req.params.postId);
    const updateStatus = {};

    if (posts.status == "Available") {
      updateStatus.status = "notAvailable";
    } else {
      updateStatus.status = "Available";
    }
    const updatedStatus = await Post.findOneAndUpdate(
      { _id: req.params.postId, seller: req.user._id },
      { $set: updateStatus }
    );

    if (updatedStatus) res.json({ ...updateStatus });
  }
);

module.exports = router;
