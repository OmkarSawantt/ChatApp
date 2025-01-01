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
  msgByUserID:{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
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
  profile_pic:{
    type:String,
    default:"https://firebasestorage.googleapis.com/v0/b/uploadingfile-1f51f.appspot.com/o/ChatApp%2Ff5.png?alt=media&token=f52d2481-b3b9-4130-a274-070bb18b3da3"
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
          ref:'GroupMessage'
      }
  ]
},{
  timestamps:true
})
const GroupMessageModel=mongoose.model('GroupMessage',groupMessageSchema)
const GroupChatModel=mongoose.model('GroupConversation',groupChatSchema)
module.exports={
  GroupMessageModel,
  GroupChatModel
}