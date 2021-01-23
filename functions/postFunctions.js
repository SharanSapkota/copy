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
  getBestDeals: async function(dealAmount) {
    const posts = await Unverified.aggregate([
      {
        $project: {
          ab: {
            $cmp: [
              {
                $divide: [
                  { $subtract: ["$purchase_price", "$selling_price"] },
                  "$purchase_price"
                ]
              },
              0.25
            ]
          },
          listing_name: 1,
          description: 1,
          category: 1,
          occassion: 1,
          gender: 1,
          isPublished: 1,
          feature_image: 1,
          images: 1,
          purchase_price: 1,
          selling_price: 1,
          commission: 1,
          platform_fee: 1,
          purchase_date: 1,
          condition: 1,
          likes: 1,
          measurements: 1,
          brand: 1,
          fabric: 1,
          color: 1,
          status: 1,
          seller: 1,
          item_code: 1,
          date: 1
        }
      },
      { $match: { ab: { $gt: -1 }, isPublished: true, status: "Available" } }
    ]);

    return posts;
  },
  getPostById: async function(id) {
    const post = await Post.findById(
      id,
      { isPublished },
      { status: "Available" }
    ).populate("seller", "username");
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
