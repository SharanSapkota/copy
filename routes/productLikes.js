const express = require("express");
const Post = require("../models/Post");
const Profiles = require("../models/Profiles");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.get("/likedProducts", AuthController.authBuyer, async (req, res) => {
  try {
    const likedPosts = await Profiles.findOne(
      { user: req.user.id },
      "liked_items"
    ).populate("liked_items");

    res.json(likedPosts);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.put(
  "/likeProduct/:postId",
  AuthController.authBuyer,
  async (req, res) => {
    try {
      const profile = await Profiles.findOneAndUpdate(
        { user: req.user.id },
        {
          $push: { liked_items: req.params.postId }
        },
        { new: true }
      );
      if (profile)
        res.status(200).json({ success: true, msg: "Added to wishlist." });
    } catch (err) {
      res.json(err);
    }
  }
);

router.put(
  "/unlikeProduct/:postId",
  AuthController.authBuyer,
  async (req, res) => {
    try {
      const profile = await Profiles.findOneAndUpdate(
        { user: req.user.id },
        {
          $pull: { liked_items: req.params.postId }
        },
        { new: true }
      );
      if (profile)
        res.status(200).json({ success: true, msg: "Removed from wishlist" });
    } catch (err) {
      res.json(err);
    }
  }
);

module.exports = router;
