
const MendingSchema = mongoose.Schema({
    evaluation: {
        type: Schema.Types.ObjectId,
        ref: "evaluation"
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
})

module.exports = mongoose.model("mending", MendingSchema)