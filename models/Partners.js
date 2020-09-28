const mongoose = require('mongoose')

const partnerSchema = mongoose.Schema({
    username: {
        type: String,
        required: false

    },

    password: {
        type: String,
        required: false

    },

    brand_name: {
        type: String,
        required: false

    }
})

module.exports = mongoose.model('LoginPartners',partnerSchema)