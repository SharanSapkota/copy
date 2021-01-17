const Credits = require("../models/Credits");
const UserDetails = require("../models/UserDetails");

module.exports = {
  createBuyerCredits: async function(userId, order, amount) {
    const creditFields = {
      user: userId,
      transaction: "spent",
      details: { title: "Credits Used", order }
    };

    const newCredit = new Credits(creditFields);
    newCredit.save();
    return newCredit;
  },
  updateBuyerCredits: async function(id, amount) {
    const updatedCredits = await UserDetails.findOneAndUpdate(
      { id: id },
      { credits: amount }
    );
    return updatedCredits;
  }
};
