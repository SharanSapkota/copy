const Users = require("../../models/Users");
const { Post, Unverified } = require("../../models/Post");
const UserDetails = require("../../models/UserDetails");
const Seller = require("../../models/admin/Seller");

module.exports = {
  getAllUsers: async function (filters = {}) {
    try {
      const users = await Users.find(filters);
      const userIds = users.map((u) => {
        return u.id;
      });
      const userDetails = await UserDetails.find({
        user: { $in: userIds },
      }).populate("user");
      return userDetails;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getAllUnregisteredUsers: async function (page) {
    try {
      // const users = await Seller.find()
      //   .sort({ date: -1 })
      //   .skip((page - 1) * 20)
      //   .limit(20);
      // return users;
      const users = await Seller.find().sort({ date: -1 });
      return users;
    } catch (err) {
      return err;
    }
  },
  getUnregisteredCount: function () {
    try {
      const count = Seller.estimatedDocumentCount();
      return count;
    } catch (err) {
      return err;
    }
  },
  getSingleUser: async function (id) {
    try {
      const user = await Users.findById(id);

      if (user) {
        return user;
      }
    } catch (err) {
      return err;
    }
  },
  getUnpublishedCount: function () {
    try {
      const count = Post.estimatedDocumentCount({ isPublished: false });
      return count;
    } catch (err) {
      return err;
    }
  },
  getUnpublishedPosts: async function (admin, page) {
    try {
      const unpublishedPosts = await Post.find({
        seller: admin,
        isPublished: false,
      })
        .sort({ date: -1 })
        .skip((page - 1) * 20)
        .limit(20);

      return unpublishedPosts;
    } catch (err) {
      return err;
    }
  },
  editPost: async function (id, data) {
    try {
      const updated = await Post.findByIdAndUpdate(id, data, { new: true });
      console.log(updated);
      return { success: true, updated: updated };
    } catch (err) {
      return err;
    }
  },
  deletePost: async function (id) {
    try {
      const res = await Post.deleteOne({ _id: id });
      if (res.deletedCount > 0) return { success: true };
      else return { success: false };
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  deleteUnregisteredUser: async function (id) {
    try {
      const res = await Seller.deleteOne({ _id: id });

      if (res.deletedCount > 0) return true;
      else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  verifyUser: async function (id) {
    try {
      let user = await Users.findById(id);

      if (user.role === "2") {
        user.role = 1;
        user.save();

        return { success: true, msg: "User verified as seller.", user };
      } else if (user.role === "1") {
        return {
          success: false,
          errors: [{ msg: "Seller already verified." }],
        };
      } else if (user.role === "3") {
        return {
          success: false,
          errors: [{ msg: "Seller registration incomplete." }],
        };
      } else {
        return {
          success: false,
          errors: [{ msg: "User doesn't live in Kathmandu Valley." }],
        };
      }
    } catch (err) {
      return { success: false, errors: [{ msg: "User not found." }] };
    }
  },
  movePostsToShop: async function (id) {
    try {
      let unverifiedPosts = await Unverified.find({ seller: id });
      if (unverifiedPosts && unverifiedPosts.length > 0) {
        unverifiedPosts.forEach((post) => {
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
  },
};
