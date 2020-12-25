const mongoose = require('mongoose')
// const Schema = mongoose.Schema

    const signUpSchema = mongoose.Schema({
        fullname: {
            type: String,
            required: false,
            trime: true
        },
        username: { 
            type: String,
            required: false,
            trim: false
         },
        password: {
            type: String,
            required: false,
            trim: false
          },
        phone_number: { 
            type: Number,
            required: false,
            
         },
        email: {
            type: String,
            required: false
        },
        address: [{ 
            type: String,
            required: false
         }],
        dob: { 
            type: Date,
            required: false
        } ,
        
        bank_name: {
            type: String,
            required: false
        },
        branch: {
            type: String,
            required: false
        },
           
        accout_holder_name: {
            type: String,
            required: false
        },
     
        account_number: {
            type: Number,
            required: false
        }
    })
    
    module.exports = mongoose.model('signup', signUpSchema)


