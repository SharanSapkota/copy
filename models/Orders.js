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
    required: true
  },
  discount: {
    type: Number,
    required: true,
    default: 0
  },
  total_after_discount: {
    type: Number,
    required: true
  },
  delivery_charge: {
    type: Number,
    required: true
  },
  total_order_amount: {
    type: Number,
    required: true
  },
  pickup_location: {
    type: String,
    required: true
  },
  delivery_location: {
    type: String,
    required: true
  },
  payment_status: {
    type: String,
    required: true,
    default: "pending"
  },
  order_status: {
    type: String,
    required: true,
    default: "pending"
  }
});


module.exports = mongoose.model("Orders", orderSchema);
