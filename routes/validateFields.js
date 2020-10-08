const express = require("express");
const { check } = require("express-validator");
const Users = require("../models/Users");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, phone, step } = req.body;

  console.log(phone);
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
      const user2 = await Users.findOne({ phone_number: phone });
      if (user1 && user2) {
        return res.json({
          success: false,
          errors: [
            {
              field: "email",
              msg: "Email already in use."
            },
            { field: "phone", msg: "Phone number already in use." }
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
              field: "phone",
              msg: "Phone number already in use."
            }
          ]
        });
      } else {
        return res.json({ success: true });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
  // try {
  //   const user = await Users.findById(req.user.id).select("-password");
  //   res.json(user);
  // } catch (err) {
  //   res.status(500).send("Server Error");
  // }
});

module.exports = router;
