import React, { useState } from 'react'
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';

const SearchUser = () => {
  const [searchUser,setSearchUser]=useState([])
  const [loading,setLoading]=useState(true)

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-50'>
      <div className='w-full max-w-lg mx-auto mt-10'>
        <div className='bg-white rounded h-14 overflow-hidden flex'>
          <input type="text" placeholder='Search user by name ,email.....' className='w-full outline-none py-1 h-full px-4'/>
          <div className='h-14 flex pr-4 justify-center items-center'>
          <HiMiniMagnifyingGlass size={25}/>
          </div>
        </div>
        <div className='bg-white mt-2 w-full p-4'>
          {
            searchUser.length===0 && !loading && (
              <p className='text-center text-slate-700'>No User Found!</p>
            )
          }
          {
            loading && (
              <span className='flex justify-center'><Loading/></span>
            )
          }
          {
            searchUser.length!==0 && !loading &&(
              searchUser.map((user,index)=>{
                return(
                  <UserSearchCard key={user._id} user={user}/>
                )
              })
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchUser