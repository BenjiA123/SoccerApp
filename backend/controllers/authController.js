const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require('crypto')
const User = require("../models/userModel");
const sendEmail = require("../utils/email")

const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};



const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    // res.cookie('jwt', token, cookieOptions);
  
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      token,
      expiresIn:process.env.JWT_EXPIRES_IN,//This is neccessary for the front end
  
      data: {
        user,
      },
    });
  };
  
  exports.signup = catchAsync(async (req, res, next) => {

    // if(!req.body.imagePath) req.body.imagePath= `${req.protocol}://${req.get(
    //   'host'
    // )}/images/default.jpg`

    req.body.imagePath = "https://firebasestorage.googleapis.com/v0/b/f-clubhouse.appspot.com/o/default.jpg?alt=media&token=24799aba-9374-4a63-8518-d7fc30c99a95"

    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      clubName:req.body.clubName,
      imagePath:req.body.imagePath,
      email: req.body.email,
      description:`Hey, my name is ${req.body.name} and .
        I love ${req.body.clubName}
      `,
      locationCordinate:req.body.locationCordinate,
      password: req.body.password,
      passwordConfirm:req.body.passwordConfirm
    });
  
    createSendToken(newUser, 201, res);
  });



exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Input an email and password"), 400);
  }

  const user = await User.findOne({ email: email }).select("+password");

if (!user || !(await user.correctPassword(password, user.password))) {
  return next(new AppError('Incorrect email or password', 401));
}

  const token = signToken(user._id);
    // I prevented the password from coming up in the search
    user.password =undefined
    
  res.status(200).json({
    status:"success",
    token,
    expiresIn:90000000,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];


  }
  if (!token) {
    return next(new AppError("No token available", 401));
  }
  // Verify Token

  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET,);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("This User no longer Exists", 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not permitted to access this resource Contact You MD for further details",
          403
        )
      );
    }
    next();
  };
};




exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return next(new AppError('No user exists with this email ', 404));

  // Generates Random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to users email
  
  const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-passworrd/${resetToken}`

  const message = `Forgot your password, submit a tour new Password and Password confirm to ${resetUrl}
  \n Please dont respond if you didt request this`

  try{
  
  await sendEmail({
    email:user.email,
    subject:"Your password Reset Token (Only valid for 10min)",
    message
  })

  res.status(200).json({
    status:"success",
    message:"Token send to email"
  })
  }
  catch (error) {
      console.log(error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError('Their was an error sending this email. Try again later', 500)
      );
  }
  // try {
  //   const resetURL = `${req.protocol}://${req.get(
  //     'host'
  //   )}/api/users/reset-password/${resetToken}`;
  //   await new Email(user,resetURL).sendPasswordReset()

  //   res.status(200).json({
  //     status: 'Success',
  //     message: 'Token sent to email',
  //   });
  // } catch (error) {
  //   console.log(error);
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   return next(
  //     new AppError('Their was an error sending this email. Try again later', 500)
  //   );
  // }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token and compare token to see if it has expired
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // Check if there is a user
  if (!user) {
    return next(new AppError('Token is Invalid or has expired', 400));
  }
  // Change Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Log user in with JWT
  createSendToken(user, 200, res);
});


exports.logout = (req,res,next)=>{

  res.cookie('jwt','logout',{
    expires:new Date(Date.now()+10),
    httpOnly:true
  })
  res.status(200).json({
    status:"success"
  })
}


// Update Password is diffwerent from forgot password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Check if the user has changed any of his credentials ie If theoriginal user credentials still exist

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('You are not a registered User', 400));
  }
  // Check if Posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // If so update App
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // User.findById and Update will not work well in this case
  // Middlewares and validation will not run
  await user.save();
  // Log user in send JWT
  createSendToken(user, 200, res);
});
