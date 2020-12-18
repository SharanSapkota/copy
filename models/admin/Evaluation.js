const mongoose = require('mongoose')
const Schema = mongoose.Schema
const EvaluationSchema = Schema ({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    listing_type: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    purchase_price: {
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
    maintanance: {
            type: Boolean,
            default: false
    },
    dry_cleaning: {
            type: Boolean,
            default: false
    }
})
module.exports = mongoose.model("evaluation", EvaluationSchema)