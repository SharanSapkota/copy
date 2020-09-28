const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: false,
    trim: true,
    unique: true
  },
  role: {
    type: String,
    required: false,
    trim: true
  }
});

module.exports = mongoose.model("Users", UserSchema);
