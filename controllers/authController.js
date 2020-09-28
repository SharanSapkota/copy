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

const registerSeller = (req, res, next) => {
  console.log("here");
  const {
    username,
    password,
    phone_number,
    email,
    name,
    address,
    dob
  } = req.body;

  if (!username || !password || !phone_number || !email) {
    res.status(400).json({
      error: {
        msg:
          "Username, password, phone number, and email fields are required. Registration Failed."
      }
    });
  }

  bcrypt.hash(password, 10, function(err, hashedPass) {
    if (err) {
      res.json({ error: err });
    }

    let userRefId = "";

    let user = new userModel({
      username: username,
      password: hashedPass,
      phone_number: phone_number,
      email: email,
      role: 1
    });

    user
      .save()
      .then(user => {
        // userRefId = user._id;
        // res.json({

        //     message: "User added successfully"
        // })

        let profile = new Profiles({
          user: user._id,
          profile_picture: req.body.profile_picture
        });

        let userDetails = new userDetailsModel({
          user: user._id,
          role: 1,
          name: name,
          address: address,
          dob: dob
        });

        userDetails.save();
        profile.save();
        res.json({ message: "user added" });
      })
      .catch(error => {
        res.json({
          message: error
        });
      });
  });
};
const registerBuyer = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
    if (err) {
      res.json({ err: "err while hasing" });
    }

    var user = new userDetailsModel({
      fullname: req.body.fullname,
      username: req.body.username,
      password: hashedPass,
      phone_number: req.body.phone_number,
      email: req.body.email,
      address: req.body.address,
      dob: req.body.dob
    });

    user
      .save()
      .then(user => {
        res.json({
          message: "User added successfully"
        });
      })
      .catch(error => {
        res.json({
          message: error
        });
      });
    console.log(user.password);
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
