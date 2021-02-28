const express = require("express");
const { Rejections } = require("../../models/admin/Evaluation");

const router = express.Router();

// Get All Evaluation
const AuthController = require("../../controllers/authController");

router.get("/", AuthController.authAdmin, async (req, res) => {
  const posts = await Rejections.find().populate("seller").sort({ date: -1 });

  res.status(200).json({ success: true, posts });
});

module.exports = router;
