const express = require("express");
const Users = require("../models/Users");
const functions = require("../functions/sellers");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.get("/", AuthController.authAdmin, async (req, res) => {
  try {
    const getAllSellers = await functions.getAllSellers();
    console.log(getAllSellers);

    res.status(200).json(getAllSellers);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
