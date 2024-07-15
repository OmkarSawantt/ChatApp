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
        default:"https://firebasestorage.googleapis.com/v0/b/uploadingfile-1f51f.appspot.com/o/ChatApp%2Fimages.jpeg?alt=media&token=455cda3d-3b58-4000-ba8e-4c713d26505a"
    }
},{
    timestamps:true
})
module.exports=mongoose.model('User',userSchema)