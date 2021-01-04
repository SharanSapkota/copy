const Profiles = require("../models/Profiles");

module.exports = {
  getProfileById: async function(id) {
    try {
      const profile = await Profiles.findById(id);
      if (profile) {
        return profile;
      }
    } catch (err) {
      return err;
    }
  },
  updateItemsListed: async function(id) {
    try {
      const profile = await Profiles.findOneAndUpdate(
        { user: id },
        { $inc: { items_listed: 1 } },
        {
          new: true
        }
      );
      return profile;
    } catch (err) {
      console.log(err);
    }
  },
  updateItemsSold: async function(id) {
    try {
      const profile = Profiles.findOneAndUpdate(
        { user: id },
        { $inc: { items_sold: 1 } },
        {
          new: true
        }
      );
      return profile;
    } catch (err) {
      console.log(err);
    }
  },
  updateReviews: async function(id, review) {
    try {
      const profile = await Profiles.findById(id);
      profile.rating.reviews.push(review);

      var totalValue = 0;
      var reviewsCount = profile.rating.reviews.length;

      for (var i = 0; i < reviewsCount; i++) {
        totalValue = totalValue + profile.rating.reviews[i].value;
      }

      var averageRating = totalValue / reviewsCount;

      profile.rating.totalCount = reviewsCount;
      profile.rating.average_rating = averageRating;

      const saved = await profile.save();

      if (saved) return saved;
    } catch (err) {
      return err;
    }
  }
};
