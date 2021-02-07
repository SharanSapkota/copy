const { LexModelBuildingService } = require("aws-sdk");
const Users = require("../models/Users");

const getAllSellers = async () => {
  const getAllSeller = await Users.find();
  return getAllSeller;
};

module.exports = { getAllSellers };
