const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreditSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  transaction: {
    type: String,
    required: true
  },
  details: {
    type: Schema.Types.Mixed,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Credits", CreditSchema);
