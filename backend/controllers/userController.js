const User = require("../models/userModel")
const factory = require('../controllers/handlarFactory')
const catchAsync = require('../utils/catchAsync')



exports.getOneByUserName = catchAsync(async (req,res,next)=>{
    const doc = await User.find({username:req.params.username}).select('-__v -password')
    if (!doc) {
      return next(new AppError(`No document Found this with ID`, 404));
    }
    res.status(201).json({
      status:'success',
      data: doc
  })
})



exports.getUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)

exports.getUsersAroundMe = factory.getDataAroundMe(User)
exports.deleteUser = factory.delete(User)




exports.getMe = catchAsync(async(req,res,next)=>{
const me = await User.findOne({_id:req.user._id})

res.status(200).json({
    result:"success",
    data:me
})
})
exports.updateMe = catchAsync(async(req,res,next)=>{

    const filterObj = (obj, ...allowedFileds) => {
        const newObj = {};
        Object.keys(obj).forEach((el) => {
          if (allowedFileds.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
      };
    

      const filteredBody = filterObj(
          req.body,
           'username',
           'name',
           'email',
           'clubName',
           'description',
           'imagePath',
           'locationCordinate');

           

    const updatedUser = await User.findByIdAndUpdate(
        {_id:req.user._id},
        filteredBody,
        {new:true,
            runValidators:false}).select("-__v -password")

       res.status(200).json({
        status:"success",
        message:"You have been updated",
        data:{
            updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findOneAndUpdate({_id:req.user._id},{active:false})
    
    res.status(204).json({
        result:"success",
        data:"You have been deactivated"
    })
    })
    
    


    