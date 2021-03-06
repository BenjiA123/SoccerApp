const express = require('express')
const ImageController = require("../controllers/imageController")
const PostController = require("../controllers/postController")
const AuthController = require("../controllers/authController")
const postRouter = express.Router()

postRouter.post('',
// You can always blurt from anywhere
AuthController.protect,
ImageController.uploadSinglePhoto,
ImageController.firebaseUpload,
)

postRouter.get('/one-users-posts/:userId',PostController.getAllPostsByUser)


postRouter.get('/blurts-around/:distance/center/:latlng/unit/:unit',PostController.getBlurtAround)


postRouter.get('', PostController.getPosts)
postRouter.get("/:id", PostController.getPost)
postRouter.patch("/:id",AuthController.protect,
ImageController.uploadSinglePhoto,
ImageController.firebaseUpload,
 PostController.updatePost)
postRouter.delete('/:id',AuthController.protect, PostController.deletePost)


module.exports = postRouter;
