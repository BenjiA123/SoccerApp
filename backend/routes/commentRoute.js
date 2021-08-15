
const express = require('express')
const commentController = require("../controllers/commentController")
const AuthController = require("../controllers/authController")
const commentRouter = express.Router()

commentRouter.post('',
AuthController.protect,
commentController.createComment)


module.exports = commentRouter;



