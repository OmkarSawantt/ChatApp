import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { userDetails } from '../Actions/UserActions';
import { logout, setUser } from '../redux/userSlice';
import Slidebar from '../component/Slidebar';
import logo from '../Assets/logo1.png'
import io from 'socket.io-client'
import { ENDPOINT_URL } from '../constants/constant';

const Home = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const location=useLocation()
  const basepath=location.pathname === '/home'
  console.log(basepath);

  const fetchUserDetails= async()=>{
    try {
      const res=await userDetails()
      if (res.logout) {
        dispatch(logout())
        navigate('/email')
      }else if (res.data) {
        dispatch(setUser(res.data))
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUserDetails()
  })

  useEffect(() => {
    const socketConnection=io(ENDPOINT_URL,{
      auth:{
        token: localStorage.getItem('token')
      }
    })
    return ()=>{
      socketConnection.disconnect()
    }
  })


  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white  ${!basepath && "hidden" } lg:block`}>
      <Slidebar/>
      </section>

      <section className={`${basepath && "hidden" }`}>
        <Outlet/>
      </section>
      {basepath && (
        <div className='lg:flex justify-center items-center flex-col gap-2'>
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>
          <p className='text-lg mt-2 text-slate-700'>Select User to send message</p>
        </div>
      )}

    </div>
  )
}

export default Home