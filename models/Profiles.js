const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  profile_picture: {
    type: String,
    required: false
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  reviews: [
    {
      type: String,
      required: false
    }
  ]
});

module.exports = mongoose.model("Profiles", profileSchema);
