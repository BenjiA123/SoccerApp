const Chat = require('../models/chatModel')
const catchAsync = require('../utils/catchAsync')
const factory = require("./handlarFactory")
const AppError = require('../utils/appError')

exports.sendMessage = catchAsync(async(req,res,next)=>{

    if(req.body.recieverId == req.user._id){
        return next(
            new AppError(
              'You cannot send a message to yourself',
              400
            )
          );
    }
    const message = new Chat({
        reciever:req.body.recieverId,
        sender:req.user._id,
        message:req.body.message
    })

    const sentMessage = await Chat.create(message)

    res.status(201).json({
        status:'success',
        data:sentMessage
    })
})


exports.recievedMessages = catchAsync(async(req,res,next)=>{
       const recievedMessages = await Chat.find({reciever:req.user._id})

    res.status(201).json({
        status:'success',
        data:recievedMessages
    })
})

exports.recievedMessagesFromAUser = catchAsync(async(req,res,next)=>{
   
    const recievedMessagesFromAUser = await Chat.find({reciever:req.user._id,sender:req.params.senderId})

    res.status(201).json({
        status:'success',
        data:recievedMessagesFromAUser
    })
})

exports.getAllChats = factory.getAll(Chat)