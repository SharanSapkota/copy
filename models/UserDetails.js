const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetailsSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },

  email: {
    type: String,
    required: false,
    trim: true
  },
  phone_number: {
    type: Number,
    required: false,
    trim: true
  },
  dob: {
    type: Date,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  },

  bank_details: {
    bank_name: {
      type: String,
      required: false
    },
    branch: {
      type: String,
      required: false
    },
    account_number: {
      type: Number,
      required: false
    },
    account_holder_name: {
      type: String,
      required: false
    }
  },
  type: {
    type: String,
    required: false,
    trim: true
  },
  credits: {
    type: Number,
    required: false,
    trim: true
  },
  role: {
    type: String,
    required: false,
    trim: true
  }
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
