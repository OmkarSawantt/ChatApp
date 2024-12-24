import React from 'react'
import Slidebar from '../component/Slidebar'
import { Outlet, useLocation } from 'react-router-dom'
import logo from '../Assets/logo1.svg'
const Group = () => {

  const location=useLocation()
  const basepath=location.pathname === '/group'

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white  ${!basepath && "hidden" } lg:block`}>
      <Slidebar/>
      </section>
      <section className={`${basepath && "hidden" }`}>
        <Outlet/>
      </section>
      {basepath && (
        <div className='hidden lg:flex justify-center items-center flex-col gap-2'>
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>
          <p className='text-lg mt-2 text-slate-700'>Select User to send message</p>
        </div>
      )}
    </div>
  )
}

export default Group