const express = require("express");
const router = express.Router();
const Partners = require("../models/Partners");

const AuthController = require("../controllers/authController");

router.get("/", async (req, res) => {
  try {
    const getAllPartners = await Partners.find();
    res.json(getAllPartners);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/login", AuthController.loginPartner);

module.exports = router;
