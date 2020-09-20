const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const UserDetailsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    
    email: {
        type: String,
        required: false,
        trim: true
    },
    phone_number: {
        type: Number,
        required: false,
        trim: true
    },
    dob: {
        type:Date,
        required: false,
        trim: true
    }, 
    address: {
        type: String,
        required: false,
        trim: true
    }, 

    bank_details: { 
        
        type: String,
        required: false,
        trim: true
    }, 
    type: {
        type: String,
        required: false,
        trim: true
    },  
    credits: {
        type: Number,
        required: false,
        trim: true
    },  
    liked_items: [{
        type: String,
        required: false,
        trim: true
    }],  
    
    role: {
        type: String,
        required: false,
        trim: true
    },  
})

module.exports = mongoose.model('UserDetails',UserDetailsSchema)