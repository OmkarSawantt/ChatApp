import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { MdModeEdit } from "react-icons/md";
import { FaCheck } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { IoPersonAdd } from "react-icons/io5";
import moment from 'moment'
import { searchUserAction } from '../Actions/UserActions';
import toast from 'react-hot-toast';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import Loading from './Loading';
import { IoClose } from "react-icons/io5";
import { addMemberHandle, editName, editProfilePic, leftGroup, remove } from '../Actions/GroupActions';
import { useSelector } from 'react-redux';

const GroupDetail = ({ groupData, groupId }) => {
  const user=useSelector(state=>state?.user)
  const [isAdmin, setIsAdmin] = useState(user._id===groupData.createdBy._id)
  const [editGroup, setEditGroup] = useState(false)
  const [avatar, setAvatar] = useState(groupData.profile_pic)
  const [updateName, setUpdateName] = useState(groupData.name)
  const [userActivity, setUserActivity] = useState([]);
  const [updateGroupMembers, setUpdateGroupMembers] = useState(groupData.members)
  const [addMember, setAddMember] = useState(false)
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState([]);

const navigate = useNavigate()
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


  const handleRemoveMember = (userID) => {
    if(userID===groupData.createdBy._id){
      toast.error("You Can't Remove Yourself")
    }else{
      const updatedMembers = updateGroupMembers.filter((user) => user._id !== userID);
      setUpdateGroupMembers(updatedMembers);
      setUserActivity((prev) => [
        ...prev,
        { action: "remove", userID },
      ]);
    }
  };
  const submitUpdate = async() => {
    let editSuccess
    try {
      if(avatar!==groupData.profile_pic){
        const imageData = new FormData();
        imageData.append('profile_pic', avatar);
        const res=await editProfilePic(groupId,imageData)
        if(res.success){
          editSuccess=true
        }else{
          editSuccess=false
          toast.error(res.message)
          return
        }
      }
      if(updateName!==groupData.name){
        const res=await editName(groupId,{'name':updateName})
        if(res.success){
          editSuccess=true
          console.log(editSuccess);

        }else{
          editSuccess=false
          toast.error(res.message)
          return
        }
      }
      if(userActivity.length!==0){
        for (let index = 0; index < userActivity.length; index++) {
          console.log("Action",userActivity[index].action);
          if(userActivity[index].action==='add'){
            const res=await addMemberHandle(groupId,{'member':userActivity[index].userID})
            if(res.success){
              editSuccess=true
            }else{
              editSuccess=false
              toast.error(res.message)
              return
            }
          }else if(userActivity[index].action==='remove'){
            const res=await remove(groupId,{'member':userActivity[index].userID})
            if(res.success){
              editSuccess=true
            }else{
              editSuccess=false
              toast.error(res.message)
              return
            }
          }
        }
      }

      if(editSuccess===true){
        toast.success("Group data is updated successfully")
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const cancelEdit =()=>{
    try {
      setUpdateGroupMembers(groupData.members)
      setAvatar(groupData.profile_pic)
      setUpdateName(groupData.name)
      setUserActivity({})
      setEditGroup(false)
    } catch (error) {
      console.log(error);
    }
  }
  const handleChange = (e) => {
    setUpdateName(e.target.value)
  }
  const addMemberHandler=async (user)=>{
    try {
      const isMemberAlreadyAdded = updateGroupMembers.some(member => member._id === user._id);
      if (isMemberAlreadyAdded) {
        toast.error("User is already a member of the group.");
        return;
      }
      setUpdateGroupMembers(prevMembers => [
        ...prevMembers,
        user
      ]);
      setUserActivity((prev) => [
        ...prev,
        { action: "add", userID:user._id },
      ]);

      setAddMember(false);
    } catch (error) {
      toast.error(error);
    }
  }
  const exitGroup=async()=>{
    try {
      const res=await leftGroup(groupId);
      if(res.success){
        navigate('/group')
        toast.success(res.message)
      }
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <div className='fixed top-[4.5rem] max-h-full overflow-y-auto right-0 bg-white p-4 py-6 m-1 rounded h-fit w-full max-w-xl flex flex-col items-center gap-2'>
      {
        !editGroup ?
          <div className='w-full flex flex-col items-center gap-2'>
            {
              isAdmin && (
                <button className='cursor-pointer w-10 h-10 self-end rounded-full bg-secondary flex justify-center items-center' onClick={() => setEditGroup(true)}>
                  <MdModeEdit className='text-2xl text-white' />
                </button>
              )
            }
            <Avatar imageUrl={groupData.profile_pic} height={180} width={180}></Avatar>
            <h3 className='text-xl font-semibold '>{groupData.name}</h3>
            <h4 className='text-base self-start' >Members:</h4>
            <div className='flex flex-row mx-4 flex-wrap justify-left self-start'>
              {
                groupData.members.map((user,index) => (
                  <div key={index} className='w-fit p-1'>
                    <div className="flex flex-col gap-2 w-full  text-[10px] sm:text-xs z-50">
                      <Link to={`/home/${user._id}`} className="cursor-pointer flex items-center justify-between w-full h-8 sm:h-10 rounded-lg border border-secondary bg-secondary/5 pl-2 p-2">
                        <div className="flex gap-2">
                          <div>
                            <p className="text-slate-950 font-bold">{user.name}</p>
                            <p className="text-slate-700">{user.email}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>
            <h4 className='text-base self-start'>Created By:</h4>
            <div className='w-fit p-1 self-start'>
              <div className="flex flex-col gap-2 w-full mx-4  text-[10px] sm:text-xs z-50">
                <Link to={`/home/${groupData.createdBy._id}`} className="cursor-pointer flex items-center justify-between w-full h-8 sm:h-10 rounded-lg border border-secondary bg-secondary/5 pl-2 p-2">
                  <div className="flex gap-2">
                    <div>
                      <p className="text-slate-950 font-bold">{groupData.createdBy.name}</p>
                      <p className="text-slate-700">{groupData.createdBy.email}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <h4 className='text-base self-start'>Created At: <span className='font-bold'>{moment(groupData.createdAt).format('MMMM YYYY')}</span></h4>
            {
              !isAdmin && (
                <button className="cursor-pointer transition-al w-36 bg-primary text-white  px-6 py-2 text-xl font-semibold rounded-lg border-blue-400 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-blue-300 shadow-blue-300 active:shadow-none" onClick={()=>exitGroup()}>Exit Group</button>
              )
            }
          </div>
          :
          <div className='w-full flex flex-col items-center gap-2'>
            <div className="w-48 h-48 aspect-square mx-auto relative">
              <div className="h-full w-full rounded-full border-solid border-8 border-slate-200 overflow-hidden">
                <img src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)} alt="" className='block object-cover w-full' />
              </div>
              {/* Update */}
              <div className="avatar__form  h-4">
                <input type="file" name="avatar" id="avatar" className='invisible' onChange={e => setAvatar(e.target.files[0])} accept='png,jpg,jpeg' />
                <label htmlFor='avatar' className='bg-secondary cursor-pointer text-white text-2xl absolute right-4 bottom-3 w-12 h-12 grid place-items-center rounded-full' ><MdModeEdit /></label>
              </div>
            </div>
            <div className='self-start w-full'>
              <h4 className='text-base self-start'>Name:</h4>
              <input type="text" placeholder='Enter Group Name' value={updateName} onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary w-full' />
            </div>
            <div className='self-start w-full'>
              <h4 className='text-base self-start'>Members:</h4>
              <div className='flex flex-row  flex-wrap justify-left'>
                {
                  updateGroupMembers.map((user,index) => (
                    <div key={index} className='w-fit p-1'>
                      <div className="flex flex-col gap-2 w-full  text-[10px] sm:text-xs z-50">
                        <div className="succsess-alert cursor-default flex items-center justify-between w-full h-8 sm:h-10 rounded-lg border border-secondary bg-secondary/5 px-[10px]">
                          <div className="flex gap-2">
                            <div>
                              <p className="text-slate-950 font-bold">{user.name}</p>
                              <p className="text-slate-700">{user.email}</p>
                            </div>
                          </div>
                          <button className="text-slate-700 hover:bg-secondary p-1 rounded-md transition-colors ease-linear" onClick={()=>handleRemoveMember(user._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" >
                              <path strokeLinecap="round"   strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <button onClick={() => { setAddMember(true) }} className="flex flex-col gap-2 w-1/3  p-1 text-[10px] sm:text-xs z-0">
                  <div className="succsess-alert cursor-default flex items-center justify-between w-full h-8 sm:h-10 rounded-lg bg-primary hover:bg-secondary px-[10px]">
                    <div className="flex gap-2">
                      <div>
                        <p className="text-slate-950 font-bold">Add User</p>
                      </div>
                    </div>
                    <div className="text-slate-700  p-1 rounded-md transition-colors ease-linear">
                      <IoPersonAdd className='w-6 h-6' />
                    </div>
                  </div>
                </button>
              </div>

            </div>
            <div className='w-full h-10 flex flex-row justify-center items-center gap-8 my-4 '>
              <button className="cursor-pointer transition-al w-36 bg-primary text-white  px-6 py-2 text-xl font-semibold rounded-lg border-blue-400 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-blue-300 shadow-blue-300 active:shadow-none" onClick={()=>cancelEdit()}>Cancel</button>
              <button className="cursor-pointer transition-al w-36 bg-secondary text-white px-6 py-2 text-xl font-semibold rounded-lg border-blue-400 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-blue-300 shadow-blue-300 active:shadow-none" onClick={()=>submitUpdate()}>Done</button>

            </div>

          </div>
      }
            {
        addMember && (
          <div className='fixed top-0 bottom-0 left-0 right-0 p-2 bg-gray-700 bg-opacity-80 z-0'>
            <div className='w-full max-w-lg mx-auto mt-20 sm:mt-10 '>
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
                  searchUser.map((user, index) => (
                    <div key={index}>
                      <button className='flex w-full items-center gap-2 lg:p-2 border-[2px] border-transparent border-b-slate-200 hover:bg-slate-200 rounded-sm z-10' onClick={() => addMemberHandler(user)}>
                        <div>
                          <Avatar width={50} height={50} imageUrl={user?.profile_pic} userId={user._id} />
                        </div>
                        <div>
                          <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
                          <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
                        </div>
                      </button>
                    </div>
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

export default GroupDetail