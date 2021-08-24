const AppError = require('../utils/appError');
const multer = require("multer")
const catchAsync = require('../utils/catchAsync')
const Post = require('../models/postModel')
const User = require('../models/userModel')


const firebase = require('./firebaseImageController')



const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please Upload only Images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// // User Configurations for Images
exports.uploadSinglePhoto = upload.single('imagePath');

exports.firebaseUpload = catchAsync(async (req, res, next) => {
  let url
        if(!req.file)  {
        
          url = undefined
          const user = await  User.findOne({_id:req.user._id})

          const userLocation = user.coordinates
          const post = new Post( {
            title:req.body.title,
            content:req.body.content,
            imagePath:url,
            creator :req.user._id, 
            locationCoordinate:userLocation
            
          })
          const createdPost = await Post.create(post)
          const totalPosts = await Post.count()
          res.status(200).json({
            totalPosts,
            status:"success",
            data:createdPost
          })
        
        
        }else{
            var metadata ={
              contentType:'image/jpeg'
            }
        
            var imageStorageRef = firebase.storage().ref().child(`images/posts/post-${req.user.id}-${Date.now()}.jpeg`)
            var uploadTask = imageStorageRef.put(req.file.buffer,metadata)
        
            uploadTask.on('state_changed', 
          (snapshot) => {}, 
          (error) => {
            return next(
              new AppError(
                'Image could not be uploaded',
                500
              )
            );  
            
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(catchAsync(async (downloadURL) => {
        
              url = downloadURL
                const user = await  User.findOne({_id:req.user._id})
                const userLocation = user.coordinates
                const post = new Post( {
                  title:req.body.title,
                  content:req.body.content,
                  imagePath:url,
                  creator :req.user._id,
                  // Note, in the future ensure that you make this to change depending on the current location of the individual
                  // Now only the location the person gave at registration of the account is used
                  locationCoordinate:userLocation
                  
                })
                const createdPost = await Post.create(post)
                res.status(200).json({
                  status:"success",
                  data:createdPost
                })
            }));
          }
        )

          
        }

});
