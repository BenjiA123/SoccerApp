const express = require('express');
const userRouter = express.Router();
const UserController = require("../controllers/userController")
const AuthController = require("../controllers/authController")

userRouter.post("/signup", AuthController.signup);
userRouter.post("/login", AuthController.login);

userRouter.post("/forgot-password", AuthController.forgotPassword);
userRouter.post("/reset-password", AuthController.resetPassword);


userRouter.get('', UserController.getUsers)

// api/users/users-around/100/center/2,3/unit/mi
userRouter.route('/me').get(AuthController.protect,UserController.getMe)
.patch(AuthController.protect,UserController.updateMe)
.delete(AuthController.protect,UserController.deleteMe)



userRouter.get('/:username',AuthController.protect,UserController.getOneByUserName)


userRouter.get('/users-around/:distance/center/:latlng/unit/:unit',AuthController.protect,UserController.getUsersAroundMe)

userRouter.route('/:id').get( UserController.getUser)
.delete(AuthController.protect,
    AuthController.restrictTo("MD","admin"), 
    UserController.deleteUser)
module.exports = userRouter