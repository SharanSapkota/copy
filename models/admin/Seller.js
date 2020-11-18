const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const SellerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone_number: {  
    type: Number,
    required: true,
    trim: true,
    unique: true
  },
  usercode: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

module.exports = mongoose.model("Sellers", SellerSchema);
