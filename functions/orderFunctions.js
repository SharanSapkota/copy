const Orders = require("../models/Orders");

module.exports = {
  getPurchases: async function(id) {
    const purchases = Orders.find({ buyer: id }).populate("clothes");
    return purchases;
  },
  getPendingOrders: async function(id) {
    let ordersArr = [];

    Orders.find({ buyer: { $ne: id }, order_status: "pending" })
      .populate({
        path: "clothes"
      })
      .sort({ date: -1 })
      .exec(function(err, orders) {
        orders.forEach(order => {
          if (order.clothes.seller === id) {
            ordersArr.push(order);
          }
        });
      });

    return ordersArr;
  },
  getCompletedOrders: async function(id) {
    let ordersArr = [];

    Orders.find({ buyer: { $ne: id }, order_status: "completed" })
      .populate({
        path: "clothes"
      })
      .sort({ date: -1 })
      .exec(function(err, orders) {
        orders.forEach(order => {
          if (order.clothes.seller === id) {
            ordersArr.push(order);
          }
        });
      });

    return ordersArr;
  }
};
