const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
  coupon_code: {
    type: String,
    required: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  discount_type: {
    type: String,
    required: true,
    default: "Flat"
  },
  activation_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiration_date: {
    type: Date
  }
});

module.exports = mongoose.model("Discounts", discountSchema);
