import React, { useEffect, useState } from 'react';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import { searchUserAction } from '../Actions/UserActions';
import { IoClose } from "react-icons/io5";
const SearchUser = ({ onclose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const handleSearchUser = async () => {
      try {
        setLoading(true);
        const res = await searchUserAction({ search: searchInput });
        setSearchUser(res.data);
        setLoading(false);
      } catch (error) {
        toast.error(error);
      }
    };
    handleSearchUser();
  }, [searchInput]);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-50 z-10'>
      <div className='w-full max-w-lg mx-auto mt-10'>
        <div className='bg-white rounded h-14 overflow-hidden flex'>
          <input
            type="text"
            placeholder='Search user by name, email...'
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            className='w-full outline-none py-1 h-full px-4'
          />
          <div className='h-14 flex pr-4 justify-center items-center'>
            <HiMiniMagnifyingGlass size={25} />
          </div>
        </div>
        <div className='bg-white mt-2 w-full p-4 overflow-auto'>
          {searchUser.length === 0 && !loading && (
            <p className='text-center text-slate-700'>No User Found!</p>
          )}
          {loading && (
            <span className='flex justify-center'><Loading /></span>
          )}
          {searchUser.length !== 0 && !loading && (
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onclose={onclose} />
            ))
          )}
        </div>
      </div>
      <div className='absolute top-0 right-0 text-slate-800 hover:text-primary my-8 mx-16' >
        <button onClick={onclose}>
          <IoClose size={30}/>
        </button>
      </div>
    </div>
  );
};

export default SearchUser;