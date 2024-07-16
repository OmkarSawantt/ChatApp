const User = require("../models/UserModel");
const { storage } = require('../firebase'); 
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const {v4:uuid}=require("uuid")
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')

//register
const registerUser=async(req,res)=>{
    try {
        const {name ,email,password}=req.body;
        const {profile_pic}=req.files;
        const cheackEmail=await User.findOne({email})
        if(cheackEmail){
            return res.status(400).json({
                message:"User Already Exsist",
                error:true
            })
        }
        const filename=profile_pic.name;
        const spittedFilename=filename.split('.')
        const newName=spittedFilename[0]+uuid()+"."+spittedFilename[spittedFilename.length-1]
        const imageRef = ref(storage, `ChatApp/${newName}`);
        const metadata = {
            contentType: profile_pic.mimetype,
        };
        const snapshot = await uploadBytes(imageRef, profile_pic.data, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const salt=await bcryptjs.genSalt(10)
        const hashedPassword=await bcryptjs.hash(password,salt)

        const payLoad={
            name,
            email,
            profile_pic:downloadURL,
            password:hashedPassword
        }
        const user=new User(payLoad)
        const userSave=await user.save()
        if(userSave){
            return res.status(201).json({
                message:"User Created Successfully",
                data:userSave,
                success:true
            })
        }else{
            return res.status(400).json({
                message:"Something went Wrong",
                error:true
            })
        }

    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}
//checkEmail
const cheackEmail= async(req,res)=>{
    try {
        const {email}=req.body;
        const cheackEmail=await User.findOne({email}).select("-password")
        if(!cheackEmail){
            return res.status(400).json({
                message:"User not Exsist",
                error:true
            })
        }
        return res.status(200).json({
            message:"email verified",
            success:true,
            data:cheackEmail
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}
const checkPassword=async(req,res)=>{
    try {
        const {password,userID}=req.body;
        const user=await User.findById(userID)
        const verifyPass=await bcryptjs.compare(password,user.password)
        if(!verifyPass){
            return res.status(400).json({
                message:"Please Check Password",
                success:true
            })            
        }else{
            const tokendata={
                id:user._id,
                email:user.email
            }
            const token=jwt.sign(tokendata,process.env.JWT_SECREAT_KEY,{expiresIn:'1d'})
            const cookieOptions={
                http:true,
                secure:false
            }
            return res.cookie('token',token,cookieOptions).status(200).json({
                message:"Login Successfull",
                token:token,
                success:true
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}
module.exports={registerUser,cheackEmail,checkPassword}