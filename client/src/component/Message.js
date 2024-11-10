import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Avatar from './Avatar';
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoAttachSharp } from "react-icons/io5";
import { IoMdImage, IoMdVideocam } from "react-icons/io";
import { IoClose, IoSendSharp } from "react-icons/io5";
import { imageDelete, imageUpload } from '../Actions/UserActions';
import Loader from './Loader';
import wallapaper from '../Assets/wallapaper.jpeg';
import { SocketContext } from '../redux/SocketContext';
import moment from 'moment';
import UserDetail from './UserDetail';

const Message = () => {
  const param = useParams();
  const socketConnection = useContext(SocketContext);
  const user = useSelector(state => state?.user);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
    createdAt: ''
  });
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetailPage, setUserDetailPage] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: ''
  });
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef();

  const scrollToBottom = () => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleUploadOpen = () => {
    setOpenUpload(prev => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const imageData = new FormData();
    imageData.append('image', file);
    const res = await imageUpload(imageData);
    setMessage(prev => ({ ...prev, imageUrl: res.data.URL }));
    setOpenUpload(false);
    setLoading(false);
  };

  const handleClearUploadImage = async (e) => {
    const body = { imageUrl: message.imageUrl };
    const res = await imageDelete(body);

    if (res.success) {
      e.target.value = null;
    }
    setMessage(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const videoData = new FormData();
    videoData.append('image', file);
    const res = await imageUpload(videoData);
    setMessage(prev => ({ ...prev, videoUrl: res.data.URL }));
    setOpenUpload(false);
    setLoading(false);
  };

  const handleClearUploadVideo = async (e) => {
    const imageData = new FormData();
    imageData.append('imageUrl', message.videoUrl);
    const res = await imageDelete(imageData);

    if (res.success) {
      e.target.value = null;
    }
    setMessage(prev => ({ ...prev, videoUrl: '' }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', param.userId);
      socketConnection.emit('seen', param.userId);
      socketConnection.on('message-user', (data) => {
        setUserData(data);
      });
      socketConnection.on('message', (data) => {
        setAllMessages(data);
      });
    }
  }, [socketConnection, param.userId, user]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage(prev => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: param.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl
        });
        setMessage({ text: '', imageUrl: '', videoUrl: '' });
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${wallapaper})` }} className='bg-no-repeat bg-cover shadow-inner '>
      <header className='sticky top-0 h-[4.25rem] bg-white flex justify-between items-center px-4 border-l-[0.5px] border-slate-300'>
        <div className='flex items-center gap-4 h-full'>
          <Link to={'/home'} className='lg:hidden'><MdOutlineArrowBack size={30} /></Link>
          <div>
            <Avatar width={50} height={50} imageUrl={userData.profile_pic} name={userData.name} userId={userData._id} />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-o text-ellipsis line-clamp-1'>{userData.name}</h3>
            <p className='-mt-2 text-sm'>
              {userData.online ? <span className='text-secondary'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>
        <button onClick={() => setUserDetailPage(prevState => !prevState)} className='hover:text-primary text-3xl'>
          <RiMenu3Fill />
        </button>
      </header>

      <section className='h-[calc(100vh-136px)] overflow-x-hidden overflow-y-auto scrollbar relative bg-slate-200 bg-opacity-75'>
        <div ref={currentMessage} className='flex flex-col gap-2 py-2 mx-2'>
          {allMessages.map((msg, index) => (
            <div
              className={`p-1 py-1 rounded w-fit max-w-[200px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserID ? 'ml-auto bg-primary' : 'bg-white'}`}
              key={index}
            >
              <div className='w-full'>
                {msg?.imageUrl && (
                  <img src={msg?.imageUrl} alt="Message attachment" className='w-full h-full object-scale-down' onLoad={scrollToBottom} />
                )}
                {msg?.videoUrl && (
                  <video src={msg?.videoUrl} className='w-full h-full object-scale-down' controls />
                )}
              </div>
              <p className="px-2">{msg.text}</p>
              <p className='text-xs w-fit ml-auto'>{moment(msg.createdAt).format('hh:mm')}</p>
            </div>
          ))}
        </div>
        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-secondary' onClick={handleClearUploadImage}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img src={message.imageUrl} alt="uploadImage" className='aspect-video w-full h-full max-w-sm m-2 object-scale-down' />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className='w-full h-full sticky top-auto bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-secondary' onClick={handleClearUploadVideo}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video src={message.videoUrl} controls muted autoPlay className='aspect-video w-full h-full max-w-sm m-2'>
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
        {loading && (
          <div className='w-full h-full sticky bottom-0 flex items-center justify-center'>
            <Loader />
          </div>
        )}
      </section>

      <section className='h-[4.25rem] bg-white flex items-center px-4 border-l-2 border-slate-200'>
        <div className='relative'>
          <button onClick={handleUploadOpen} className='flex justify-center items-center h-8 w-8 rounded-full hover:bg-slate-300'>
            <IoAttachSharp className='text-secondary' size={25} />
          </button>
          {openUpload && (
            <div className='absolute bg-white shadow-lg w-24 rounded mt-2 px-1 flex flex-col'>
              <label htmlFor='imageUpload' className='flex items-center gap-1 text-lg p-1 cursor-pointer hover:text-secondary'>
                <IoMdImage />
                Image
              </label>
              <input type='file' accept='image/*' id='imageUpload' className='hidden' onChange={handleUploadImage} />
              <label htmlFor='videoUpload' className='flex items-center gap-1 text-lg p-1 cursor-pointer hover:text-secondary'>
                <IoMdVideocam />
                Video
              </label>
              <input type='file' accept='video/*' id='videoUpload' className='hidden' onChange={handleUploadVideo} />
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className='flex-1 flex items-center gap-2'>
          <input type="text" value={message.text} onChange={handleOnChange} placeholder='Message' className='border w-full px-4 py-2 rounded-full' />
          <button type="submit" className='text-secondary rounded-full flex justify-center items-center'>
            <IoSendSharp size={25} />
          </button>
        </form>
      </section>

      {userDetailPage && (
        <UserDetail userId={userData._id} userName={userData.name} userEmail={userData.email} userPic={userData.profile_pic} createdAt={userData.createdAt} />
      )}
    </div>
  );
};

export default Message;
