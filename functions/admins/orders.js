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

const getOrderById = async (id, clothes) => {
  try {
    const getOrderById = await Order.findById(id).populate(clothes);
    console.log(getOrderById);
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
    $set: orderUpdateDestructure
  });
  return patchOrders;
};

module.exports = {
  getAllOrders,
  getOrderById,
  postOrder,
  patchOrder
};
