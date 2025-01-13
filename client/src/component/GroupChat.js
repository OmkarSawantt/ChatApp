import React, { useContext, useEffect, useRef, useState } from 'react'
import wallapaper from '../Assets/wallapaper.jpeg'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Avatar from './Avatar';
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoAttachSharp } from "react-icons/io5";
import { IoMdImage, IoMdVideocam } from "react-icons/io";
import { SocketContext } from '../redux/SocketContext';
import Loader from './Loader';
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import GroupDetail from './GroupDetail';
import moment from 'moment'
import { decryptLargeMessage, encryptLargeMessage } from '../utils/cryptoUtils';
import GroupMessagesList from './GroupMessagesList';
const GroupChat = () => {
  const param = useParams()
  const [groupDetailPage, setGroupDetailPage] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const socketConnection = useContext(SocketContext);
  const [allMessages, setAllMessages] = useState([])

  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: ''
  })
  const [groupData, setGroupData] = useState({
    name: '',
    profile_pic: '',
    createdBy: {},
    members: [],
    createdAt: '',
    public_key: '',
    private_key: '',
  })
  const user = useSelector(state => state?.user)
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('group-page', param.groupId);
      socketConnection.on('group-data', (data) => {
        setGroupData(data)
      })
      socketConnection.emit('group-seen', user._id, param.groupId);
      socketConnection.on('group-message', (groupID, data) => {
        if (groupID === param.groupId) {
          setAllMessages(data);
          if (param.groupId) {
          }
        }
      });
    }
  }, [socketConnection, param.groupId, user]);
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
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        if (!message.imageUrl && !message.videoUrl) {
          const [
            messageText,
            image,
            video,
          ] = await Promise.all([
            encryptLargeMessage(groupData.public_key, message.text),
            '',
            ''
          ]);
          socketConnection.emit('new-group-message', param.groupId, {
            messageText: messageText,
            image: image,
            video: video,
            msgByUserID: user._id
          })
        } else if (!message.videoUrl) {
          const [
            messageText,
            image,
            video,
          ] = await Promise.all([
            encryptLargeMessage(groupData.public_key, message.text),
            encryptLargeMessage(groupData.public_key, message.imageUrl),
            ''
          ]);
          socketConnection.emit('new-group-message', param.groupId, {
            messageText: messageText,
            image: image,
            video: video,
            msgByUserID: user._id
          })
        } else if (!message.imageUrl) {
          const [
            messageText,
            image,
            video,
          ] = await Promise.all([
            encryptLargeMessage(groupData.public_key, message.text),
            '',
            encryptLargeMessage(groupData.public_key, message.videoUrl),
          ]);
          socketConnection.emit('new-group-message', param.groupId, {
            messageText: messageText,
            image: image,
            video: video,
            msgByUserID: user._id
          })
        }

        setMessage({
          text: '',
          imageUrl: '',
          videoUrl: ''
        })
      }
    }
  }
  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }


  return (
    <div style={{ backgroundImage: `url(${wallapaper})` }} className='bg-no-repeat h-screen bg-cover shadow-inner '>
      <header className='sticky top-0 h-[4.25rem] bg-white flex justify-between items-center px-4 border-l-[0.5px] border-slate-300'>
        <div className='flex items-center gap-4 h-full'>
          <Link to={'/group'} className='lg:hidden'><MdOutlineArrowBack size={30} /></Link>
          <div>
            <Avatar width={50} height={50} imageUrl={groupData.profile_pic} name={"userData.name"} />
          </div>
          <div className='flex flex-col h-full w-full justify-center'>
            <h3 className='font-semibold text-lg my-o text-ellipsis line-clamp-1 overflow-hidden whitespace-nowrap'>{groupData.name}</h3>
            <p className="text-slate-500 text-sm text-ellipsis line-clamp-1">
              {groupData.members.map((member, index) => member.name).join(',  ')}
            </p>
          </div>
        </div>
        <div>
          <button onClick={() => setGroupDetailPage(prevState => !prevState)} className='hover:text-primary text-3xl'>
            <RiMenu3Fill />
          </button>
        </div>
      </header>
      <section className='h-[calc(100vh-136px)] overflow-x-hidden overflow-y-auto scrollbar relative bg-slate-200 bg-opacity-75'>

        <GroupMessagesList allMessages={allMessages} user={user}  groupData={groupData} decryptLargeMessage={decryptLargeMessage}/>
        {
          message.imageUrl && (
            <div className='w-full h-full  sticky bottom-0  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-secondary' onClick={(e) => handleClearUploadImage(e)}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} alt="uploadImage" className='w-full h-full max-w-sm  object-scale-down' />
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
                <video src={message.videoUrl} controls muted autoPlay className='aspect-video w-full h-full max-w-sm m-2' >Your browser does not support the video tag.</video>
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


      <section className='h-[4.25rem] bottom-0 bg-white flex items-center px-4 border-l-2 border-slate-200'>
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
        groupDetailPage && (
          <GroupDetail groupData={groupData} groupId={param.groupId} />
        )
      }
    </div>
  )
}

export default GroupChat