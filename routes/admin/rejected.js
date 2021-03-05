const express = require("express");
const { Rejections, Evaluation } = require("../../models/admin/Evaluation");

const router = express.Router();

// Get All Evaluation
const AuthController = require("../../controllers/authController");

router.get("/", AuthController.authAdmin, async (req, res) => {
  const posts = await Rejections.find().populate("seller").sort({ date: -1 });

  res.status(200).json({ success: true, posts });
});

router.delete("/:evaluationId", async (req, res) => {
  const deleteId = req.params.evaluationId;
  const deleted = await Rejections.deleteOne({ _id: deleteId });
  console.log(deleted);
  if (deleted.deletedCount > 0) {
    return res.json({ success: true });
  } else {
    res.status(400).json({ message: "Evaluation not found" });
  }
});

router.post(
  "/revert/:evaluationId",
  AuthController.authAdmin,
  async (req, res) => {
    const rejectId = req.params.evaluationId;
    try {
      await Rejections.findOne({ _id: rejectId }, async (err, result) => {
        try {
          let swap = new Evaluation(result.toJSON()); //or result.toObject

          await result.remove();
          await swap.save();
          await Evaluation.populate(swap, { path: "seller" });
          res.status(200).json({ success: true, swap });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ message: err.message });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
