const Post = require("../models/Post");

module.exports = {
    postNewItem: async function (data) {
        const posts = new Post(data);
        try {
          const savedPost = await posts.save();
  
          if (savedPost) {
            return savedPost
          }
          
        } catch (err) {
          console.log(err);
        }
    } 
}