const express = require("express");
const { check } = require("express-validator");
const validate = require("../controllers/validate");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
// const UserDetails = require("../models/UserDetails");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const AuthController = require("../controllers/authController");

router.get("/", AuthController.authBuyer, AuthController.getUserDetails);

router.get("/user/:username", AuthController.getSingleUser);

router.post(
  "/register/seller",
  AuthController.authBuyer,
  upload.single("file"),
  AuthController.registerSeller
);

router.post(
  "/register/buyer",
  validate("createUserStep1"),
  AuthController.registerBuyer
);

router.post(
  "/register/final",
  upload.single("file"),
  AuthController.registerFinal
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  AuthController.login
);

router.post("/admin", AuthController.loginAdmin);

router.post("/forgotPassword", AuthController.forgotPassword);

router.get("/changePassword/:token", (req, res) => {
  Users.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpired: { $gte: Date.now() }
  }).then(user => {
    if (user == null) {
      res.json("password reset link is invalid or expired");
    } else {
      res.status(200).send({
        username: user.username,
        message: "password reset link ok"
      });
    }
  });
});

router.put("/changePassword", (req, res) => {
  Users.findOne({
    username: req.body.username
  })
    .then(async user => {
      if (user !== null) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;
        user.save().then(() => {
          console.log("password updated");
          res.status(200).send({ message: "password updated" });
        });
      } else {
        console.log("no user found in db");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
