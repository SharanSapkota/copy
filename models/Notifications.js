const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notifications = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  title: {
    type: String,
    required: true
  },
  opened: {
    type: Boolean,
    default: false,
    required: true
  },
  description: {
    type: String,
    default: "",
    required: false
  },
  image: {
    type: String,
    required: false
  },
  actions: [
    {
      actionType: String,
      actionValue: String
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notifications", Notifications);
