const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  clothes: {
    type: Schema.Types.ObjectId,
    ref: "Posts"
  },
  total_amount: {
    type: Number,
    required: false
  },
  discount: {
    type: Number,
    required: false,
    default: 0
  },
  total_after_discount: {
    type: Number,
    required: false
  },
  delivery_charge: {
    type: Number,
    required: false
  },
  total_order_amount: {
    type: Number,
    required: false
  },
  pickup_location: {
    type: String,
    required: false
  },
  delivery_location: {
    type: String,
    required: false
  },
  payment_status: {
    type: String,
    required: false,
    default: "pending"
  },
  order_status: {
    type: String,
    required: false,
    default: "pending"
  }
});

module.exports = mongoose.model("Orders", orderSchema);
