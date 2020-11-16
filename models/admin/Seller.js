const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const SellerSchema = mongoose.Schema({
  name: {
    type: String,
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
