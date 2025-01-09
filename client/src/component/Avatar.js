import React from 'react'
import { useSelector } from 'react-redux'

const Avatar = ({userId,name,imageUrl,width,height}) => {
  const onlineUser=useSelector(state=>state?.user?.onlineUser)
  const isOnline=onlineUser.includes(userId)
  return (
    <div className={`text-slate-800  rounded-full font-bold relative border-2 bg-white border-slate-200`} style={{width : width+"px", height : height+"px" }}>
        {
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
        }
        {
          isOnline &&(
            <div className='bg-green-500  p-1 absolute bottom-0 rounded-full right-0'></div>
          )
        }
    </div>
  )
}

export default Avatar