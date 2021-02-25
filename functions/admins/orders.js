const Order = require("../../models/Orders");
const { Post } = require("../../models/Post");

const getAllOrders = async () => {
  try {
    const getAllOrder = await Order.find().populate("clothes.item");

    return getAllOrder;
  } catch (err) {
    return err;
  }
};

const getAllCompletedOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "completed" }).sort({
      completed_date: -1,
    });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllPendingOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "pending" }).sort({
      date: -1,
    });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllProcessingOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "processing" }).sort({
      date: -1,
    });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllCancelledOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "cancelled" }).sort({
      date: -1,
    });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getOrderById = async (id, clothes) => {
  try {
    const getOrderById = await Order.findById(id).populate(clothes);

    return getOrderById;
  } catch (err) {
    return err;
  }
};

const postOrder = async (clothes, seller) => {
  const orderClothes = await Post.findById(clothes).populate(seller);
  return orderClothes;
};

const patchOrder = async (id, orderUpdateDestructure) => {
  const patchOrders = await Order.findOneAndUpdate({
    id,
    $set: orderUpdateDestructure,
  });
  return patchOrders;
};

module.exports = {
  getAllOrders,
  getAllCompletedOrders,
  getAllPendingOrders,
  getAllProcessingOrders,
  getAllCancelledOrders,
  getOrderById,
  postOrder,
  patchOrder,
};
