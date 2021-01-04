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
  liked_items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts"
    }
  ],
  items_listed: {
    type: Number,
    default: 0
  },
  items_sold: {
    type: Number,
    default: 0
  },
  rating: {
    reviews: [
      {
        reviewd_by: String,
        value: Number
      }
    ],
    average_rating: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model("Profiles", profileSchema);
