const mongoose=require('mongoose')

const groupMessageSchema=new mongoose.Schema({
  text:{
      type:String,
      default:""
  },
  imageUrl:{
      type:String,
      default:""
  },
  videoUrl:{
      type:String,
      default:""
  },
  seen:{
      type:Boolean,
      default:false
  },
  msgByUserID:{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
  }

},{
  timestamps:true
})


const groupChatSchema=new mongoose.Schema({
  name:{
      type:String,
      default:""
  },
  createdBy:{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
  },
  members:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }
  ],
  messages:[
      {
          type:mongoose.Schema.ObjectId,
          ref:'Message'
      }
  ]
},{
  timestamps:true
})
const GroupMessageModel=mongoose.model('Message',groupMessageSchema)
const GroupChatModel=mongoose.model('Conversation',groupChatSchema)
module.exports={
  GroupMessageModel,
  GroupChatModel
}