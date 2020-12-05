const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetailsSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },

  name: {
    type: String,
    required: true
  },

  dob: {
    type: Date,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
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
      type: String,
      required: false,
      unique: true
    },
    account_holder_name: {
      type: String,
      required: false
    }
  },

  credits: {
    type: Number,
    required: true,
    trim: true,
    default: 0
  },

  pincode: {
    type: Number,
    required: false,
    trim: true
  }
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
