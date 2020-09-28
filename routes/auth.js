const express = require("express");
const { check } = require("express-validator");
const Users = require("../models/Users");




const router = express.Router();

const AuthController = require("../controllers/authController");
const {
  userValidator,
  userValidationResult
} = require("../controllers/userValidator");

router.get("/auth", AuthController.authUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post(
  "/register/seller",
  userValidator,
  userValidationResult,
  AuthController.registerSeller
);
router.post("/register/buyer", AuthController.registerBuyer);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  AuthController.login
);

module.exports = router;
