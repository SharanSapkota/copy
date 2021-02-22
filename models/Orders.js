const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
  buyer: {
    type: Schema.Types.Mixed,
  },

  clothes: [
    {
      item: {
        type: Schema.Types.ObjectId,
        refPath: "clothes.itemType",
        required: true,
      },
      itemType: {
        type: String,
        default: "Posts",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      seller: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    },
  ],

  payment_type: {
    type: String,
    required: false,
  },

  total_amount: {
    type: Number,
    required: true,
  },

  delivery_charge: {
    type: Number,
    required: true,
  },

  total_order_amount: {
    type: Number,
    required: true,
  },

  discount: {
    type: Schema.Types.ObjectId,
    ref: "Discounts",
    required: false,
  },

  total_after_discount: {
    type: Number,
    required: false,
  },

  delivery_location: {
    type: String,
    required: false,
  },

  delivery_type: {
    type: String,
    required: true,
  },

  payment_status: {
    type: String,
    required: true,
    default: "pending",
  },

  order_status: {
    type: String,
    required: true,
    default: "pending",
  },
  completed_date: {
    type: Date,
    required: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", async function (next) {
  const order = this;
  console.log(order);
});

module.exports = mongoose.model("Orders", orderSchema);
