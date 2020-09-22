const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = mongoose.Schema({
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Post'

    // },
    profile_picture: {
        type: String,
        required: false

    },
    // clothes_listed: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Post'
    // }],
    // followers: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Users'
    // },
    // following:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Users'
    // },
    reviews: [{
        type: String,
        required: false
    }]
})

module.exports = mongoose.model('Profiles',profileSchema)