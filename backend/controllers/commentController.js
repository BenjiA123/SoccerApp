const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlarFactory')
const AppError = require('../utils/appError')


exports.createCommentOnPost = catchAsync( async (req, res, next) => {
    const comment = new Comment({
        senderId:req.user._id,
        postId:req.body.postId,
        comment:req.body.comment
    })
    const createdComment = await Comment.create(comment)
    res.status(200).json({
        status:"success",
        message: createdComment
        
    })
})



exports.getAllComments  = factory.filterFunction(Comment)
exports.getAllCommentsOnPost = factory.filterFunction(Comment)
exports.getAllCommentsFromOneUser  = factory.filterFunction(Comment)
exports.getAllCommentsFromOneUserOnOnePost  = factory.filterFunction(Comment)


exports.editComment  = catchAsync(async(req,res,next)=>{
    const updatedComment = await Comment.findOneAndUpdate(
        {
        senderId:req.user._id,
        postId:req.body.postId
    },
        {comment:req.body.comment,edited:true}
        )
    res.status(200).json({
        status:"success",
        updatedComment
        
    })
})

// exports.deleteCommentByCreatorOfPost  = catchAsync(async(req,res,next)=>{})
// exports.deleteCommentByCreatorOfComment  = catchAsync(async(req,res,next)=>{})