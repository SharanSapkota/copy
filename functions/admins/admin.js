const Users = require("../../models/Users");
const { Post, Unverified } = require("../../models/Post");
const UserDetails = require("../../models/UserDetails");
const Seller = require("../../models/admin/Seller");

module.exports = {
  getAllUsers: async function(filters = {}) {
    try {
      const users = await Users.find(filters);
      const userIds = users.map((u) => {
        return u.id;
      })
      const userDetails = await UserDetails.find({user: {$in : userIds}}).populate("user");
      return userDetails;
      
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getAllUnregisteredUsers: async function() {
    try {
      const users = await Seller.find().sort({date: -1});
      return users;
    } catch (err) {
      console.log(err);
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
  deleteUnregisteredUser: async function(id) {
    try {
      const res = await Seller.deleteOne({_id: id});
      
      if(res.deletedCount > 0)
        return true;
      else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  verifyUser: async function(id) {
    try {
      let user = await Users.findById(id);

      if (user.role === "2") {
        user.role = 1;
        user.save();

        return { success: true, msg: "User verified as seller.", user };
      } else if (user.role === "1") {
        return {
          success: false,
          errors: [{ msg: "Seller already verified." }]
        };
      } else if (user.role === "3") {
        return {
          success: false,
          errors: [{ msg: "Seller registration incomplete." }]
        };
      } else {
        return {
          success: false,
          errors: [{ msg: "User doesn't live in Kathmandu Valley." }]
        };
      }
    } catch (err) {
      return { success: false, errors: [{ msg: "User not found." }] };
    }
  },
  movePostsToShop: async function(id) {
    try {
      let unverifiedPosts = await Unverified.find({ seller: id });
      if (unverifiedPosts && unverifiedPosts.length > 0) {
        unverifiedPosts.forEach(post => {
          let newPost = { ...post.toJSON() };
          delete newPost._id;
          delete newPost.date;
          let swap = new Post(newPost);
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
