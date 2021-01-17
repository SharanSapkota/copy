const Discounts = require("../models/Discounts");

module.exports = {
  getOneDiscount: async function(filters, fields) {
    const discount = await Discounts.findOne(filters).select(fields);

    return discount;
  },
  calcDiscount: function(total, discount, type) {
    switch (type) {
      case "flat":
        return discount;
      case "percentage":
        return total * (discount / 100);
      default:
        return discount;
    }
  },
  validateDiscount: async function(discount) {
    const d = await Discounts.findById(discount);
    const now = Date.now();
    if (d) {
      if (d.expiration_date > now) {
        return d;
      }
    }
  }
};
