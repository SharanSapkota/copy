const Notifications = require("../models/Notifications");

module.exports = {
  registerNotification: async function(id) {
    const notification = new Notifications({
      user: id,
      title: "Welcome to Antidote!",
      description:
        "This is where you can keep yourself up-to-date. You will receive notifications whenever an order is placed on your items!",
      image: "https://antidote-sellers-bucket.s3.amazonaws.com/logo.png"
    });
    notification.save();
  },
  createNotification: async function(data) {
    const notification = new Notifications(data);
    try {
      const saved = await notification.save();

      if (saved) {
        return saved;
      }
    } catch (err) {
      return err;
    }
  },
  getNotificationsByUser: async function(id) {
    try {
      const notifications = await Notifications.find({ user: id });
      return notifications;
    } catch (err) {
      return err;
    }
  },
  openNotification: async function(id) {
    try {
      const notification = Notifications.findOneAndUpdate(
        { id: id },
        { opened: true },
        { new: true }
      );
      if (notification) {
        return notification;
      }
    } catch (err) {
      return err;
    }
  },
  deleteNotification: async function(id) {
    try {
      await Notifications.deleteOne({ id: id });
      return true;
    } catch (err) {
      return err;
    }
  }
};
