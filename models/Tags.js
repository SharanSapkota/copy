const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagsSchema = Schema({
  metaDescription: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  name: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Tags", TagsSchema);
