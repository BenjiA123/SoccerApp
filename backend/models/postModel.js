const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    title: {type:String,required:true},
    content: {type:String,required:true},
    imagePath: {type:String,required:false},
    locationCoordinate:{type:[Number],required:false,},
    comment:{type:[String],required:false},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});


// postSchema.pre('save', function (next) {
//     // this.locationCordinate = User.locations.coordinates
//     console.log(User)
//     next();
//   });


module.exports = mongoose.model('Post',postSchema);


