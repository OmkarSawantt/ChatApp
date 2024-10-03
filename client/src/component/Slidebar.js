import React, { useState } from 'react'
import { TbMessageFilled } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { logout } from '../redux/userSlice';
import { logoutUser } from '../Actions/UserActions';
import toast from 'react-hot-toast';
import SearchUser from './SearchUser';

const Slidebar = () => {
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [allUser, setAllUser] = useState([])
  const [openSearchUser, setOpenSearchUser] = useState(false)

  const handleLogout = async () => {
    const res = await logoutUser();
    console.log(res);
    if (res.success) {
      toast.success(res.message)
      dispatch(logout());
      localStorage.removeItem("token")
      navigate('/email')
    }
  }

  const handleCloseSearchUser = () => {
    setOpenSearchUser(false);
  }

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
      <div className='bg-slate-700 w-12 h-full rounded-tr-md rounded-br-md py-5 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50 ${isActive && "bg-slate-800"}`} title='chat'>
            <TbMessageFilled size={25} />
          </NavLink>
          <div title='add friend' onClick={() => setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50'>
            <FaUserPlus size={25} className='-mr-2' />
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <button className='mx-auto' title={user.name} onClick={() => setEditUserOpen(true)}>
            <Avatar imageUrl={user.profile_pic} name={user.name} width={40} height={40} key={user.profile_pic} userId={user._id} />
          </button>
          <button title='logout' onClick={handleLogout} className='w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50'>
            <BiLogOut size={25} className='-ml-2' />
          </button>
        </div>
      </div>

      <div className='w-full shadow-sm'>
        <div className='h-[4.25rem] flex items-center shadow-lg border border-slate-100 bg-white justify-center z-0'>
          <h2 className='text-xl font-bold text-slate-800'>Messages</h2>
        </div>
        <div className='h-[calc(100vh-68px)] overflow-x-hidden overflow-y-auto scrollbar bg-slate-'>
          {
            allUser.length === 0 && (
              <div>
                <div className='flex justify-center items-center my-5 text-slate-800'>
                  <TbMessageFilled size={50} />
                </div>
                <p className='text-lg text-center text-slate-800'>Explore users to start a conversation with.</p>
              </div>
            )
          }
        </div>
      </div>
      {
        editUserOpen && (
          <EditUserDetails onclose={() => setEditUserOpen(false)} user={user} />
        )
      }
      {
        openSearchUser && (
          <SearchUser onclose={handleCloseSearchUser} />
        )
      }
    </div>
  )
}

export default Slidebar