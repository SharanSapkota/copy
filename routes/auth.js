const express = require("express");
const { check } = require("express-validator");
const validate = require("../controllers/validate");
const Users = require("../models/Users");
const bcrypt = require("bcrypt")
// const UserDetails = require("../models/UserDetails");

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

router.post("/register/final", AuthController.registerFinal);

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

router.get("/changePassword/:token", (req,res) =>{
  Users.findOne({resetPasswordToken: req.params.token, resetPasswordExpired : {$gte : Date.now()}})
    .then(user =>{
      if(user == null){
        res.json('password reset link is invalid or expired')
      }else{
        res.status(200).send({
          username: user.username,
          message: 'password reset link ok'
        })
      }
    })
});

router.put("/changePassword", (req,res) =>{
  Users.findOne({
    username: req.body.username
  }).then(async user =>{
    if(user!==null){
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      user.password = hashedPassword;
      user.save().then(() =>{
        console.log('password updated')
        res.status(200).send({message: 'password updated'})
      })
    }else{
      console.log('no user found in db')
    }
  }).catch(err =>{
    console.log(err)
  })
})


module.exports = router;
