const { GroupChatModel } = require("../models/GroupChatModel")
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const { generateKeyPair, encryptData } = require("../helpers/cryptoUtilsServer");
const createGroup= async(req,res)=>{
  try {
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    const userID=await getUserDetailsFromToken(token)
    const groupName=req.body.name
    const groupMembers=req.body.members
    const { publicKey, privateKey } = generateKeyPair();
    const private_key=encryptData(privateKey)
    const payLoad={
      name:groupName,
      createdBy:userID,
      members:groupMembers,
      public_key:publicKey,
      private_key:private_key,
      messages:[]
    }
    if (!Array.isArray(groupMembers)) {
      return res.status(400).json({
        message: "Invalid group data. Group name and members are required.",
        error: true,
      });
    }
    const group=new GroupChatModel(payLoad)
    const groupSave=await group.save()
    if(groupSave){
      return res.status(201).json({
        message:"Group Created Successfully",
        data:groupSave,
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
const editName=async(req,res)=>{
  try {
    const  groupID=req.params.id;
    const {name}=req.body;
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Group name is required",
        success: false,
      });
    }
    const userID=await getUserDetailsFromToken(token)
    const group = await GroupChatModel.findById(groupID);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false,
      });
    }
    if(group.createdBy.toString() !== userID.toString()){
      return res.status(404).json({
        message: "You Don't have authorities",
        success: false,
      });
    }
    group.name = name;
    await group.save();

    return res.status(200).json({
      message: "Group name updated successfully",
      success: true,
      group,
    });
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const editProfilePic=async (req,res) => {
  try {
    const  groupID=req.params.id;
    const { profile_pic } = req.body;
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    const userID=await getUserDetailsFromToken(token)
    const group = await GroupChatModel.findById(groupID);
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        success: false,
      });
    }
    if(group.createdBy.toString() !== userID.toString()){
      return res.status(404).json({
        message: "You Don't have authorities",
        success: false,
      });
    }
    group.profile_pic=profile_pic
    await group.save();

    return res.status(200).json({
      message: "Group Profile pic is updated successfully",
      success: true,
      group,
    });
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const groupDetails = async (req, res) => {
  try {
    const groupID = req.params.id;
    const token = req.cookies.token || "";

    if (!token) {
      return res.json({
        message: "User not Logged in",
        logout: true,
      });
    }

    const userID = await getUserDetailsFromToken(token);

    // Fetch the group and populate the members array
    const group = await GroupChatModel.findById(groupID).populate({
      path: "members",
      select: "-password",
    }).populate({
      path: "createdBy",
      select: "-password",
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        isMember: false,
      });
    }

    const isMember = group.members.some((member) => member._id.toString() === userID);

    if (isMember) {
      return res.status(200).json({
        success: true,
        data: group,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "User is not a member of the group.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
const addMember=async (req,res) => {
  try {
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    const userID=await getUserDetailsFromToken(token)

    const groupID=req.params.id;
    const group=await GroupChatModel.findById(groupID)
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        error: true,
      });
    }
    if (userID !== group.createdBy.toString()) {
      return res.status(403).json({
        message: "Don't have permissions",
        error: true,
      });
    }
    const memberID=req.body.member
    if (!group.members.includes(memberID)) {
      group.members.push(memberID);
      await group.save(); // Save changes to the database
    } else {
      return res.status(400).json({
        message: "Member already exists in the group",
        error: true,
      });
    }
    return res.status(200).json({
      message: "Member added successfully",
      success: true,
    });


  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const remove=async(req,res)=>{
  try {
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    const userToRemove=req.body.member;
    const userID=await getUserDetailsFromToken(token)
    const groupID=req.params.id;
    const group=await GroupChatModel.findById(groupID)
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        error: true,
      });
    }
    if (userID !== group.createdBy.toString()) {
      return res.status(403).json({
        message: "Don't have permissions",
        error: true,
      });
    }
    const isMember = group.members.includes(userToRemove);
    if (!isMember) {
      return res.status(400).json({
        message: "User is not a member of this group",
        error: true,
      });
    }
    group.members = group.members.filter(member => member.toString() !== userToRemove);
    await group.save();
    return res.status(200).json({
      message: "User is successfully removed from the group",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const leftGroup=async (req,res)=>{
  try {
    const token=req.cookies.token || ""
    if(!token){
      return res.json({
        message:"User not Loged in",
        logout:true,
      })
    }
    const userID=await getUserDetailsFromToken(token)
    const groupID=req.params.id;
    const group=await GroupChatModel.findById(groupID)
    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        error: true,
      });
    }
    if (userID === group.createdBy.toString()) {
      return res.status(403).json({
        message: "Don't have permissions",
        error: true,
      });
    }
    const isMember = group.members.includes(userID);
    if (!isMember) {
      return res.status(400).json({
        message: "You are not a member of this group",
        error: true,
      });
    }
    group.members = group.members.filter(member => member.toString() !== userID);
    await group.save();

    return res.status(200).json({
      message: "You have successfully left the group",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true
    })
  }

}
module.exports={createGroup,addMember,leftGroup,groupDetails,editName,editProfilePic,remove}