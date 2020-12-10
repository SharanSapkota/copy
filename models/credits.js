const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
    credits:{
        type: Number,
        required: true,

    },

    users: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

    adminSeller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },

    partnerId: {
        type: Schema.Types.ObjectId,
        ref: 'Partners'
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('credits', orderSchema)