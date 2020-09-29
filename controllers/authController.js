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

const registerSeller = async (req, res, next) => {
  console.log("here");
  const {
    username,
    password,
    phone_number,
    email,
    name,
    address,
    dob,
    account_holder_name,
    account_number,
    bank_name,
    branch
  } = req.body;

  const bank_details = {};

  if (bank_name) bank_details.bank_name = bank_name;
  if (branch) bank_details.branch = branch;
  if (account_holder_name)
    bank_details.account_holder_name = account_holder_name;
  if (account_number) bank_details.account_number = account_number;

  let user = await userModel.findOne({ email });

  if (user && user.role == 1) {
    console.log("here1");
    return res.status(400).json({ errors: { msg: "User already exists." } });
  } else if (user && user.role == 2) {
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
    console.log("here3");
    const userDetailsFields = {};
    const userFields = {};

    if (username) userFields.username = username;
    if (phone_number) userFields.phone_number = phone_number;
    if (email) userFields.email = email;
    userFields.role = 1;

    if (name) userDetailsFields.name = name;
    if (address) userDetailsFields.address = address;
    if (dob) userDetailsFields.dob = dob;

    const hashedPassword = bcrypt.hash(password, 10);
    if (hashedPassword) userDetailsFields.password = hashedPassword;
    userDetailsFields.credits = 0;
    userDetailsFields.bank_details = bank_details;

    user = new userModel(userFields);
    user.save().then(user => {
      userDetailsFields.user = user.id;
      let userDetails = userDetailsModel(userDetailsFields);
      userDetails.save().then(userDetails => {
        res.status(200).json({
          success: true,
          msg: "User added successfully",
          user,
          userDetails
        });
      });
    });
  }
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

  const userDetailsFields = {};
  const userFields = {};

  if (username) userFields.username = username;
  if (phone_number) userFields.phone_number = phone_number;
  if (email) userFields.email = email;
  userFields.role = 2;

  if (name) userDetailsFields.name = name;
  if (address) userDetailsFields.address = address;
  if (dob) userDetailsFields.dob = dob;

  const hashedPassword = bcrypt.hash(password, 10);
  if (hashedPassword) userDetailsFields.password = hashedPassword;
  userDetailsFields.credits = 0;

  let user = await userModel.findOne({ email });

  if (user) {
    return res.status(400).json({ errors: { msg: "User already exists." } });
  }

  user = new userModel(userFields);
  user.save().then(user => {
    userDetailsFields.user = user.id;
    let userDetails = userDetailsModel(userDetailsFields);
    userDetails.save().then(userDetails => {
      res.status(200).json({
        success: true,
        msg: "User added successfully",
        user,
        userDetails
      });
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
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials." }] });
    }

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
        res.json({
          message: "login successfully",
          token
        });
      }
    );
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
  registerSeller,
  registerBuyer,
  login,
  loginPartner,
  authUser
};
