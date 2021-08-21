const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    title: {type:String,required:true},
    content: {type:String,required:true},
    imagePath: {type:String,required:false},
    locationCoordinate:{type:[Number],required:false,},
    created_at:{type:Date,default:Date.now()},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});


// postSchema.pre('save', function (next) {
//     // this.locationCordinate = User.locations.coordinates
//     console.log(User)
//     next();
//   });
postSchema.pre(/^find/, function(next){
    this.populate('creator')
    // Select only username
    next()
})

module.exports = mongoose.model('Post',postSchema);


