const express = require("express");
const Users = require("../models/Users");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, name, email, phone_number, hash, otp, step } = req.body;
  try {
    if (step == 1) {
      const user = await Users.findOne({ username: username });

      if (user) {
        return res.json({
          success: false,
          errors: [{ field: "username", msg: "Username already taken." }]
        });
      } else {
        return res.json({ success: true });
      }
    }
    if (step == 3) {
      const user1 = await Users.findOne({ email: email });
      const user2 = await Users.findOne({ phone_number: phone_number });
      if (user1 && user2) {
        return res.json({
          success: false,
          errors: [
            {
              field: "email",
              msg: "Email already in use."
            },
            { field: "phone_number", msg: "Phone number already in use." }
          ]
        });
      } else if (user1) {
        return res.json({
          success: false,
          errors: [
            {
              field: "email",
              msg: "Email already in use."
            }
          ]
        });
      } else if (user2) {
        return res.json({
          success: false,
          errors: [
            {
              field: "phone_number",
              msg: "Phone number already in use."
            }
          ]
        });
      } else {
        AuthController.verifyEmail(res, name, email);
      }
    }
    if (step === 4) {
      const checkOtp = AuthController.verifyOTP(email, hash, otp);

      if (checkOtp) {
        return res.json({ success: true, msg: "OTP Verified." });
      } else {
        return res.json({
          success: false,
          errors: [
            {
              field: "verifyotp",
              msg: "OTP incorrect. Please re-check and try again."
            }
          ]
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
