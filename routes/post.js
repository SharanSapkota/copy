const express = require("express");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const router = express.Router();

const { Post, Archive, Unverified } = require("../models/Post");
const AuthController = require("../controllers/authController");
const { updateItemsListed } = require("../functions/profileFunctions");
const limiter = require("./rateLimiter");

const postValidator = require("../controllers/validate");

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const { s3Upload } = require("../functions/s3upload");

const {
  postNewItem,
  updateItem,
  postWithoutPublish,
  getPostById,
  getPosts,
  getBestDeals,
} = require("../functions/postFunctions");

const { getUser } = require("../functions/users");

//GET ALL
router.get("/", async (req, res) => {
  const search = req.query.search;

  const filters = req.query.filters;

  var customQuery = {};
  if (filters && filters.length > 0) {
    let parsed = JSON.parse(filters);
    if (parsed.gender && parsed.gender.length > 0) {
      if (parsed.gender.includes("Men") && parsed.gender.includes("Women")) {
        customQuery.gender = { $in: ["Men", "Women", "All"] };
      } else {
        customQuery.gender = { $in: parsed.gender };
      }
    }

    if (parsed.category && parsed.category.length > 0)
      customQuery.category = { $in: parsed.category };
    if (parsed.condition && parsed.condition.length > 0)
      customQuery.condition = { $in: parsed.condition };
  }

  if (customQuery.gender)
    customQuery.gender.$in = [...customQuery.gender.$in, "both"];

  customQuery.status = "Available";
  customQuery.isPublished = true;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
    if (search) {
      customQuery.listing_name = { $regex: search, $options: "i" };
    }

    getAll = await Post.find(customQuery)
      .populate("seller", "username")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page: page,
      limit: limit,
      resultUsers: getAll,
    });
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

//GET BEST DEALS

router.get("/deals", async (req, res) => {
  const dealAmount = 25;

  let posts = await getBestDeals(dealAmount);

  if (posts.length > 0) {
    return res.json({ success: true, posts });
  } else {
    return res.json({ success: false, errors: [{ msg: "No deals found!" }] });
  }
});

// POST
router.post(
  "/",
  AuthController.authCheck,
  upload.fields([{ name: "images" }, { name: "data" }]),
  limiter,
  async (req, res) => {
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
      fabric,
    } = data;

    if (images !== undefined) {
      for (let i = 0; i < images.length; i++) {
        tempArr.push(await s3Upload(images[i]));
      }
    }

    data.images = tempArr;

    const postClothings = {};

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
    postClothings.platform_fee = data.selling_price * 0.15;
    postClothings.commission = data.selling_price * 0.85;
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
  try {
    const post = await getPostById(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: "Product Not Found!" });
  }
});

//GET ALL POSTS BY SELLER PROFILE

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await getUser({ username: req.params.username }, "username");
    const posts = await getPosts({ seller: user._id });
    return res.json({ success: true, posts });
  } catch (err) {
    return res.json({
      success: false,
      errors: [{ msg: "User not found." }],
    });
  }
});

//GET ALL POSTS BY USER
router.get("/seller/:userId", AuthController.authCheck, async (req, res) => {
  if (req.verified) {
    try {
      const posts = await Post.find({ seller: req.user._id })
        .select("-seller")
        .sort({ date: -1 });

      if (!posts.length > 0) {
        return res.status(400).json({
          success: false,
          error: { msg: "User has no clothes listed." },
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
          error: { msg: "User has no clothes listed." },
        });
      }
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
});

//DELETE
router.delete("/:postId", AuthController.authBuyer, async (req, res) => {
  const user = await getUser({ _id: req.user.id }, "role");

  if (user.role === "1") {
    await Post.findOne(
      { _id: req.params.postId, seller: req.user.id },
      function (err, result) {
        let swap = new Archive(result.toJSON()); //or result.toObject

        result.remove();
        swap.save();
        res.json(swap);
      }
    );
  } else {
    await Unverified.findOne(
      { _id: req.params.postId, seller: req.user.id },
      function (err, result) {
        let swap = new Archive(result.toJSON()); //or result.toObject

        result.remove();
        swap.save();
        res.json(swap);
      }
    );
  }
});

//UPDATE
router.patch(
  "/:postId",
  AuthController.authCheck,
  upload.fields([{ name: "images" }, { name: "data" }]),
  limiter,
  async (req, res) => {
    const images = req.files["images"];
    const prevImages =
      typeof req.body.images === "string" ? [req.body.images] : req.body.images;
    const imageIndexes =
      typeof req.body.imageIndexes === "string"
        ? [req.body.imageIndexes]
        : req.body.imageIndexes;

    const data = JSON.parse(req.body.data);

    const id = req.params.postId;

    let tempArr = [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        tempArr.push(await s3Upload(images[i]));
      }
    }

    if (!prevImages) {
      data.images = tempArr;
    } else {
      tempArr.forEach((image, index) => {
        data.images[parseInt(imageIndexes[index])] = image;
      });
    }

    const result = await updateItem(id, data, req.verified);

    if (result) {
      return res.json({ success: true, result });
    } else {
      return res.json({ success: false });
    }
  }
);

router.patch(
  "/unpublish/:postId",
  AuthController.authBuyer,
  async (req, res) => {
    const posts = await Post.findOne({
      _id: req.params.postId,
      seller: req.user.id,
    });
    const updateStatus = {};

    updateStatus.isPublished = !posts.isPublished;
    const updatedStatus = await Post.findOneAndUpdate(
      { _id: req.params.postId, seller: req.user._id },
      { $set: updateStatus }
    );

    if (updatedStatus) res.json({ ...updateStatus, success: true });
  }
);

module.exports = router;
