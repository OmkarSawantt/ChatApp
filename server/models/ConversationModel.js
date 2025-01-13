const mongoose=require('mongoose')

const messageSchema = new mongoose.Schema(
    {
      messageText: {
        type: Object,
        default: "",
      },
      senderText: {
        type: Object,
        default: "",
      },
      image: {
        type: Object,
        default: "",
      },
      senderImage: {
        type: Object,
        default: "",
      },
      video: {
        type: Object,
        default: "",
      },
      senderVideo: {
        type: Object,
        default: "",
      },
      seen: {
        type: Boolean,
        default: false,
      },
      sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Message", messageSchema);


const conversationSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    messages:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Message'
        }
    ]
},{
    timestamps:true
})
const MessageModel=mongoose.model('Message',messageSchema)
const ConversationModel=mongoose.model('Conversation',conversationSchema)
module.exports={
    MessageModel,
    ConversationModel
}