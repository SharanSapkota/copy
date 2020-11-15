const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const SellerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    // required: true,
    trim: true,
    unique: true
  }
});

module.exports = mongoose.model("Sellers", SellerSchema);
