const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const router = express.Router();

const Users = require("../models/Users");
const Post = require("../models/Post");
const AuthController = require("../controllers/authController");
const limiter = require("./rateLimiter");

const postValidator = require("../controllers/validate");
const { CostExplorer } = require("aws-sdk");

//GET ALL
router.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

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
   AuthController.authUser,
  // postValidator("createPostValidation"),
  limiter,
  async (req, res) => {
    const {
      listing_name,
      listing_type,
      occassion,
      gender,
      design,
      feature_image,
      purchase_price,
      images,
      selling_price,
      purchase_date,
      condition,
      category,
      measurement,
      fabric,
      color,
      testSeller
    } = req.body;

    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.end();
      // res.status(422).json({ success: false, errors: errors.array() });
    } else {
      const postClothings = {};

      postClothings.platform_fee = selling_price * 0.3;
      postClothings.commission = selling_price * 0.7;

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
      if (feature_image) {
        postClothings.feature_image = feature_image;
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
      if (measurement) {
        postClothings.measurement = measurement;
      }
      if (fabric) {
        postClothings.fabric = fabric;
      }
      if (color) {
        postClothings.color = color;
      }

console.log(req.user.id)

      if(testSeller) {
        postClothings.seller = req.user.id
      }
     
      const posts = new Post(postClothings);
       
      
      try {
      
        const savedPost = await posts.save();
        
        if (savedPost) {
          res.send(savedPost);
        }
        res.end();
      } catch (err) {
        console.log("err");
      }
    }
  }
);

//GET BY ID
router.get("/:postId", async (req, res) => {
  try {
    const posts = await Post.findById(req.params.postId).populate(
      "seller",
      "username"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: "Product Not Found!" });
  }
});

//GET ALL POSTS BY SELLER
router.get("/seller/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ seller: req.params.userId })
      .select("-seller")
      .sort({ date: -1 });

    if (!posts.length > 0) {
      return res.status(400).json({
        success: false,
        error: { msg: "Seller has no clothes listed." }
      });
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < posts.length) {
      result.next = {
        page: page + 1,
        limit: limit
      };
      console.log("here");
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit
      };
    }

    result.resultUsers = posts.slice(startIndex, endIndex);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

//DELETE
router.delete("/:postId", async (req, res) => {
  await mongoose
    .model("Posts")
    .findById({ _id: req.params.postId }, function(err, result) {
      console.log(result);

      let swap = new (mongoose.model("archievePosts"))(result.toJSON()); //or result.toObject

      result.remove();
      swap.save();
      res.json(swap);
    });

  // try {
  //   const removedPosts = await Post.remove({ _id: req.params.postId });
  //   res.status(200).json(removedPosts);
  // } catch (error) {
  //   res.status(404).json({ message: error });
  // }
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
      { _id: req.params.postId },

      { $set: update }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err });
  }

})

  router.patch('/unpublish/:postId', async (req, res) => {
    
    const posts = await Post.findById(req.params.postId)
    console.log(posts.status)
    const updateStatus = {}
  
    if (posts.status == "Available") {
  
       updateStatus.status = "notAvailable"
    }
     else{
  
        updateStatus.status = "Available"
     
      }
      const updatedStatus = await Post.findOneAndUpdate (
        {_id: req.params.postId}, 
        { $set: updateStatus}
        )
        // console.log(updatedStatus)
        
        if(updatedStatus) res.json({...updateStatus})
       
      
});

module.exports = router;
