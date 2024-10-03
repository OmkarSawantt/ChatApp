const mongoose=require('mongoose')

const OneToOneChatSchema=new mongoose.Schema({
  participants:[{
    type: Schema.Types.ObjectId,
    ref:'User'
  }],
  lastMessage:{
    type: Schema.Types.ObjectId,
    ref:'OneToOneMessage'
  }
})
module.exports=mongoose.model('OnetoOneChat',OneToOneChatSchema)