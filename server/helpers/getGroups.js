const {GroupChatModel} =require('../models/GroupChatModel')

const getGroups =async(currentUserId)=>{
  try {
    const groups = await GroupChatModel.find({
      members: currentUserId,
    })
      .populate({
        path: 'messages',
        populate: {
          path: 'msgByUserID',
          select: 'name email',
        },
      })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .exec();
    const processedGroups = groups.map(group => {
      const unseenMessages = group.messages.filter(
        message => !message.seenBy.includes(currentUserId)
      ).length;

      const lastMessage = group.messages[group.messages.length - 1] || null;

      return {
        ...group.toObject(), // Convert Mongoose document to plain JavaScript object
        unseenMessages,
        lastMessage,
      };
    });

    return processedGroups;
  } catch (error) {
    console.log(error);

  }
}

module.exports =getGroups