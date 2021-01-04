const { Post, Unverified } = require("../models/Post");

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
  }
};
