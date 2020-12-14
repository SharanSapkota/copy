const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true,
    trim: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  resetPasswordToken:{
    type: String,
    required: false
  },
  resetPasswordExpired:{
    type: Date,
    required: false
  }
});

module.exports = mongoose.model("Users", UserSchema);
