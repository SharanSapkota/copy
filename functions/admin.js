const Users = require("../models/Users");
const { Post, Unverified } = require("../models/Post");
const userModel = require("../models/UserDetails");

module.exports = {
  getAllUsers: async function(filters = {}) {
    try {
      const users = await Users.find(filters);
      if (users) {
        return users;
      }
    } catch (err) {
      return err;
    }
  },
  getSingleUser: async function(id) {
    try {
      const user = await Users.findById(id);

      if (user) {
        return user;
      }
    } catch (err) {
      return err;
    }
  },
  deleteUser: async function(id) {
    try {
      await Users.deleteOne({ id: id });
      return true;
    } catch (err) {
      return err;
    }
  },
  verifyUser: async function(id) {
    console.log(id)
    try {
      console.log(id)
      let user = await Users.findById(id);
      console.log(user)
      if (user.role === "2") {
        console.log(user.role)
        user.role = 1;
        user.save();

        console.log(user.role)

        return { success: true, msg: "User verified as seller.", user };
      } else if (user.role === "1") {
        return {
          success: false,
          error: { msg: "Seller already verified." }
        };
      } else if (user.role === "3") {
        return {
          success: false,
          error: { msg: "Seller registration incomplete." }
        };
      } else {
        return {
          success: false,
          error: { msg: "User doesn't live in Kathmandu Valley." }
        };
      }
    } catch (err) {
      return { success: false, error: { msg: "User not found." } };
    }
  },
  movePostsToShop: async function(id) {
    try {
      let unverifiedPosts = Unverified.find({ seller: id });
      if (unverifiedPosts && unverifiedPosts.length > 0) {
        unverifiedPosts.forEach(post => {
          let swap = new Post(post.toJSON());
          swap.save();
          post.remove();
        });
        return { success: true, msg: "Posts moved to shop!" };
      } else {
        return { success: true, msg: "No posts found." };
      }
    } catch (err) {
      return { success: false, error: { msg: "Server Error!" } };
    }
  }
};
