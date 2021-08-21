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
  if (!req.file) return next();


  // This is what creates the name of the post don't edit for firebase
  
    var metadata ={
      contentType:'image/jpeg'
    }

    var imageStorageRef = firebase.storage().ref().child(`images/posts/post-${req.user.id}-${Date.now()}.jpeg`)
    var uploadTask = imageStorageRef.put(req.file.buffer,metadata)

    uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    // console.log('Upload is ' + progress + '% done');
    // switch (snapshot.state) {
    //   case firebase.storage.TaskState.PAUSED: // or 'paused'
    //     console.log('Upload is paused');
    //     break;
    //   case firebase.storage.TaskState.RUNNING: // or 'running'
    //     console.log('Upload is running');
    //     break;
    // }
  }, 
  (error) => {
    // Handle unsuccessful uploads
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
    uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {

      req.file.filename = downloadURL




      // exports.createPost = catchAsync(async(req,res,next)=>{

        let url
        if(!req.file)  req.file.filename =undefined
      
        
        const user = await  User.findOne({_id:req.user._id})
        const userLocation = user.coordinates
        const post = new Post( {
          title:req.body.title,
          content:req.body.content,
          imagePath:req.file.filename,
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
    });
  }
)

// console.log(req.file)

//   next();
});
