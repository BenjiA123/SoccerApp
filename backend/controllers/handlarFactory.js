const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync')


  exports.getOne = Model =>

  catchAsync(async (req,res,next)=>{
      const doc = await Model.findById(req.params.id).select('-__v -password')
      if (!doc) {
        return next(new AppError(`No document Found this with ID`, 404));
      }
      res.status(201).json({
        status:'success',
        data: {doc}
    })
  })

  exports.createOne = Model =>
  
  catchAsync(async (req,res,next)=>{
    
      const doc = await Model.create(req.body)

      res.status(200).json({
          status:'success',
          doc
      })
  })

exports.delete = Model =>  catchAsync(async (req, res, next) => {
  const document = await Model.findByIdAndDelete(req.params.id);

  if (!document) {
    return next(new AppError(`No document Found this with ID`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: 'Document Successfully Deleted',
  });
});

exports.getDataAroundMe = Model => catchAsync(async(req,res,next)=>{


  const {distance,latlng,unit} = req.params
  const [lat,lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;


  if(!lat || !lng){
    return next(
      new AppError("Please provide lat and lng",400)
    )
  }

  const doc = await Model.find({
    locationCordinate: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status:'success',
    result:doc.length,
    data:doc
  })
})


exports.filterFunction = (Model)=>
    catchAsync(async(req,res,next)=>{
      let filterObj = {}
      if(req.params.postId) filterObj = {postId:req.params.postId}
      else if(req.params.senderId) filterObj = {senderId:req.params.senderId}
      else if(req.params.postId && req.params.senderId) filterObj = {postId:req.params.postId, senderId:req.params.senderId}

    
        const doc = await Model.find(filterObj)
        
        res.status(200).json({
            status:"success",
            result:doc.length,
            doc
            
        })
    })

    exports.getAll = Model =>

 catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    // const doc = await features.query.explain(); //The explain method explains the whole document
    const doc = await features.query
    res.status(200).json({
      status: 'success',
      result: doc.length,
      doc,
    });
  });
