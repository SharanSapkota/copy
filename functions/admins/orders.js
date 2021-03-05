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
    const orders = await Order.find({ order_status: "completed" })
      .populate("clothes.item")
      .sort({
        completed_date: -1,
      });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllPendingOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "pending" })
      .populate("clothes.item")
      .sort({
        date: -1,
      });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllProcessingOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "processing" })
      .populate("clothes.item")
      .sort({
        date: -1,
      });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getAllCancelledOrders = async () => {
  try {
    const orders = await Order.find({ order_status: "cancelled" })
      .populate("clothes.item")
      .sort({
        date: -1,
      });
    return { success: true, orders };
  } catch (err) {
    return err;
  }
};

const getOrderById = async (id, clothes) => {
  try {
    const getOrderById = await Order.findById(id).populate("clothes.item");

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
  const patchOrders = await Order.findOneAndUpdate(
    {
      _id: id,
    },
    orderUpdateDestructure,
    { new: true }
  );
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
