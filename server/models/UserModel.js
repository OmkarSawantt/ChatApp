const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide name"]
    },
    email:{
        type:String,
        required:[true,"Provide Email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Provide Password"]
    },
    profile_pic:{
        type:String,
        default:""
    }
},{
    timestamps:true
})
module.exports=mongoose.model('User',userSchema)