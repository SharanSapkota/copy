const UserDetails = require("../models/UserDetails");
const Users = require("../models/Users");

module.exports = {
  getUserDetailsById: async function(id) {
    const userDetails = await UserDetails.findById(id);
    return userDetails;
  },
  getUserDetails: async function(filters, fields = "") {
    const userDetails = await UserDetails.findOne(filters).select(fields);
    return userDetails;
  },
  getUserById: async function(id) {
    const user = await Users.findById(id);
    return user;
  }
};
