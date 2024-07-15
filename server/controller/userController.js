const User = require("../models/UserModel");
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const {v4:uuid}=require("uuid")

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
        const imageRef = ref(storage, `ChatApp/${profile_pic.name + uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, thumbnail);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUrl(downloadURL);

    } catch (error) {
        return res.this.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}