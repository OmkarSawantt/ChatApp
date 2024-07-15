const express=require('express')
const cors=require('cors')
const fileUpload = require('express-fileupload');
require('dotenv').config()
const connectDB=require('./config/connectDB')
const router=require('./routes/UserRoutes')
const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(fileUpload());
const PORT=process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.json({
        message:"server running at "+PORT
    })
})
app.use('/api',router)


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server running at "+PORT);
    })
})