const express = require('express')
const ImageController = require("../controllers/imageController")
const PostController = require("../controllers/postController")
const AuthController = require("../controllers/authController")
const postRouter = express.Router()

postRouter.post('',
// You can always blurt from anywhere
AuthController.protect,
ImageController.uploadUserPhoto,
ImageController.resizeUserPhoto,
PostController.createPost)

postRouter.patch('/:comment/:id',
// You can always blurt from anywhere
AuthController.protect,
PostController.commentOnPost)



postRouter.get('/blurts-around/:distance/center/:latlng/unit/:unit',PostController.getBlurtAround)


postRouter.get('', PostController.getPosts)
postRouter.get("/:id", PostController.getPost)
postRouter.patch("/:id",AuthController.protect,
ImageController.uploadUserPhoto,
ImageController.resizeUserPhoto,
 PostController.updatePost)
postRouter.delete('/:id',AuthController.protect, PostController.deletePost)


module.exports = postRouter;
