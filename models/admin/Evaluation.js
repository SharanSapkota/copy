const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EvaluationSchema = Schema ({

    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Sellers'
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

    
    maintenance: {
        status:{
             type: Boolean,
                default: false
        },

        receivedDate: {
            type: Date
            
        },
        sentDate: {
            type: Date
            
        }

    },
    dry_cleaning: {
        status:{
            type: Boolean,
               default: false
       },

       status:{
        type: Boolean,
           default: false
   },

   receivedDate: {
       type: Date
       
   },
   sentDate: {
       type: Date
       
   }
    }

})

module.exports = mongoose.model("evaluation", EvaluationSchema)