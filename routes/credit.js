const express = require("express");
const router = express.Router();
const UserDetailModel = require("../models/UserDetails");
const UsersModel = require("../models/Users");
const updateCredits = require("../controllers/updateCredits");

router.get("/", async (req, res) => {
  const users = await UserDetailModel.find().populate("user");
  if (users) res.status(200).json({ users });

  res.end();
});

router.get("/:customer", async (req, res) => {
  const username = req.params.customer;
  const customerUser = await UsersModel.findOne({ username: username });

  const customer = await UserDetailModel.findOne({
    user: customerUser._id
  }).populate({
    path: "user"
  });

  if (!customer) {
    res.status(400).json({ error: "User not found.", success: false });
  } else {
    res.status(200).json({
      userId: customer.id,
      username: customerUser.username,
      name: customer.name,
      credits: customer.credits,
      success: true
    });
  }
});

router.patch("/:userId/redeem", async (req, res) => {
  const { creditAmount, customerPin } = req.body;

  await UserDetailModel.findOne({ _id: req.params.userId }).then(user => {
    if (user.pincode === customerPin) {
      if (user.credits > 0) {
        if (user.credits > creditAmount) {
          const updatedCredits = updateCredits(user.credits, creditAmount, "-");

          user.credits = updatedCredits;

          user.save();

          res.status(200).json({ updatedCredits: user.credits, success: true });
        } else {
          res.status(400).json({
            error: {
              title: "Not Enough Credits",
              description: "Customer doesn't have enough credits to redeem."
            },
            success: false
          });
        }
      } else {
        res.status(400).json({
          error: {
            title: "No Credits Available",
            description: "User doesn't have enough credits available."
          },
          success: false
        });
      }
    } else {
      res.status(400).json({
        error: {
          title: "PIN Invalid",
          description: "Please check and re-enter your PIN code."
        },
        success: false
      });
    }
  });
});

router.patch("/:userId/add", async (req, res) => {
  const { creditAmount } = req.body;
  await UserDetailModel.findOne({ _id: req.params.userId }).then(user => {
    if (!user.credits) {
      user.credits = creditAmount;
      user.save();
      res.status(200).json({ success: true, user: user });
    } else {
      const updatedCredits = user.credits
        ? updateCredits(user.credits, creditAmount, "+")
        : creditAmount;

      user.credits = updatedCredits;
      user.save();
      res.status(200).json({ success: true, user: user });
    }
  });
});

module.exports = router;
