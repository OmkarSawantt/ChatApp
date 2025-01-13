const { GroupChatModel } = require('../models/GroupChatModel');
const { decryptData } = require('./cryptoUtilsServer');

const getGroups = async (currentUserId) => {
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
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .exec();

    const processedGroups = groups.map(group => {
      // Decrypt the private key for each group
      const decryptedPrivateKey = decryptData(group.private_key);

      const unseenMessages = group.messages.filter(
        message => !message.seenBy.includes(currentUserId)
      ).length;

      const lastMessage = group.messages[group.messages.length - 1] || null;

      return {
        ...group.toObject(), // Convert Mongoose document to plain JavaScript object
        unseenMessages,
        lastMessage,
        private_key:decryptedPrivateKey,  // Include the decrypted private key in the result
      };
    });

    return processedGroups;
  } catch (error) {
    console.log(error);
  }
};

module.exports = getGroups;
