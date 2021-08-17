const express = require('express');
const userRouter = express.Router();
const UserController = require("../controllers/userController")
const AuthController = require("../controllers/authController")

userRouter.post("/signup", AuthController.signup);
userRouter.post("/login", AuthController.login);


// api/users/users-around/100/center/2,3/unit/mi
userRouter.get('/me',AuthController.protect,UserController.getMe)

userRouter.get('/:username',AuthController.protect,UserController.getOneByUserName)

userRouter.patch('/me',AuthController.protect,UserController.updateMe)
userRouter.delete('/deleteMe',AuthController.protect,UserController.deleteMe)

userRouter.get('/users-around/:distance/center/:latlng/unit/:unit',AuthController.protect,UserController.getUsersAroundMe)

userRouter.get('',AuthController.protect,AuthController.restrictTo("MD","admin"), UserController.getUsers)
userRouter.route('/:id').get( UserController.getUser)
.delete(AuthController.protect,
    AuthController.restrictTo("MD","admin"), 
    UserController.deleteUser)
module.exports = userRouter