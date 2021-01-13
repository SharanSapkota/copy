const Orders = require("../models/Orders");

module.exports = {
  getPurchases: async function(id) {
    const purchases = Orders.find({ buyer: id }).populate("clothes");
    return purchases;
  },
  getOrdersBySeller: async function(id, filters = {}) {
    let ordersArr = await Orders.find({
      buyer: { $ne: id },
      ...filters
    })
      .populate({
        path: "clothes",
        match: {
          seller: id
        }
      })
      .sort({ date: -1 })
      .exec();

    return ordersArr;
  },
  getOrdersBySellerAlt: async function(id, oid) {
    let ordersArr = await Orders.find({
      _id: oid
    })
      .populate({
        path: "clothes",
        match: {
          seller: id
        }
      })
      .sort({ date: -1 })
      .exec();

    return ordersArr;
  },
  getOrderById: async function(id, user) {
    var order = await Orders.findById(id)
      .populate({ path: "clothes" })
      .exec();

    return order;
  }
};
