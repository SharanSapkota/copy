const express = require("express");
const { check } = require("express-validator");
const Users = require("../models/Users");
const UserDetails = require("../models/UserDetails");

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

router.get("/", async (req, res) => {
  const users = await UserDetails.find().populate("user");

  res.status(200).json(users);
});

//DELETE USERS//

router.delete("/details/:id", async (req, res) => {
  UserDetails.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
    if (err) return res.status(400).json({ error: err });
    else
      res
        .status(200)
        .json({ success: true, msg: "Deleted User Details", user: docs });
  });
});

router.delete("/users/:id", async (req, res) => {
  Users.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
    if (err) return res.status(400).json({ error: err });
    else
      res.status(200).json({ success: true, msg: "Deleted User", user: docs });
  });
});

//DELETE USERS END//

router.post("/register/seller", AuthController.registerSeller);
router.post(
  "/register/buyer",
  userValidator,
  userValidationResult,
  AuthController.registerBuyer
);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  AuthController.login
);

module.exports = router;
