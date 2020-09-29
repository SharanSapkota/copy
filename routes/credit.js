const express = require("express");
const router = express.Router();
const UserDetailModel = require("../models/UserDetails");
const UsersModel = require("../models/Users");
const updateCredits = require("../controllers/updateCredits");
const nodemailer = require("nodemailer");
require("dotenv/config");

const mailing = require("../pagination/nodemailer");

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

router.get("/test/email", (req, res) => {
  const { creditAmount, customerPin, brand_name } = req.body;
  console.log(brand_name);

  mailing("atshdubs@gmail.com", {
    subject: "Credit Used at " + brand_name + " | Antidote Nepal",
    html: `<h3>Thank you for making your purchase with Antidote's credits.</h3><h5>Here is your invoice: </h5><p>Credit Used: ${creditAmount}</p>`
  });
});

router.patch("/:username/redeem", async (req, res) => {
  console.log("here");
  const { creditAmount, customerPin, brand_name } = req.body;
  const username = req.params.username;

  const customerUser = await UsersModel.findOne({ username: username });

  const user = await UserDetailModel.findOne({
    user: customerUser._id
  }).populate({
    path: "user"
  });

  if (!user) {
    res.status(400).json({ error: { msg: "Customer not found." } });
  } else {
    if (user.pincode === customerPin) {
      if (user.credits > 0) {
        if (user.credits > creditAmount) {
          const updatedCredits = updateCredits(user.credits, creditAmount, "-");

          user.credits = updatedCredits;

          user.save();

          mailing(`${customerUser.email}`, {
            subject: "Credit Used at " + brand_name + " | Antidote Nepal",
            html: `<h3>Hello ${
              user.name.split(" ")[0]
            },<br /><br />Thank you for making your purchase with Antidote's credits.</h3><h5>Here is your invoice: </h5><p>Credit Used: ${creditAmount}</p>`
          });

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
  }
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
