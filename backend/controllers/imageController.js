const AppError = require('../utils/appError');

const multer = require("multer")
const catchAsync = require('../utils/catchAsync')
const sharp = require('sharp');


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

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // This is what creates the name of the post don't edit for firebase
  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    // Change this file to store on firebase and not the default disk
    // firebase/images/posts/${req.file.filename}
    .toFile(`images/posts/${req.file.filename}`);
  next();
});
