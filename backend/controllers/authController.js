const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    "process.env.JWT_SECRETE,",
    {
      expiresIn: "30000000000",
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
      expiresIn:30000000000,//This is neccessary for the front end
  
      data: {
        user,
      },
    });
  };
  
  exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      clubName:req.body.clubName,
      email: req.body.email,
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
    expiresIn:30000000000,
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

  const decoded = await promisify(jwt.verify)(token,"process.env.JWT_SECRETE,");

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

