const express = require("express");

const router = express.Router();

const {
  getNotificationsByUser
} = require("../functions/notificationFunctions");

//GET ALL NOTIFICATIONS FOR USER
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await getNotificationsByUser(req.params.userId);

    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { msg: "No notifications found." }
    });
  }
});

module.exports = router;
