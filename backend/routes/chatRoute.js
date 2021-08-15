const express = require('express')
const ImageController = require("../controllers/imageController")
const ChatController = require("../controllers/chatController")
const AuthController = require("../controllers/authController")
const chatRouter = express.Router()


chatRouter.route('').get(AuthController.protect,ChatController.recievedMessages)
.post(AuthController.protect,ChatController.sendMessage)
chatRouter.get('/recievedFrom/:senderId',AuthController.protect,ChatController.recievedMessagesFromAUser)
chatRouter.route('/allChats').get(ChatController.getAllChats)

module.exports = chatRouter