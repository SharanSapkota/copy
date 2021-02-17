const UserDetails = require("../models/UserDetails");
const Users = require("../models/Users");

module.exports = {
  getUserDetailsById: async function(id) {
    const userDetails = await UserDetails.findById(id);
    return userDetails;
  },
  getUserDetails: async function(filters, fields = "") {
    console.log(filters)
    const userDetails = await UserDetails.findOne(filters).select(fields);
    console.log(userDetails)
    return userDetails;
  },
  getUser: async function(filters, fields = "") {
    const user = await Users.findOne(filters).select(fields);
    return user;
  },
  getUserById: async function(id) {
    const user = await Users.findById(id);
    return user;
  },
  getUserCredits: async function(id) {
    const credits = await UserDetails.findById(id).select("credits");
    return credits;
  }
};
