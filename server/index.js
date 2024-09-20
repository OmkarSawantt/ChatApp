const express=require('express')
const cors=require('cors')
const fileUpload = require('express-fileupload');
require('dotenv').config()
const connectDB=require('./config/connectDB')
const router=require('./routes/UserRoutes')
const {app,server}=require('./socket/index')
// const app=express()
const cookieParser=require('cookie-parser')
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(fileUpload());
app.use(cookieParser())
const PORT=process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.json({
        message:"server running at "+PORT
    })
})
app.use('/api',router)


connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at "+PORT);
    })
})