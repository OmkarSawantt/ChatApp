import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from "react-router-dom";
import { userDetails } from '../Actions/UserActions';
import { logout, setUser } from '../redux/userSlice';
import Slidebar from '../component/Slidebar';
const Home = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const fetchUserDetails= async()=>{
    try {
      const res=await userDetails()
      dispatch(setUser(res.data))
      if (res.data.logout) {
        dispatch(logout())
        navigate('/email')
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUserDetails()
  })

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className='bg-white'>
      <Slidebar/>
      </section>

      <section>
        <Outlet/>
      </section>
    </div>
  )
}

export default Home