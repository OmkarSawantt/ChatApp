const express=require('express')
const {Server}=require('socket.io')
const mongoose=require('mongoose')
const bodyParser = require('body-parser');
const http =require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const app=express()
const getConversation =require('../helpers/getConversation')
const getGroups = require('../helpers/getGroups')
const { GroupChatModel, GroupMessageModel } = require('../models/GroupChatModel')
/* Socket Connection */

const server=http.createServer(app)
const io=new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
const onlineUser=new Set()


io.on('connection',async(socket)=>{
  console.log('connect User',socket.id);

  const token=socket.handshake.auth.token

  const user=await getUserDetailsFromToken(token)
  socket.join(user)
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
      online:onlineUser.has(userId),
      createdAt:userDetails?.createdAt
    }
    socket.emit('message-user',payload)
    const getConversationMessages=await ConversationModel.findOne({
      "$or":[
        {sender:user, receiver:userDetails?._id?.toString()},
        {sender:userDetails?._id?.toString() , receiver:user}
      ]
    }).populate('messages').sort({updatedAt:-1})
    socket.emit('message',userId, getConversationMessages?.messages || []);
  })
  socket.on('group-page',async(groupID)=>{
    const getGroupMessages=await GroupChatModel.findById(groupID).populate({
      path: 'messages',
      populate: {
        path: 'msgByUserID',
        select: 'name email',
      },
    }).sort({updatedAt:-1});
    socket.emit('group-message',groupID, getGroupMessages?.messages || []);
  })
  socket.on('new-group-message', async (groupId, messageData) => {
    try {
      const newMessage = await GroupMessageModel.create(messageData);
      const updatedMessage = await GroupMessageModel.findByIdAndUpdate(
        newMessage._id,
        { $addToSet: { seenBy: messageData.msgByUserID } },
        { new: true }
      );
      const updatedGroup = await GroupChatModel.findByIdAndUpdate(
        groupId,
        { $push: { messages: updatedMessage._id } },
        { new: true }
      );
      if (!updatedGroup) {
        return socket.emit('error', 'Group Not Found');
      }
      const getGroupMessages = await GroupChatModel.findById(groupId).populate({
        path: 'messages',
        populate: {
          path: 'msgByUserID',
          select: 'name email',
        },
      }).sort({ updatedAt: -1 });
      socket.emit('group-message',groupId, getGroupMessages?.messages || []);
      const memberPromises = updatedGroup.members.map(async (memberId) => {
        const groups = await getGroups(memberId);
        io.to(memberId.toString()).emit('groups', groups);
        io.to(memberId.toString()).emit('group-message',groupId, getGroupMessages?.messages || []);
      });
      await Promise.all(memberPromises);
    } catch (error) {
      console.error('Error in new-group-message:', error);
      socket.emit('error', 'Something went wrong');
    }
  });

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

    io.to(data.sender).emit('message',data.receiver, getConversationMessages?.messages || []);
    io.to(data.receiver).emit('message',data.sender, getConversationMessages?.messages || []);

    const conversationSender=await getConversation(data.sender)
    const conversationReceiver=await getConversation(data.receiver)

    io.to(data.sender).emit('conversation', conversationSender);
    io.to(data.receiver).emit('conversation', conversationReceiver);
  });


  socket.on('slidebar',async(currentUserId)=>{
    try {
      console.log('curent UserID',currentUserId);
      const conversation=await getConversation(currentUserId)
      const groups=await getGroups(currentUserId)
      socket.emit('conversation',conversation)
      socket.emit('groups',groups)
    } catch (error) {
      console.log(error);
    }
  })

  socket.on('seen',async(msgByUserId)=>{
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: user, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user }
      ]
    });
    const conversationMessageID=conversation?.messages || []

    const updateMsg=await MessageModel.updateMany(
      { _id : {"$in" : conversationMessageID} , msgByUserID : msgByUserId},
      { "$set" : { seen : true}}
    )
    const conversationSender=await getConversation(user)
    const conversationReceiver=await getConversation(msgByUserId)

    io.to(user).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  })
  socket.on('group-seen', async (userId, groupId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
            return;
        }
        const group = await GroupChatModel.findById(groupId).populate('messages').exec();
        if (!group) {
            return;
        }
        const unseenMessages = group.messages.filter(
            (message) => !message.seenBy.some((id) => id.toString() === userId)
        );
        if (unseenMessages.length === 0) {
            return;
        }
        const updatePromises = unseenMessages.map((message) =>
            GroupMessageModel.findByIdAndUpdate(
                message._id,
                { $addToSet: { seenBy: userId } },
                { new: true }
            )
        );
        await Promise.all(updatePromises);
        console.log("userId",userId, "groupId",groupId);
        const groups=await getGroups(userId)
        socket.emit('groups',groups)
    } catch (error) {
        console.error('Error processing group-seen event:', error.message);
    }
});
  socket.on('disconnect',()=>{
    onlineUser.delete(user?.id)
    console.log('disconnect user', socket.id);
  })
})


module.exports={
  app,server
}