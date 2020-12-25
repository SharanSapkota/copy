const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");


const PostSchema = mongoose.Schema({
  listing_name: {
    type: String,
    required: false
  },

  listing_type: {
    type: String,
    required: false
  },

  category: {
    type: String,
    required: false
  },

  occassion: {
    type: String,
    required: false
  },

  gender: {
    type: String,
    required: false
  },

  design: {
    type: String,
    required: false
  },

  feature_image: {
    type: String,
    required: false
  },

  images: [
    {
      type: String,
      required: false
    }
  ],
  purchase_price: {
    type: Number,
    required: false
  },

  selling_price: {
    type: Number,
    required: false
  },

  commission: {
    type: Number,
    required: false
  },

  platform_fee: {
    type: Number,
    required: false
  },

  purchase_date: {
    type: Date,
    required: false
  },

  condition: {
    type: String,
    required: false
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: false
    }
  ],

  measurement: {
    type: Schema.Types.Mixed,
    required: false,
    default: {}
  },

  fabric: {
    type: String,
    required: false
  },

  color: {
    type: String,
    required: false
  },

  status: {
    type: String,
    required: false,
    default: "Available"
  },

  seller: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  testSeller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller'
  },
  item_code:{
      type: String,
      required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("archievePosts", PostSchema);

module.exports = mongoose.model("Posts", PostSchema);
