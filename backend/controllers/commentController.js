const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlarFactory')
const AppError = require('../utils/appError')



exports.createComment =factory.createOne(Comment)

// catchAsync( async (req, res, next) => {
//     const comment = req.params.comment
//     const updatedComment = await Post.findByIdAndUpdate(req.params.id,comment)
//   console.log(updatedComment.comment)
//     res.status(200).json({
//         message: "updatedComment.comment"

//     })
// })