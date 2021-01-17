const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },

  clothes: [
    {
      type: Schema.Types.ObjectId,
      required: true
    }
  ],

  payment_type: {
    type: String,
    required: false
  },

  buyerTest: {
    type: String,
    required: false,
    trim: true
  },

  total_amount: {
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

  discount: {
    type: Schema.Types.ObjectId,
    ref: "Discounts",
    required: false
  },

  total_after_discount: {
    type: Number,
    required: false
  },

  delivery_location: {
    type: String,
    required: false
  },

  delivery_type: {
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
  },

  date: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre("save", async function(next) {
  const order = this;
  console.log(order);
});

module.exports = mongoose.model("Orders", orderSchema);
