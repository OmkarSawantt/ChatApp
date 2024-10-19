import React from 'react'
import Avatar from './Avatar'
import moment from 'moment'
const UserDetail = ({userId,userName,userEmail,userPic,createdAt}) => {
  return (
    <div className='fixed top-[4.5rem] right-0 bg-white p-4 py-6 m-1 rounded h-fit w-full max-w-sm flex flex-col items-center gap-2'>
      <Avatar userId={userId} name={userName} imageUrl={userPic} height={80} width={80}></Avatar>
      <h3 className='text-xl font-semibold '>{userName}</h3>
      <h4 className='text-lg'>{userEmail}</h4>
      <h5 className='text-xs'>User from : <span className='font-bold'>{moment(createdAt).format('MMMM YYYY')}</span></h5>
    </div>
  )
}

export default UserDetail