const express = require("express");
const Users = require("../models/Users");
const AuthController = require("../controllers/authController");
const { checkDob } = require("../functions/validation");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    phone_number,
    dob,
    hash,
    otp,
    account_number,
    account_holder_name,
    bank_name,
    branch,
    step
  } = req.body;

  let errors = [];
  let response = {};

  var alphabetsOnlyFormat = "^[a-zA-Z]+$";
  var mixedFormat = "^[A-Za-z0-9]+$";
  var usernameFormat =
    "^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";

  try {
    if (step === 1) {
      if (username && username.match(usernameFormat) && username.length > 2) {
        const user = await Users.findOne({ username: username });

        if (user) {
          errors.push({ field: "username", msg: "Username already taken." });
        }
      } else {
        errors.push({
          field: "username",
          msg:
            "Username is invalid. Please pick a username with at least 3 letters, containing only dots and underscores as special characters."
        });
      }
    } else if (step === 2) {
      if (password && password.length < 6) {
        errors.push({ field: "password", msg: "Password is too short." });
      }
    } else if (step === 3) {
      var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.match(mailformat)) {
        errors.push({ field: "email", msg: "Email is invalid." });
      } else {
        const user1 = await Users.findOne({ email });
        if (user1) {
          errors.push({
            field: "email",
            msg: "Email already registered."
          });
        }
      }
      if (phone_number.length !== 10) {
        errors.push({
          field: "phone_number",
          msg: "Phone number is incorrect."
        });
      } else {
        const user2 = await Users.findOne({ phone_number });
        if (user2) {
          errors.push({
            field: "phone_number",
            msg: "Phone number already in use."
          });
        }
      }
      console.log(checkDob(dob));
      if (!checkDob(dob)) {
        errors.push({
          field: "dob",
          msg: "Date of birth is invalid."
        });
      }
      if (mailformat && phone_number.length === 10) {
        const verification = AuthController.verifyEmail(name, email);
        return res.json(verification);
      }
    } else if (step === 4) {
      const checkOtp = AuthController.verifyOTP(email, hash, otp);

      if (checkOtp.success) {
        return res.json({ success: true, msg: "OTP Verified." });
      } else {
        errors.push({
          field: "verifyotp",
          msg: checkOtp.msg
        });
      }
      return res.json({ success: true, msg: "OTP Verified." });
    } else if (step === 5) {
      var accountHolderCheck = account_holder_name.match(alphabetsOnlyFormat);
      var bankNameCheck = bank_name.match(alphabetsOnlyFormat);
      var accountNumberCheck = account_number.match(mixedFormat);
      var branchCheck = branch.match(alphabetsOnlyFormat);

      if (!accountHolderCheck) {
        errors.push({
          field: "account_holder_name",
          msg: "Account holder's name can only contain letters."
        });
      }
      if (!bankNameCheck) {
        errors.push({
          field: "bank_name",
          msg: "Bank's name can only contain letters."
        });
      }
      if (!accountNumberCheck) {
        errors.push({
          field: "account_number",
          msg: "Account number may not contain special characters."
        });
      }
      if (!branchCheck) {
        errors.push({
          field: "branch",
          msg: "Branch name may not contain special characters or numbers."
        });
      }
    }
    if (errors.length > 0) {
      console.log(errors);
      return res.json({ success: false, errors });
    } else {
      return res.json({ success: true, response });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
