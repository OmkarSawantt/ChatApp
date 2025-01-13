import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Avatar from './Avatar';
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoAttachSharp } from "react-icons/io5";
import { IoMdImage, IoMdVideocam } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Loader from './Loader';
import wallapaper from '../Assets/wallapaper.jpeg'
import { IoSendSharp } from "react-icons/io5";
import { SocketContext } from '../redux/SocketContext';
import UserDetail from './UserDetail';
import { decryptLargeMessage, encryptLargeMessage } from '../utils/cryptoUtils';
import MessagesList from './MessagesList';
const Message = () => {
  const param = useParams()
  const [paramUserId, setParamUserId] = useState();
  const socketConnection = useContext(SocketContext);
  const user = useSelector(state => state?.user)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
    createdAt: '',
    public_Key:''
  })
  const [openUpload, setOpenUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userDetailPage, setUserDetailPage] = useState(false)
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: ''
  })
  const [allMessages, setAllMessages] = useState([])
  useEffect(()=>{
    setParamUserId(param.userId)
  },[param.userId ,paramUserId])


  const handleUploadOpen = () => {
    setOpenUpload(preve => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    setLoading(true)
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setMessage(preve => {
          return {
            ...preve,
            imageUrl: reader.result
          }
        })
      };
    }
    setOpenUpload(false)
    setLoading(false)
  }
  const handleClearUploadImage = async (e) => {
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: ''
      }
    })
  }
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
      const maxSize = 10 * 1024 * 1024; // 10 MB limit
  if (file && file.size > maxSize) {
    alert("File size exceeds 10 MB");
    return;
  }
    setLoading(true)
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setMessage(preve => {
          return {
            ...preve,
            videoUrl: reader.result
          }
        })
      };
    }
    setOpenUpload(false)
    setLoading(false)
  }
  const handleClearUploadVideo = async (e) => {
    setMessage(preve => {
      return {
        ...preve,
        videoUrl: ''
      }
    })
  }
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', paramUserId)

      socketConnection.emit('seen', paramUserId)
      socketConnection.on('message-user', (data) => {
        setUserData(data)
      })
      socketConnection.on('message', (userId,data) => {
        if(userId===paramUserId){
          socketConnection.emit('seen', paramUserId)
          setAllMessages(data)
        }
      })
    }
  }, [socketConnection, paramUserId, user])

  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }
  const handleSendMessage = async(e) => {
    try {
      e.preventDefault()
      if (message.text || message.imageUrl || message.videoUrl) {
        if (socketConnection) {
          if (!message.imageUrl && !message.videoUrl) {
            const [
              messageText,
              senderText,
              image,
              senderImage,
              video,
              senderVideo
            ] = await Promise.all([
              encryptLargeMessage(userData.public_Key, message.text),
              encryptLargeMessage(user.public_key, message.text),
              '',
              '',
              '',
              ''
            ]);
            socketConnection.emit('new message', {
              sender: user?._id,
              receiver: param.userId,
              messageText: messageText,
              senderText: senderText,
              image: image,
              senderImage: senderImage,
              video: video,
              senderVideo: senderVideo,
            })
          }else if(!message.videoUrl){
            const [
              messageText,
              senderText,
              image,
              senderImage,
              video,
              senderVideo
            ] = await Promise.all([
              encryptLargeMessage(userData.public_Key, message.text),
              encryptLargeMessage(user.public_key, message.text),
              encryptLargeMessage(userData.public_Key, message.imageUrl),
              encryptLargeMessage(user.public_key, message.imageUrl),
              '',
              ''
            ]);
            socketConnection.emit('new message', {
              sender: user?._id,
              receiver: param.userId,
              messageText: messageText,
              senderText: senderText,
              image: image,
              senderImage: senderImage,
              video: video,
              senderVideo: senderVideo,
            })
          }else if(!message.imageUrl){
            const [
              messageText,
              senderText,
              image,
              senderImage,
              video,
              senderVideo
            ] = await Promise.all([
              encryptLargeMessage(userData.public_Key, message.text),
              encryptLargeMessage(user.public_key, message.text),
              '',
              '',
              encryptLargeMessage(userData.public_Key, message.videoUrl),
              encryptLargeMessage(user.public_key, message.videoUrl),
            ]);
            socketConnection.emit('new message', {
              sender: user?._id,
              receiver: param.userId,
              messageText: messageText,
              senderText: senderText,
              image: image,
              senderImage: senderImage,
              video: video,
              senderVideo: senderVideo,
            })
          }
          setMessage({
            text: '',
            imageUrl: '',
            videoUrl: ''
          })
        }
      }
    } catch (error) {
      console.log(error);

    }
  }
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
              {
                userData.online ? <span className='text-secondary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
        <div>
          <button onClick={() => setUserDetailPage(prevState => !prevState)} className='hover:text-primary text-3xl'>
            <RiMenu3Fill />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-136px)] overflow-x-hidden overflow-y-auto scrollbar relative bg-slate-200 bg-opacity-75'>

        <MessagesList allMessages={allMessages} user={user}  decryptLargeMessage={decryptLargeMessage} />
        {
          message.imageUrl && (
            <div className='w-full h-full  sticky bottom-0  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-secondary' onClick={(e) => handleClearUploadImage(e)}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} alt="uploadImage" className='aspect-video w-full h-full max-w-sm m-2 object-scale-down' />
              </div>
            </div>
          )
        }
        {
          message.videoUrl && (
            <div className='w-full h-full sticky top-auto bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-secondary' onClick={(e) => handleClearUploadVideo(e)}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <video src={message.videoUrl} controls  autoPlay className='aspect-video w-full h-full max-w-sm m-2' >Your browser does not support the video tag.</video>
              </div>
            </div>
          )
        }
        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex items-center justify-center'>
              <Loader />
            </div>
          )
        }
      </section>
      <section className='h-[4.25rem] bg-white flex items-center px-4 border-l-2 border-slate-200'>
        <div className='relative'>
          <button onClick={handleUploadOpen} className=' flex justify-center bg-primary items-center h-10 w-10 rounded-full hover:bg-secondary text-white'><IoAttachSharp size={25} /></button>
          {
            openUpload && (
              <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 rounded hover:bg-slate-200 cursor-pointer'>
                    <div className='text-secondary'> <IoMdImage size={18} /></div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center rounded p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-secondary'><IoMdVideocam size={18} /></div>
                    <p>Video</p>
                  </label>
                  <input type="file" id='uploadImage' onChange={handleUploadImage} className='hidden' />
                  <input type="file" id='uploadVideo' onChange={handleUploadVideo} className='hidden' />
                </form>
              </div>
            )
          }
        </div>
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input type="text" placeholder='Enter Your Message....' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleOnChange} />
          <button className='text-primary hover:text-secondary'>
            <IoSendSharp size={30} />
          </button>
        </form>
      </section>
      {
        userDetailPage && (
          <UserDetail userId={userData._id} userName={userData.name} userEmail={userData.email} userPic={userData.profile_pic} createdAt={userData.createdAt} />
        )
      }
    </div>
  )
}


export default Message