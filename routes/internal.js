const express = require("express");
const router = express.Router();
const Partners = require("../models/Partners");
const Users = require("../models/Users");
const UserDetails = require("../models/UserDetails");

router.get("/", async (req, res) => {
  try {
    const getAllPartners = await Partners.find();
    res.json(getAllPartners);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/getusers", async (req, res) => {
  try {
    const getAllPartners = await Users.find();
    res.json(getAllPartners);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/getuserdetails", async (req, res) => {
  try {
    const getAllPartners = await UserDetails.find().populate("user");
    res.json(getAllPartners);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const { username, password, brand_name, email, phone } = req.body;

  const fields = {};

  if (username) fields.username = username;
  if (password) fields.password = password;
  if (brand_name) fields.brand_name = brand_name;
  if (email) fields.email = email;
  if (phone) fields.phone = phone;

  const partner = new Partners(fields);
  try {
    const savedPartner = await partner.save();

    res.json(savedPartner);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/pincode/:userId", async (req, res) => {
  const { pincode } = req.body;
  if (!pincode)
    res
      .status(400)
      .json({ error: { mgs: "PIN code is required. Please try again" } });

  const updatePin = await UserDetails.findOneAndUpdate(
    {
      user: req.params.userId
    },
    {
      $set: { pincode: pincode }
    }
  );

  if (updatePin) {
    res
      .status(200)
      .json({ success: true, msg: "PIN code assigned.", pincode: pincode });
  } else {
    res.status(400).json({ error: "Server error." });
  }
});

router.patch("/details/:userId", async (req, res) => {
  const { credits, name, pincode, username } = req.body;

  const update = {
    credits,
    name,
    pincode,
    username
  };

  try {
    const updatedUser = await UserDetails.findOneAndUpdate(
      { _id: req.params.userId },

      { $set: update }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.patch("/user/:userId", async (req, res) => {
  const { username } = req.body;
  console.log(username);

  const update = {};

  if (username) update.username = username;

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: req.params.userId },

      { $set: update }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports = router;
