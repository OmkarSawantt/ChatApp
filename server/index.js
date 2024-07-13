const express=require('express')
const cors=require('cors')
require('dotenv').config()
const connectDB=require('./config/connectDB')


const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL
}))

const PORT=process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.json({
        message:"server running at "+PORT
    })
})
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server running at "+PORT);
    })
})