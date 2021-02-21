const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetailsSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },

  name: {
    type: String,
    required: false,
  },

  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  document: {
    type: String,
    required: false,
  },
  bank_details: {
    bank_name: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: false,
    },
    account_number: {
      type: String,
      required: false,
    },
    account_holder_name: {
      type: String,
      required: false,
    },
  },
  credits: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  pincode: {
    type: Number,
    required: false,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
