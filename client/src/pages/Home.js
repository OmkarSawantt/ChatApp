import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom";
import { userDetails } from '../Actions/UserActions';
const Home = () => {

  const fetchUserDetails= async()=>{
    try {
      const res=await userDetails()
      
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUserDetails()
  }, [])

  return (
    <div>Home

      <section>
        <Outlet/>
      </section>
    </div>
  )
}

export default Home