const express = require("express");
const Post = require("../models/Post");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("I am in review");
});

// router.post("/review/:postId", AuthController.authBuyer, async (req, res) => {
//   try {
//     const reviewPost = await Post.findByIdAndUpdate(
//       req.params.postId,
//       { $push: { review: req.user._id } },
//       { new: true }
//     );
//     res.status(200).json(reviewPost);
//   } catch (err) {
//     res.json(err);
//   }
// });

module.exports = router;
