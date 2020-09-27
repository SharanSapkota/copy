const express = require("express");
const router = express.Router();
const UserDetailModel = require("../models/UserDetails");
const updateCredits = require("../controllers/updateCredits");
const nodemailer = require('nodemailer')
require('dotenv/config')

const mailing = require("../pagination/nodemailer")


router.get("/", async (req, res) => {
  const users = await UserDetailModel.find();
  if (users) res.status(200).json({ users });

  res.end();
});

router.get("/:customer", async (req, res) => {
  const user = await UserDetailModel.findOne({ username: req.params.customer });

  if (!user) {
    res.status(400).json({ error: "User not found.", success: false });
  } else {
    res.status(200).json({
      userId: user.id,
      username: user.username,
      name: user.name,
      credits: user.credits,
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

          mailing('sapkotarambbo@gmail.com', {
            subject: "antidote", html:"Antidote go is initiating"
          })
         

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
    const updatedCredits = updateCredits(user.credits, creditAmount, "+");

    console.log(updatedCredits);
    res.end();
  });
});

module.exports = router;
