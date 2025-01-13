import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const MessagesList = ({ allMessages, user, decryptLargeMessage }) => {
  const [loading, setLoading] = useState(true);
  const [formattedMessages, setFormattedMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref for scrolling to the end

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [formattedMessages]); // Trigger on messages update

  useEffect(() => {
    const decryptMessages = async () => {
      setLoading(true);
      const decryptedMessages = await Promise.all(
        allMessages.map(async (msg, index) => {
          const showDate =
            index === 0 ||
            moment(msg.createdAt).format('YYYY-MM-DD') !== moment(allMessages[index - 1]?.createdAt).format('YYYY-MM-DD');

          const decryptedImage = msg?.image
            ? await decryptLargeMessage(user.private_key, msg.sender === user._id ? msg.senderImage : msg.image)
            : null;

          const decryptedVideo = msg?.video
            ? await decryptLargeMessage(user.private_key, msg.sender === user._id ? msg.senderVideo : msg.video)
            : null;

          const decryptedText = await decryptLargeMessage(
            user.private_key,
            msg.sender === user._id ? msg.senderText : msg.messageText
          );

          const formattedDate = moment(msg.createdAt).calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: 'dddd, MMM D',
            sameElse: 'MMMM D, YYYY',
          });

          const formattedTime = moment(msg.createdAt).format('hh:mm A');

          return {
            showDate,
            formattedDate,
            decryptedImage,
            decryptedVideo,
            decryptedText,
            formattedTime,
            isCurrentUser: user._id === msg.sender,
          };
        })
      );
      setFormattedMessages(decryptedMessages);
      setLoading(false);
    };

    decryptMessages();
  }, [allMessages, user, decryptLargeMessage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-sm text-gray-500">Decrypting messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-2 mx-2">
      {formattedMessages.map((msg, index) => (
        <React.Fragment key={index}>
          {msg.showDate && (
            <div className="text-center text-sm text-black py-1 bg-slate-100 mx-auto p-4 rounded-xl">
              {msg.formattedDate}
            </div>
          )}
          <div
            className={`p-1 py-1 rounded w-fit min-w-60 max-w-[200px] md:max-w-lg lg:max-w-xl ${
              msg.isCurrentUser ? 'ml-auto bg-secondary text-white' : 'bg-white'
            }`}
          >
            {msg.decryptedImage && (
              <img src={msg.decryptedImage} alt="Uploaded" className="w-full h-full object-scale-down" />
            )}
            {msg.decryptedVideo && (
              <video src={msg.decryptedVideo} className="w-full h-full object-scale-down" controls />
            )}
            <p className="px-2 text-lg lg:text-2xl">{msg.decryptedText}</p>
            <p className="text-xs w-fit ml-auto">{msg.formattedTime}</p>
          </div>
        </React.Fragment>
      ))}
      {/* This is where the scroll reference is placed */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
