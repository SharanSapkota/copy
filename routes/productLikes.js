const express = require("express");
const Post = require("../models/Post");
const Profiles = require("../models/Profiles");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.get("/", async (req, res) => {
  res.json("I am in the like route");
});

router.put("/:postId", AuthController.authUser, async (req, res) => {
  try {
    const likesCount = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { likes: req.user._id } },
      { new: true }
    );
    res.status(200).json(likesCount);
  } catch (err) {
    res.json(err);
  }
});

router.put(
  "/likeProduct/:postId",
  AuthController.authUser,
  async (req, res) => {
    try {
      const profile = await Profiles.findOneAndUpdate(
        { user: req.user.id },
        {
          $push: { liked_items: req.params.postId }
        },
        { new: true }
      );
      res.status(200).json(profile);
    } catch (err) {
      res.json(err);
    }
  }
);

router.put(
  "/unlikeProduct/:postId",
  AuthController.authUser,
  async (req, res) => {
    try {
      const profile = await Profiles.findOneAndUpdate(
        { user: req.user.id },
        {
          $pull: { liked_items: req.params.postId }
        },
        { new: true }
      );
      res.status(200).json(profile);
    } catch (err) {
      res.json(err);
    }
  }
);

router.get("/unlike/:postId", AuthController.authUser, async (req, res) => {
  res.json("I am in the unlike route");
});

router.put("/unlike/:postId", async (req, res) => {
  try {
    const unlikesCount = await Post.findByIdAndUpdate(
      req.params.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    res.status(200).json(unlikesCount);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
