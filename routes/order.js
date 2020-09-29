const express = require("express");
const AuthController = require("../controllers/authController");
const SendMail = require("../pagination/nodemailer");

const router = express.Router();

router.get("/", AuthController.authUser, async (req, res) => {
  res.send("I am in order.js");
});

router.post("/", AuthController.authUser, async (req, res) => {
  console.log("post new order");
});

router.patch("/cancel", AuthController.authUser, (req, res) => {
  res.send("I am in cancel order.js");
});

module.exports = router;
