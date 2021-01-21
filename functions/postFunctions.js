const { Post, Unverified } = require("../models/Post");
const mongoose = require("mongoose");

module.exports = {
  postNewItem: async function(data) {
    const posts = new Post(data);
    try {
      const savedPost = await posts.save();

      if (savedPost) {
        return savedPost;
      }
    } catch (err) {
      console.log(err);
    }
  },
  postWithoutPublish: async function(data) {
    const posts = new Unverified(data);
    posts.save();
    return posts;
  },
  getOnePost: async function(filters, selection = "") {
    const posts = await Post.findOne(filters).select(selection);
    return posts;
  },
  getPosts: async function(filters, selection = "", sort = { date: -1 }) {
    const posts = await Post.find(filters)
      .select(selection)
      .sort(sort);
    return posts;
  },
  getPostById: async function(id) {
    const post = await Post.findById(id).populate("seller", "username");
    return post;
  },
  getPostsByIds: async function(ids) {
    const posts = await Post.find({ _id: { $in: ids } });
    return posts;
  },
  getTotalAmount: async function(clothes) {
    console.log(clothes);
    var clothesArr = clothes.map(item => mongoose.Types.ObjectId(item));
    var result = await Post.aggregate([
      { $match: { _id: { $in: clothesArr } } },
      {
        $group: {
          _id: null,
          sum: { $sum: "$selling_price" }
        }
      }
    ]);
    return result;
  },
  getTotalCreditDiscount: async function(clothes) {
    var clothesArr = clothes.map(item => mongoose.Types.ObjectId(item));
    var result = await Post.aggregate([
      { $match: { _id: { $in: clothesArr } } },
      {
        $group: {
          _id: null,
          total_fee: { $sum: "$platform_fee" }
        }
      },
      {
        $project: {
          discount: { $multiply: ["$total_fee", 0.1] }
        }
      }
    ]);
    return result[0].discount;
  },
  changeClothingStatus: async function(clothes, status) {
    await Post.updateMany({ _id: { $in: clothes } }, { status: status });
  }
};
