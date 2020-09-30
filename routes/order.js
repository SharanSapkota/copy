const express = require('express')
const Order = require('../models/Orders')
const User = require('../models/Users')

const router = express.Router()

router.get('/', async (req, res) => {
    // res.send('I am in order.js')
    try{
    const getAllOrder = await Order.find()
        res.json(getAllOrder)
    }
    catch(err) {
        res.json(err)
    }
})

router.get('/:orderId', async (req, res) => {
    // res.send('I am in order.js')
    const order_status = "pending";
    try{
    const getOrderById = await Order.findById({_id: req.params.orderId})
        res.json({getOrderById})
    }
    catch(err) {
        res.json(err)
    }
})


router.post('/', async (req, res) => {
    
    const  {
        buyer,
        clothes,
        total_amount,
        discount,
        total_after_discount,
        delivery_charge,
        total_order_amount,
        pickup_location,
        delivery_location,
        payment_status,
        
    } = req.body

   var order_status = "pending"

    orderDestructure = {}

    if(buyer) {
        orderDestructure.buyer = buyer
    }
    if(clothes) {
        orderDestructure.clothes = clothes
    }
    if(total_amount) {
        orderDestructure.total_amount = total_amount
    }
    if(discount) {
        orderDestructure.discount = discount
    }
    if(total_after_discount) {
        orderDestructure.total_after_discount = total_after_discount
    }
    if(delivery_charge) {
        orderDestructure.delivery_charge = delivery_charge
    }
    if(total_order_amount) {
        orderDestructure.total_order_amount = total_order_amount
    }
    if(pickup_location) {
        orderDestructure.pickup_location = pickup_location
    }
    if(delivery_location) {
        orderDestructure.delivery_location = delivery_location
    }
    if(payment_status) {
        orderDestructure.payment_status = payment_status
    }
    orderDestructure.order_status= order_status

 //  const order_status1
        const orderPost = new Order(orderDestructure)
        try{
            const saveOrderPost = await orderPost.save()
            res.json({saveOrderPost})
    }
    catch(err) {
        res.json({message: err })
    }
})


router.patch('/:orderId', async (req, res) => {

    const  {
        
        pickup_location,
        delivery_location
      
    } = req.body

    
    orderUpdateDestructure = {}

    if(pickup_location) {
        orderUpdateDestructure.pickup_location = pickup_location
    }
    if(delivery_location) {
        orderUpdateDestructure.delivery_location = delivery_location
    }
   
   
    try{
    const updateOrder = await Order.findOneAndUpdate(

        { _id: req.params.orderId },
        { $set: orderUpdateDestructure }
        )

        res.status(200).json(updateOrder)
    }
    catch(err) {
        res.json({ message: err})
    }
})



router.patch('/:orderId/cancel', async (req, res) => {
    try{
        const updateStatus = await Order.findOneAndUpdate (
            {_id:req.params.orderId},
            {$set : {order_status: "cancelled"}}
            
        )
        res.status(201).json(updateStatus)
     }
     catch(err) {
        res.status(400).json({ message: err})
    }
})
router.patch('/:orderId/complete', async (req, res) => {
   
    //const order_status = "cancelled"

    // const getOrderById = await Order.findById({_id: req.params.orderId})
    // res.json({getOrderById, order_status})
    
    try{
        const updateStatus = await Order.findOneAndUpdate (
            {_id:req.params.orderId},
            {$set : {order_status: "completed"}}
            
        )
        res.status(201).json(updateStatus)
     }
     catch(err) {
        res.status(400).json({ message: err})
    }
})

router.get('/to/:UserId', async (req, res) => {
    console.log("this is the population")
    try{
    
    const getUsers = await User.find()
    //console.log(getUsers)
     //await Order.find({buyer: User._id}).populate("clothes").exec((err, docs) => { 
     const buyerOrders = await Order.find({$or: [{buyer: User._id}, {seller: User._id}]}).populate("clothes")

        res.json(buyerOrders)
}
catch(err) {
    res.json(err)
}

})

//  router.get('/seller/:UserId', async (req, res) => {
//     await Order find({seller: User._id})
//     .populate("clothes")
//     .exec((err, result) => {
//         res.json(result)
//     })


// })




router.get('/cancelorder', (req, res) => {
    res.send('I am in cancel order.js')

})


module.exports = router
