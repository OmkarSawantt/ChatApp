const express=require('express')
const {Server}=require('socket.io')
const http =require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const app=express()
/* Socket Connection */

const server=http.createServer(app)
const io=new Server(server,{
  cors:{
    origin:process.env.FRONTEND_URL,
    credentials:true
  }
})
const onlineUser=new Set()


io.on('connection',async(socket)=>{
  console.log('connect User',socket.id);

  const token=socket.handshake.auth.token

  const user=await getUserDetailsFromToken(token)
  socket.join(user.toString())
  onlineUser.add(user)
  io.emit('onlineUser',Array.from(onlineUser))

  socket.on('message-page',async(userId)=>{
    console.log('userId',userId);
    const userDetails=await UserModel.findById(userId).select('-password')

    const payload={
      _id:userDetails?._id,
      name:userDetails?.name,
      email:userDetails?.email,
      profile_pic:userDetails?.profile_pic,
      online:onlineUser.has(userId)
    }
    socket.emit('message-user',payload)

    const getConversationMessages=await ConversationModel.findOne({
      "$or":[
        {sender:user, receiver:userDetails?._id},
        {sender:userDetails?._id , receiver:user}
      ]
    }).populate('messages').sort({updatedAt:-1})


    socket.emit('message', getConversationMessages?.messages || []);

  })


  socket.on('new message', async (data) => {
    if (!data?.sender || !data?.receiver) {
      console.error('Sender or receiver is missing.');
      return socket.emit('error', 'Invalid sender or receiver.');
    }

    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    });

    if (!conversation) {
      const createConversation = new ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserID: data?.sender
    });
    const saveMessage = await message.save();

    await ConversationModel.updateOne(
      { _id: conversation?._id },
      { "$push": { messages: saveMessage?._id } }
    );

    const getConversationMessages = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    io.to(data.sender).emit('message', getConversationMessages?.messages || []);
    io.to(data.receiver).emit('message', getConversationMessages?.messages || []);
  });


  socket.on('slidebar',async(currentUserId)=>{
    try {
      console.log('curent UserID',currentUserId);
      const currentUserConversation=await ConversationModel.find({
        "$or" :[
          {sender:currentUserId},
          {receiver:currentUserId}
        ]
      }).sort({updatedAt:-1}).populate('messages').populate('sender').populate('receiver')


      const conversation=currentUserConversation.map((conv)=>{
        const countUnseenMsg=conv.messages.reduce((preve, curr) =>preve+(curr?.seen ? 0 :1),0)
        return{
          _id:conv?._id,
          sender:conv?.sender,
          receiver:conv?.receiver,
          unseenMsg:countUnseenMsg,
          lastMsg:conv.messages[conv?.messages?.length-1]
        }
      })
      console.log('conversation',conversation);

      socket.emit('conversation',conversation)
    } catch (error) {
      console.log(error);
    }
  })

  socket.on('disconnect',()=>{
    onlineUser.delete(user?.id)
    console.log('disconnect user', socket.id);
  })
})


module.exports={
  app,server
}