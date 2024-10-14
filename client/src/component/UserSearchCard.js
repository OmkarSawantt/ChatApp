import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onclose }) => {
  const handleClick = () => {
    if (onclose && typeof onclose === 'function') {
      onclose();
    }
  };

  return (
    <Link to={`/home/${user._id}`} onClick={handleClick} className='flex items-center gap-2 lg:p-2 border-[2px] border-transparent border-b-slate-200 hover:bg-slate-200 rounded-sm z-10'>
      <div>
        <Avatar width={50} height={50} imageUrl={user?.profile_pic} userId={user._id}/>
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;