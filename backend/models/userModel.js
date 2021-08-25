const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
},
description:{
  type:String,
  required:true,
  default:"I love this club So much"
},
username: {
  type: String,
  required: true,
  unique: [true,"This username is already in use"]
},
clubName: {
  type: String,
  required: true,
},
name: {
  type: String,
  required: true
},

password: {
    type: String,
    required: true
},
passwordConfirm: {
    type: String,
    required: false, //For now
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: 'Password and confirm password Are not the same',
  },
role:{
    type:String,
    default:'user',
    enum: ['user','MD', 'admin'],
},
imagePath:{
    type:String,
    required:true,
    default:"https://firebasestorage.googleapis.com/v0/b/f-clubhouse.appspot.com/o/default.jpg?alt=media&token=24799aba-9374-4a63-8518-d7fc30c99a95"
},
active:{
  type:Boolean,
  default:true,
  required:true,

},
created_at:{
  type:Date,
  default:Date.now()
},
status: {
  type: String, 
  enum: ['Pending', 'Active'],
  default: 'Pending'
},
token:
{type:String},
tokenExpires:{type:Date},

// Create the location at where the blurt was made.... nahhhhhh
locationCordinate:{type: [Number],required:false},
})







userSchema.pre('save',async function(next){
  this.username = this.username.split(' ').join('').toLowerCase()
  next()
})




userSchema.pre('save', async function (next) {
    // Only runs if password was modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    // delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
  });
  userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });




  // For logging in checks if passwords are the same
  userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  userSchema.methods.createToken = function(){
    const token = crypto.randomBytes(32).toString('hex')
  
    // This is not storing data in the database 
  this.token = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex')
  
  this.tokenExpires = Date.now() + 10 *60*1000
  // console.log("Token on database",this.token)
  return token
  
  }


userSchema.plugin(uniqueValidator)
module.exports = mongoose.model("User", userSchema)