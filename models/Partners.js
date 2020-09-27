const mongoose = require("mongoose");

const partnerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  brand_name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: false,
    trim: true
  }
});

module.exports = mongoose.model("LoginPartners", partnerSchema);
