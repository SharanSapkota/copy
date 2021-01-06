const Order = require('../models/Orders')
const Post= require('../models/Post')

const getAllOrders = async() => {
    try {
        const getAllOrder = await Order.find().populate({path: "buyer", select: "phone_number"}).populate('clothes');
  
        return getAllOrder
    
      } catch (err) {
        return err
      }
}

const getOrderById = async(id, clothes) => {
    try{
        const getOrderById = await Order.findById(id).populate(clothes);
        console.log(getOrderById)
          return getOrderById
    } catch (err) {
        return err
    }
}

const postOrder = async(clothes, seller) => {
    const orderClothes = await Post.findById(clothes).populate(seller)
    return orderClothes 
}

const patchOrder = async(id, orderUpdateDestructure) => {
  
  const patchOrders = await Order.findOneAndUpdate(
    { id , $set: orderUpdateDestructure}
  )
return patchOrders
}


const changeOrder = async(id, status) => {
  console.log(id)
  const findOrder = await getOrderById(id);
  console.log(findOrder)
  if(findOrder){
    findOrder.order_status = status;
  }
  return findOrder
}

module.exports = {
    getAllOrders,
    getOrderById,
  postOrder,
   changeOrder,
   patchOrder,
}