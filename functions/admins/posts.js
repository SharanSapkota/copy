const { Post } = require("../../models/Post");

module.exports = {
  getMultiplePosts: async function (admin, ids) {
    try {
      const posts = await Post.find({
        seller: admin,
        _id: { $in: ids },
      });

      return posts;
    } catch (err) {
      return err;
    }
  },
};
