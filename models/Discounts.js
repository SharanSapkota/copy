const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
  coupon: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Discounts", discountSchema);
