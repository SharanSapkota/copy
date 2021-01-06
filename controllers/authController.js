const userDetailsModel = require("../models/UserDetails");
const userModel = require("../models/Users");
const partnerModel = require("../models/Partners");
const Profiles = require("../models/Profiles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { registerNotification } = require("../functions/notificationFunctions");
const { validationResult } = require("express-validator");
const SendMail = require("../pagination/nodemailer");
const { GenerateResetLink, GenerateOTP } = require("../lib/generate.js");
const { s3Upload } = require("../functions/s3upload");
require("dotenv/config");

const authBuyer = (req, res, next) => {
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

const authSeller = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const dbuser = await userModel.findById(decoded.user.id);
    if (dbuser.role === "1") {
      req.user = dbuser;
      next();
    } else {
      return res.status(401).json({ msg: "User is not authorized." });
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid." });
  }
};

const authCheck = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const dbuser = await userModel.findById(decoded.user.id);
    req.user = dbuser;
    if (dbuser.role === "1") {
      req.verified = true;
    } else {
      req.verified = false;
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const authAdmin = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    req.user = decoded.user;
    if (req.user.id == "5fd9b20457412e6a880ed55a") {
      next();
    }
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

  if (user && user.role == 3) {
    let updatedUser = await userDetailsModel.findOneAndUpdate(
      { user: user.id },
      {
        bank_details: bank_details
      },
      { new: true }
    );

    if (updatedUser) {
      user.save();
      res.status(200).json({
        success: true,
        msg: "bank details updated",
        user: updatedUser
      });
    } else {
      res.status(400).json({ success: false, error: { msg: "Server error." } });
    }
  } else {
    res.status(400).json({ success: false, error: { msg: "Server error." } });
  }
};

const registerFinal = async (req, res, next) => {
  const file = req.file;

  const data = JSON.parse(req.body.data);

  const {
    username,
    password,
    phone_number,
    email,
    city,
    address,
    dob,
    bank_name,
    account_number,
    account_holder_name,
    branch,
    profileimage
  } = data;

  // const errors = validationResult(req);

  if (!bank_name || !account_holder_name || !account_number || !branch) {
    return res
      .status(422)
      .json({ success: false, error: { msg: "Bank Details are Required" } });
  }

  const document = await s3Upload(file, 0, 0);

  const userDetailsFields = {};
  const userFields = {};

  if (username) userFields.username = username;
  if (phone_number) userFields.phone_number = phone_number;
  if (email) userFields.email = email;
  userFields.role = 2;

  if (city) userDetailsFields.city = city;
  if (address) userDetailsFields.address = address;
  if (dob) userDetailsFields.dob = dob;
  if (document) userDetailsFields.document = document;

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
    userDetails.save().then(() => {
      const payload = {
        user: {
          id: user.id
        }
      };

      let profile = new Profiles(profile_fields);
      profile.save();

      registerNotification(user.id);

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
    city,
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
  if (city === "Others") userFields.role = 4;
  else userFields.role = 3;

  if (name) userDetailsFields.name = name;
  if (city) userDetailsFields.city = city;
  if (address) userDetailsFields.address = address;
  if (dob) userDetailsFields.dob = dob;

  const hashedPassword = await bcrypt.hash(password, 10);
  if (hashedPassword) userFields.password = hashedPassword;
  userFields.credits = 0;

  let user = await userModel.findOne({ email });

  if (user) {
    return res.status(400).json({ errors: [{ msg: "User already exists." }] });
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

      registerNotification(user.id);

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

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === "info@antidotenepal.com") {
      let user = await userModel.findOne({ email: username });

      const comparisonResult = await bcrypt.compare(password, user.password);

      if (comparisonResult) {
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          process.env.ADMIN_SECRET_KEY,
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
      }
    } else {
      res.status(404).json({ msg: "Admin not valid" });
    }
  } catch (err) {
    res.json({ msg: "Admin not found" });
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

const forgotPassword = async (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (user === null) {
        res.send("email not in database");
      } else {
        const token = crypto.randomBytes(20).toString("hex");
        (user.resetPasswordToken = token),
          (user.resetPasswordExpired = Date.now() + 3600000);
        user.resetToken();
        user.save();

        const mailBody = GenerateResetLink(user.username, token);

        SendMail(user.email, {
          subject: "Reset Password Link",
          html: mailBody
        });
        res.send("recovery mail sent");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

const verifyEmail = (res, name, email) => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${email}.${OTP}.${expires}`;
    const hash = crypto
      .createHmac("sha256", process.env.EMAIL_VERIFY_KEY)
      .update(data)
      .digest("hex");
    const fullHash = `${hash}.${expires}`;

    const mailBody = GenerateOTP(name, OTP);
    SendMail(email, {
      subject: "Verify Email Address",
      html: mailBody
    });
    res.json({
      success: true,
      msg: "Verification email sent.",
      hash: fullHash
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Server Error." });
  }
};

const verifyOTP = (email, hash, otp) => {
  let [hashValue, expires] = hash.split(".");

  let now = Date.now();

  if (now > parseInt(expires)) return false;

  let data = `${email}.${otp}.${expires}`;

  let newCalculatedHash = crypto
    .createHmac("sha256", process.env.EMAIL_VERIFY_KEY)
    .update(data)
    .digest("hex");

  if (newCalculatedHash === hashValue) {
    return true;
  }
  return false;
};

module.exports = {
  getSingleUser,
  getUserDetails,
  registerSeller,
  registerBuyer,
  registerFinal,
  login,
  loginPartner,
  authBuyer,
  authSeller,
  authAdmin,
  authCheck,
  loginAdmin,
  forgotPassword,
  verifyEmail,
  verifyOTP
};
