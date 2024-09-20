const express=require('express')
const {Server}=require('socket.io')
const http =require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')

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
  onlineUser.add(user?.id)

  io.emit('onlineUser',Array.from(onlineUser))
  io.on('disconnect',()=>{
    console.log('disconnect user', socket.id);
  })
})


module.exports={
  app,server
}