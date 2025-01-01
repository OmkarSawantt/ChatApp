import React, { useState,useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import Loading from './Loading';
import toast from 'react-hot-toast';
import { searchUserAction } from '../Actions/UserActions';
import { IoPersonAdd } from "react-icons/io5";
import Avatar from './Avatar';
import {createGroup} from '../Actions/GroupActions'
const AddGroup = ({ onclose }) => {
  const user = useSelector(state => state?.user)

  const [groupMembersCount,setGroupMembersCount]=useState(1)
  const [groupMembers,setGroupMembers]=useState([{userID:user._id,userName:user.name,userEmail:user.email}])
  const [groupName,setGroupName]=useState('')
  const [addMember,setAddMember]=useState(false)

  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const handleChange=(e)=>{
    setGroupName(e.target.value)
  }

  const handleRemoveMember = (userID) => {
    if(userID===user._id){
      toast.error("You Can't Remove Yourself")
    }else{
      const updatedMembers = groupMembers.filter(member => member.userID !== userID);
      setGroupMembers(updatedMembers);
      setGroupMembersCount(updatedMembers.length);
      toast.success(`User has been removed.`);
    }
  };
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

  const addMemberHandler=async (userID,userName,userEmail)=>{
    try {
      setAddMember(false)
      const isMemberAlreadyAdded = groupMembers.some(member => member.userID === userID);
      if (isMemberAlreadyAdded) {
        toast.error("User is already a member of the group.");
        return;
      }
      setGroupMembers(prevMembers => [
        ...prevMembers,
        { userID, userName, userEmail }
      ]);
      setGroupMembersCount(prevCount => prevCount + 1);
      setAddMember(false);
      toast.success(`${userName} has been added to the group.`);
    } catch (error) {
      toast.error(error);
    }
  }
  const handleSubmit=async()=>{
    try {
      const idsArray = groupMembers.map((member) => member.userID);
      const res=await createGroup({name:groupName,members:idsArray})
      if(res.success){
        toast.success(res.message)
        onclose()
      }else{
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-80 z-10'>
      <div className='w-full max-w-2xl mx-0 sm:mx-auto mt-20  sm:mt-10 p-4 bg-white rounded-sm'>
        <h1 className='text-xl ml-0 sm:ml-2 font-bold text-slate-800 text-center'>New Group Chat</h1>
        <h3 className='text-base ml-0 sm:ml-2 text-center text-slate-500'>{groupMembersCount} / 10 Members</h3>
        <div className='flex flex-col gap-1 mx-0 sm:mx-8'>
          <label htmlFor='grpName'>Group Name : </label>
          <input type="text" name="grpName" id="grpName" placeholder='Enter Group Name '  onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
        </div>
          <label htmlFor='grpMembers' className='mx-0 sm:mx-8'>Group Members : </label>
        <div className='flex flex-row mx-0 sm:mx-8 flex-wrap justify-left'>
          {
            groupMembers.map((user) => (
              <div key={user.userID} className='w-fit p-1'>
                <div className="flex flex-col gap-2 w-full  text-[10px] sm:text-xs z-50">
                  <div className="succsess-alert cursor-default flex items-center justify-between w-full h-8 sm:h-10 rounded-lg border border-secondary bg-secondary/5 px-[10px]">
                    <div className="flex gap-2">
                      <div>
                        <p className="text-slate-950 font-bold">{user.userName}</p>
                        <p className="text-slate-700">{user.userEmail}</p>
                      </div>
                    </div>
                    <button className="text-slate-700 hover:bg-secondary p-1 rounded-md transition-colors ease-linear" onClick={() => handleRemoveMember(user.userID)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
              <button onClick={()=>{setAddMember(true)}} className="flex flex-col gap-2 w-1/3  p-1 text-[10px] sm:text-xs z-0">
                  <div className="succsess-alert cursor-default flex items-center justify-between w-full h-8 sm:h-10 rounded-lg bg-primary hover:bg-secondary px-[10px]">
                    <div className="flex gap-2">
                      <div>
                        <p className="text-slate-950 font-bold">Add User</p>
                      </div>
                    </div>
                    <div className="text-slate-700  p-1 rounded-md transition-colors ease-linear">
                      <IoPersonAdd className='w-6 h-6'/>
                    </div>
                  </div>
                </button>
        </div>
        <div className='w-full flex justify-center my-8'>
          <button onClick={()=>handleSubmit()} className="group/button relative inline-flex mx-auto items-center justify-center overflow-hidden rounded-md bg-secondary backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
            <span className="text-lg">Create Group</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]" >
              <div className="relative h-full w-10 bg-white/20"></div>
            </div>
          </button>
        </div>
      </div>
      <div className='absolute top-0 right-0 text-white my-8 mx-4 lg:my-8 lg:mx-16' >
        <button onClick={onclose}>
          <IoClose size={30}/>
        </button>
      </div>
      {
        addMember && (
          <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-80 z-0'>
            <div className='w-full max-w-lg mx-auto mt-20 sm:mt-10'>
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
                  searchUser.map((user,index) => (
                    <button className='flex w-full items-center gap-2 lg:p-2 border-[2px] border-transparent border-b-slate-200 hover:bg-slate-200 rounded-sm z-10' key={index} onClick={() => addMemberHandler(user._id, user?.name, user?.email)}>
                      <div>
                        <Avatar width={50} height={50} imageUrl={user?.profile_pic} userId={user._id} />
                      </div>
                      <div>
                        <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
                        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className='absolute top-0 right-0 text-white  my-8 mx-4 lg:my-8 lg:mx-16' >
              <button onClick={()=>{setAddMember(false)}}>
                <IoClose size={30} />
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default AddGroup