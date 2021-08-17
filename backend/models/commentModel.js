const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    postId:{type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},
    comment:{
        type:String,
        required:true
    },
    edited:{type:Boolean,required:true,default:false}, //This tells people if the comment has been edited
    created_at: { 
        type: Date, 
        default: Date.now() },
        likes:{type:Number}
})


commentSchema.pre(/^find/, function(next){
    this.populate('senderId')
    next()
})


const Comment = mongoose.model("Comment",commentSchema)

module.exports  =Comment