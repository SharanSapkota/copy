const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

const { getPurchases } = require("../functions/orderFunctions");

router.get("/", AuthController.authBuyer, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await getPurchases(id);
    res.json({ success: true, purchases: result });
  } catch {
    res.json({ success: false, errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
