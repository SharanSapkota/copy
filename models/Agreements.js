const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AgreementsSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  signed_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Agreements", AgreementsSchema);
