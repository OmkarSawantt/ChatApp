const { GroupChatModel } = require("../models/GroupChatModel")
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

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
    const payLoad={
      name:groupName,
      createdBy:userID,
      members:groupMembers,
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
module.exports={createGroup,addMember,leftGroup}