const mongoose=require("mongoose")
const User=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide name"]
    },
    email:{
        type:String,
        required:[true,"Provide Email"],
        unique:true
    }
})