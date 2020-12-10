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
  ],
  liked_items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts"
    }
  ]
});

module.exports = mongoose.model("Profiles", profileSchema);
