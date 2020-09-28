const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = mongoose.Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    clothes: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    total_amount: {
        type: Number,
        required: false
    },
    discount: {
        type: Number,
        required: false
    },
    total_after_discount: {
        type: Number,
        required: false
    },
    delivery_charge: {
        type: Number,
        required: false
    },
    total_order_amount: {
        type: Number,
        required: false
    },
    pickup_location: {
        type: String,
        required: false
    },
    delivery_location: {
        type: String,
        required: false
    },
    payment_status: {
        type: Number,
        required: false
    },
    order_status: {
        type: Number,
        required: false
    },
})

module.exports = mongoose.model('Orders', orderSchema)