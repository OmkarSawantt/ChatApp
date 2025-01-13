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
        default:"data:image/jpeg;base64,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"
    },
    public_key:{
        type:String,
        required:true
    },
    private_key:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
module.exports=mongoose.model('User',userSchema)