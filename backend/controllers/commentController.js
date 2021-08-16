const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlarFactory')
const AppError = require('../utils/appError')



exports.createComment = 

catchAsync( async (req, res, next) => {
    console.log(req.body.postId)
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