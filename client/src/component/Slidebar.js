import React, { useState } from 'react'
import { TbMessageFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';

const Slidebar = () => {
  const user = useSelector(state => state?.user)
  const [editUserOpen, setEditUserOpen] = useState(false)

  return (
    <div className='w-full h-full'>
      <div className='bg-slate-700 w-12 h-full rounded-tr-md rounded-br-md py-5 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50 ${isActive && "bg-slate-800"}`} title='chat'>
            <TbMessageFilled size={25} />
          </NavLink>
          <div title='add friend' className='w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50'>
            <FaUserPlus size={25} className='-mr-2' />
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <button className='mx-auto' title={user.name} onClick={() => setEditUserOpen(true)}>
            <Avatar imageUrl={user.profile_pic} name={user.name} width={40} height={40} key={user.profile_pic} />
          </button>
          <button title='logout' className='w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50'>
            <BiLogOut size={25} className='-ml-2' />
          </button>
        </div>
      </div>
      {
        editUserOpen && (
          <EditUserDetails onclose={() => setEditUserOpen(false)} user={user} />
        )
      }
    </div>
  )
}

export default Slidebar
