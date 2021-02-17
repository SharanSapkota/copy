const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EvaluationSchema = Schema ({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Sellers'
    },

    category: {
        type: String,
        required: true
    },
 
    color: {
        type: String,
        required: false
    },

    detail: {
        type: String,
        required: false
    },

    brand: {
        type: String,
        required: true
    },

    selling_price: {
        type: Number,
        required: false
    },

    date: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: "pending"
    },

    date_of_pickup : {
        type: Date,
        required: false
    },
    date_of_receipt : {
        type: Date,
        required: false
    },
})
module.exports = mongoose.model("evaluation", EvaluationSchema)
module.exports = mongoose.model("Rejections", EvaluationSchema)