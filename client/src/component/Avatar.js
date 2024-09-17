import React from 'react'

const Avatar = ({userId,name,imageUrl,width,height}) => {
  return (
    <div className={`text-slate-800  rounded-full font-bold relative border-2 border-slate-200`} style={{width : width+"px", height : height+"px" }}>
        {
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
        }

    </div>
  )
}

export default Avatar