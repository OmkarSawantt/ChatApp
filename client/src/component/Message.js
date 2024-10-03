import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams,Link } from 'react-router-dom'
import Avatar from './Avatar';
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoAttachSharp } from "react-icons/io5";
import { IoMdImage,IoMdVideocam  } from "react-icons/io";
import { imageUpload } from '../Actions/UserActions';
const Message = () => {
  const param=useParams()
  const socketConnection=useSelector(state=>state?.user?.socketConnection)
  const user=useSelector(state=>state?.user)
  const [userData,setUserData]=useState({
    name:'',
    email:'',
    profile_pic:'',
    online:false,
    _id:''
  })
  const [openUpload,setOpenUpload]=useState(false)

  const [message,setMessage]=useState({
    text:'',
    imageUrl:'',
    videoUrl:''
  })
  const handleUploadOpen=()=>{
    setOpenUpload(preve=>!preve)
  }

  const handleUploadImage=async(e)=>{
    const file=e.target.files[0]
    const imageData = new FormData();
    imageData.append('image', file);
    const res=await imageUpload(imageData)
    setMessage(preve=>{
      return{
        ...preve,
        imageUrl:res.data.URL
      }
    })
  }
  const handleUploadVideo=async(e)=>{
    const file=e.target.files[0]
    const videoData = new FormData();
    videoData.append('image', file);
    const res=await imageUpload(videoData)
    setMessage(preve=>{
      return{
        ...preve,
        videoUrl:res.data.URL
      }
    })
  }

  useEffect(() => {
    if(socketConnection){
      socketConnection.emit('message-page',param.userId)

      socketConnection.on('message-user',(data)=>{
        console.log('user Details',data);
        setUserData(data)
      })
    }
  }, [socketConnection,param.userId,user])

  return (
    <div>
      <header className='sticky top-0 h-[4.25rem] bg-white flex justify-between items-center px-4 border-l-[0.5px] border-slate-300'>
        <div className='flex items-center gap-4 h-full'>
            <Link to={'/home'} className='lg:hidden'><MdOutlineArrowBack size={30}/></Link>
          <div>
            <Avatar width={50} height={50} imageUrl={userData.profile_pic} name={userData.name} userId={userData._id}/>
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
          <button className='hover:text-primary text-3xl'>
            <RiMenu3Fill />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-136px)] overflow-x-hidden overflow-y-auto scrollbar'>
        {
          message.imageUrl &&(
            <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} alt="uploadImage" width={300} height={300} />
              </div>
            </div>
          )
        }
      </section>
      <section className='h-[4.25rem] bg-slate-100 flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleUploadOpen} className=' flex justify-center bg-slate-200 items-center h-10 w-10 rounded-full hover:bg-secondary hover:text-white'><IoAttachSharp size={25}/></button>
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
                  <input type="file" id='uploadImage' onChange={handleUploadImage}/>
                  <input type="file" id='uploadVideo' onChange={handleUploadVideo} />
                </form>
              </div>
            )
          }
        </div>
      </section>
    </div>
  )
}

export default Message