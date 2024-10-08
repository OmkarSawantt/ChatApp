const express=require('express')
const {Server}=require('socket.io')
const http =require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')

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
      online:onlineUser.has(userId)
    }
    socket.emit('message-user',payload)
  })

  socket.on('disconnect',()=>{
    onlineUser.delete(user?.id)
    console.log('disconnect user', socket.id);

  })
})


module.exports={
  app,server
}