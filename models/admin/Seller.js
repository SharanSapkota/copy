const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const SellerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  usercode: {
    type: String,
    trim: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  credits:{
    type: Number,
    required: true,
    trim: true,
    default: 0
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sellers", SellerSchema);
