const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcryptjs');

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
    default:"http://localhost:4000/images/default.jpg"
},
active:{
  type:Boolean,
  required:false,
  default:true

},
created_at:{
  type:Date,
  default:Date.now()
},

// Create the location at where the blurt was made.... nahhhhhh
locationCordinate: [Number],
})


// userSchema.pre(/^findByIdAndUpdate/, function(next){
//   this.active = true
//   next()
// })




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


  // Prevents inactive users from showing in the search
  userSchema.pre(/^find/, function(next){
    this.find({active:{$ne:false}})
    next()
  })


  // For logging in checks if passwords are the same
  userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };



userSchema.plugin(uniqueValidator)
module.exports = mongoose.model("User", userSchema)