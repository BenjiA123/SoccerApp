
const express = require('express')
const commentController = require("../controllers/commentController")
const AuthController = require("../controllers/authController")
const commentRouter = express.Router()


commentRouter.use(AuthController.protect) //Prevent repeted code
commentRouter.route('')
.post(commentController.createCommentOnPost)
.get(commentController.getAllComments)
.put(commentController.editComment)

commentRouter.get('/post/:postId',commentController.getAllCommentsOnPost)
commentRouter.get('/sender/:senderId',commentController.getAllCommentsFromOneUser)
commentRouter.get('/sender/:senderId/post/:postId',commentController.getAllCommentsFromOneUserOnOnePost)

module.exports = commentRouter;



