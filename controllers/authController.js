const userDetailsModel = require("../models/UserDetails");
const userModel = require("../models/Users");
const partnerModel = require("../models/Partners");
const Profiles = require("../models/Profiles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv/config");
// const router = require('../routes/login')
// const express = require('express')
// const router = express.Router()

const authUser = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid." });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .select("username");
    const userProfile = await Profiles.findOne({ user: user._id });
    res.status(200).json({ success: true, user, userProfile });
  } catch (e) {
    res.status(401).json({ success: false });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    const userDetails = await userDetailsModel.findOne({ user: req.user.id });
    const userProfile = await Profiles.findOne({ user: req.user.id });

    res.json({ user, userDetails, userProfile });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

const registerSeller = async (req, res, next) => {
  const {
    email,
    account_holder_name,
    account_number,
    bank_name,
    branch
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
  }

  const bank_details = {};

  if (bank_name) bank_details.bank_name = bank_name;
  if (branch) bank_details.branch = branch;
  if (account_holder_name)
    bank_details.account_holder_name = account_holder_name;
  if (account_number) bank_details.account_number = account_number;

  let user = await userModel.findOne({ email });

  if (user && user.role == 2) {
    let updatedUser = await userDetailsModel.findOneAndUpdate(
      { user: user.id },
      {
        bank_details: bank_details,
        role: 1
      }
    );

    if (updatedUser) {
      user.role = 1;
      user.save();
      res.status(200).json({ success: true, msg: "bank details updated" });
    } else {
      res.status(400).json({ success: false, error: { msg: "Server error." } });
    }
  } else {
    res.status(400).json({ success: false, error: { msg: "Server error." } });
  }
};

const registerFinal = async (req, res, next) => {
  const {
    username,
    password,
    phone,
    email,
    city,
    address,
    dob,
    bank_name,
    account_number,
    account_holder_name,
    branch,
    profileimage
  } = req.body;

  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   res.status(422).json({ success: false, errors: errors.array() });
  // }

  const userDetailsFields = {};
  const userFields = {};

  if (username) userFields.username = username;
  if (phone) userFields.phone_number = phone;
  if (email) userFields.email = email;
  userFields.role = 2;

  if (city) userDetailsFields.city = city;
  if (address) userDetailsFields.address = address;
  if (dob) userDetailsFields.dob = dob;

  const bank_details = {};

  if (bank_name) bank_details.bank_name = bank_name;
  if (branch) bank_details.branch = branch;
  if (account_holder_name)
    bank_details.account_holder_name = account_holder_name;
  if (account_number) bank_details.account_number = account_number;

  userDetailsFields.bank_details = bank_details;

  const profile_fields = {};
  if (profileimage) profile_fields.profile_picture = profileimage;

  const hashedPassword = await bcrypt.hash(password, 10);
  if (hashedPassword) userFields.password = hashedPassword;
  userFields.credits = 0;

  let user = await userModel.findOne({ email });

  if (user) {
    return res.status(400).json({ errors: { msg: "User already exists." } });
  }

  user = new userModel(userFields);
  user.save().then(user => {
    userDetailsFields.user = user.id;
    profile_fields.user = user.id;
    let userDetails = new userDetailsModel(userDetailsFields);
    userDetails.save().then(userDetails => {
      const payload = {
        user: {
          id: user.id
        }
      };

      let profile = new Profiles(profile_fields);
      profile.save();

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "4h"
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            message: "Registered New User",
            token
          });
        }
      );
    });
  });
};

const registerBuyer = async (req, res, next) => {
  const {
    username,
    password,
    name,
    phone_number,
    email,
    address,
    dob
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
  }

  const userDetailsFields = {};
  const userFields = {};

  if (username) userFields.username = username;
  if (phone_number) userFields.phone_number = phone_number;
  if (email) userFields.email = email;
  userFields.role = 2;

  if (name) userDetailsFields.name = name;
  if (address) userDetailsFields.address = address;
  if (dob) userDetailsFields.dob = dob;

  const hashedPassword = await bcrypt.hash(password, 10);
  if (hashedPassword) userFields.password = hashedPassword;
  userFields.credits = 0;

  let user = await userModel.findOne({ email });

  if (user) {
    return res.status(400).json({ errors: { msg: "User already exists." } });
  }

  user = new userModel(userFields);
  user.save().then(user => {
    userDetailsFields.user = user.id;
    let userDetails = new userDetailsModel(userDetailsFields);
    userDetails.save().then(userDetails => {
      const payload = {
        user: {
          id: user.id
        }
      };

      let profile = new Profiles({ user: user.id });
      profile.save();

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "4h"
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            message: "Registered New User",
            token
          });
        }
      );
    });
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await userModel.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (!user) {
      return res.status(422).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const comparisonResult = await bcrypt.compare(password, user.password);

    if (comparisonResult) {
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: "4h"
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            message: "login successfully",
            token
          });
        }
      );
    } else {
      return res.status(422).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
  } catch (error) {
    res.status(400).json({
      message: "Server Error."
    });
  }
};

const loginPartner = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ msg: "Username and password are required." });
    }

    const data = await partnerModel.findOne({ username: req.body.username });

    if (data.username == username && data.password == password) {
      res.status(200).json({
        username: data.username,
        brand_name: data.brand_name,
        success: true
      });
    } else {
      res.status(400).json({ msg: "Invalid Credentials." });
    }
  } catch (err) {
    res.json({ msg: "User not found" });
  }
};

// router.post('/login', (req, res) => {
//     try{
//         var username = req.body.username,
//         password = req.body.password
//         console.log(username)

//         const savedpwd = userDetailsModel.findOne({$or: [{email: username}, {username:username}]})
//         console.log(savedpwd)
//     }
//     catch(err) {
//         res.json({message: err})
//     }
// })

module.exports = {
  getSingleUser,
  getUserDetails,
  registerSeller,
  registerBuyer,
  registerFinal,
  login,
  loginPartner,
  authUser
};
