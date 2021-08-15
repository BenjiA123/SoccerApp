const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    postId:{type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},
    comment:{
        type:String,
        required:true
    },
    created_at: { 
        type: Date, 
        default: Date.now() },
})


const Comment = mongoose.model("Comment",commentSchema)

module.exports  =Comment