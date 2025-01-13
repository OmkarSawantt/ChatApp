import React, { useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const GroupMessagesList = ({ allMessages, user, groupData, decryptLargeMessage }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages when they update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessages]);

  const formattedMessages = useMemo(() => {
    return allMessages.map((msg, index) => {
      const showDate =
        index === 0 ||
        moment(msg.createdAt).format('YYYY-MM-DD') !==
          moment(allMessages[index - 1]?.createdAt).format('YYYY-MM-DD');

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
        formattedTime,
        isCurrentUser: user._id === msg.msgByUserID._id,
        senderName: msg.msgByUserID.name,
        senderId: msg.msgByUserID._id,
        image: msg?.image ? decryptLargeMessage(groupData.private_key, msg.image) : null,
        video: msg?.video ? decryptLargeMessage(groupData.private_key, msg.video) : null,
        text: decryptLargeMessage(groupData.private_key, msg.messageText),
      };
    });
  }, [allMessages, user, groupData, decryptLargeMessage]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex flex-col gap-2 py-2 mx-2">
        {formattedMessages.map((msg, index) => (
          <React.Fragment key={index}>
            {msg.showDate && (
              <div className="text-center text-sm text-black py-1 bg-slate-100 mx-auto p-4 rounded-xl">
                {msg.formattedDate}
              </div>
            )}
            <div
              className={`p-1 py-1 rounded w-fit min-w-40 max-w-sm md:max-w-xl lg:max-w-3xl ${
                msg.isCurrentUser ? 'ml-auto bg-secondary text-white' : 'bg-white'
              }`}
            >
              {!msg.isCurrentUser && (
                <Link
                  to={`/home/${msg.senderId}`}
                  className="text-xs mr-auto w-fit cursor-pointer text-ellipsis line-clamp-1"
                >
                  {msg.senderName}
                </Link>
              )}
              <div className="w-full">
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="w-full h-full object-scale-down" />
                )}
                {msg.video && (
                  <video src={msg.video} className="w-full h-full object-scale-down" controls />
                )}
              </div>
              <p className="px-2 text-lg lg:text-2xl">{msg.text}</p>
              <p className="text-xs w-fit ml-auto">{msg.formattedTime}</p>
            </div>
          </React.Fragment>
        ))}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default GroupMessagesList;
