const Orders = require("../models/Orders");
const Agreements = require("../models/Agreements");
const { getUserDetails } = require("./users");

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
  getOrderById: async function(id) {
    var order = await Orders.findById(id)
      .populate({ path: "clothes", model: "Posts" })
      .exec();

    return order;
  },
  verifyOrderSeller: async function(order, user) {
    var order = await module.exports.getOrderById(order);

    if (String(order.clothes.seller) === user) return order;
  },
  placeOrder: async function(orderFields) {
    try {
      const order = new Order(orderFields);
      await order.save();
      if (order) {
        return order;
      }
    } catch (err) {
      return false;
    }
  },
  patchOrder: async function(id, orderUpdateDestructure) {
    const patchOrder = await Order.findOneAndUpdate(
      { _id: id },
      orderUpdateDestructure,
      { new: true }
    );
    return patchOrder;
  },
  createAgreement: async function(uid, oid) {
    const fullname = getUserDetails({ user: uid }, "name");
    const text = `I, ${fullname}, hereby agree to sell my item to Antidote Apparel Pvt. Ltd.`;
    const agreement = new Agreements({ user: uid, order: oid, text });
    await agreement.save();
  }
};
