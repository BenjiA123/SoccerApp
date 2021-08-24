const Post = require('../models/postModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlarFactory')
const AppError = require('../utils/appError')




const filterObj = (obj, ...allowedFileds) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFileds.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

exports.updatePost = catchAsync( async(req, res, next) => {
    if (req.body.password) {
        return next(
          new AppError(
            'This route is not to update your password\n Please use UpdateMyPassword',
            400
          )
        );
      }
    
      // Filtered out unwanted fields
      const filteredBody = filterObj(req.body, 'title', 'content','imagePath');
      if(req.file) filteredBody.imagePath = req.file.filename
   
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, filteredBody, {
        // Post.updateOne({ _id: req.params._id, creator: req.userData.userId }, filteredBody, {
        new: true,
        runValidators: false,
      })
        res.status(200).json({
            status:"success",
            data:updatedPost
        })
      

}
)









exports.getPosts = factory.getAll(Post)


exports.getPost = factory.getOne(Post)



exports.deletePost = catchAsync(async (req, res, next) => {
    await Post.deleteOne({ _id: req.params.id, creator: req.user._id })
       res.status(204).json()
})


exports.getBlurtAround = factory.getDataAroundMe(Post)



exports.getAllPostsByUser = catchAsync(async(req,res,next)=>{




  // Get user ID
  const userId = await User.findById(req.params.userId)
// Creator Id should not be populated
  const posts =  await Post.find({creator:userId._id},{active:true})
  .select('title content creator created_at imagePath locationCoordinate username')
  // console.log(posts)
  res.status(200).json({
      result:"success",
      data:posts
  })
  })

// exports.getPostsByUser = catchAsync(async(req,res,next)=>{


//   const aPost = User.aggregate([
//     {
//       $match:{_id:req.params.userId}
//     }
//   ])

//   console.log(aPost)

// })