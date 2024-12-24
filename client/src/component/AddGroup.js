import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";

const AddGroup = ({ onclose }) => {
  const [groupMembers,setGroupMembers]=useState(2)
  const [groupName,setGroupName]=useState('')
  const handleChange=(e)=>{
    setGroupName(e.target.value)
  }


  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-50 z-10'>
      <div className='w-full max-w-2xl mx-auto mt-10 p-4 bg-white rounded-sm'>
        <h1 className='text-xl ml-2 font-bold text-slate-800 text-center'>New Group Chat</h1>
        <h3 className='text-base ml-2 text-center text-slate-500'>{groupMembers} / 10 Members</h3>
        <div className='flex flex-col gap-1 mx-8'>
          <label htmlFor='grpName'>Group Name : </label>
          <input type="text" name="grpName" id="grpName" placeholder='Enter Group Name '  onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
        </div>

      </div>
      <div className='absolute top-0 right-0 text-slate-800 hover:text-primary my-4 mx-4 lg:my-8 lg:mx-16' >
        <button onClick={onclose}>
          <IoClose size={30}/>
        </button>
      </div>
    </div>
  )
}

export default AddGroup