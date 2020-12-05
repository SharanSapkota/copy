const express = require("express");
const { check } = require("express-validator");
const validate = require("../controllers/validate");

const router = express.Router();

const AuthController = require("../controllers/authController");

//DELETE USERS COMMENTED OUT BEFORE ROLLOUT//

// router.delete("/details/:id", async (req, res) => {
//   UserDetails.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
//     if (err) return res.status(400).json({ error: err });
//     else
//       res
//         .status(200)
//         .json({ success: true, msg: "Deleted User Details", user: docs });
//   });
// });

// router.delete("/users/:id", async (req, res) => {
//   Users.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
//     if (err) return res.status(400).json({ error: err });
//     else
//       res.status(200).json({ success: true, msg: "Deleted User", user: docs });
//   });
// });

//DELETE USERS END//

router.get("/", AuthController.authUser, AuthController.getUserDetails);

router.get("/user/:username", AuthController.getSingleUser);

router.post(
  "/register/seller",
  AuthController.authUser,
  validate("createUserStep2"),
  AuthController.registerSeller
);

router.post(
  "/register/buyer",
  validate("createUserStep1"),
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

router.post("/admin",  AuthController.loginAdmin)

module.exports = router;
