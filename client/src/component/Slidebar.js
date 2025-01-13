import React, { useContext, useEffect, useState } from 'react'
import { TbMessageFilled } from "react-icons/tb";
import { MdGroups, MdGroupAdd } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { logout } from '../redux/userSlice';
import { logoutUser } from '../Actions/UserActions';
import toast from 'react-hot-toast';
import SearchUser from './SearchUser';
import { SocketContext } from '../redux/SocketContext';
import { IoMdImage, IoMdVideocam } from "react-icons/io";
import AddGroup from './AddGroup';
import { decryptLargeMessage } from '../utils/cryptoUtils';
const Slidebar = () => {
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [allUser, setAllUser] = useState([])
  const [allGroups, setAllGroups] = useState([])
  const [openSearchUser, setOpenSearchUser] = useState(false)
  const [addGroupbox, setaddGroupbox] = useState(false)
  const socketConnection = useContext(SocketContext);
  const location = useLocation();
  const isHomePage = location.pathname.startsWith("/home");
  const isGroupPage = location.pathname.startsWith("/group");

  const [unseenMessages,setUnseenMEssages]=useState()
  const [unseenGroupMessages,setUnseenGroupMEssages]=useState()
  useEffect(() => {

    if (socketConnection && user && user._id) {
      socketConnection.emit('slidebar', user._id);
      const handleConversation = (data) => {
        const conversationUserData = data.map((conUser) => {

          if (conUser.sender._id === conUser.receiver?._id) {
            return {
              ...conUser,
              userDetails: conUser.sender,
            };
          } else if (conUser.sender._id !== user._id) {
            return {
              ...conUser,
              userDetails: conUser.sender,
            };
          } else {
            return {
              ...conUser,
              userDetails: conUser.receiver,
            };
          }
        });

        const userUnseenCount = conversationUserData.reduce((count, conv) => {
          if(conv?.unseenMsg!==0 && conv?.lastMsg?.sender.toString()!==user._id){
            toast(`You have a new message from ${conv.userDetails.name}`, {
              icon: 'ℹ️',
              duration: 2000,
              position: 'top-center',
            });
          }
          return count + (conv?.unseenMsg || 0);
        }, 0);
        setUnseenMEssages(userUnseenCount)
        setAllUser(conversationUserData);
      };
      const handelGroups = (data) => {
        const GroupData = data.map((group) => {
          return {
            ...group,
            lastMessage: group.lastMessage ?? {  text: "You were added " }
          };
        })
        const groupUnseenCount = GroupData.reduce((count, group) => {
          if(group?.unseenMessages!==0 && group?.lastMessage?.msgByUserID?._id!==user._id){
            toast(`New message in  ${group.name}`, {
              icon: 'ℹ️',
              duration: 2000,
              position: 'top-center',
            });
          }
          return count + (group?.unseenMessages || 0);
        }, 0);
        setUnseenGroupMEssages(groupUnseenCount)
        setAllGroups(GroupData);
      }
      // Attach the event listener
      socketConnection.on('conversation', handleConversation);
      socketConnection.on('groups', handelGroups)

      // Cleanup function to remove the event listener
      return () => {
        socketConnection.off('conversation', handleConversation);
        socketConnection.off('groups', handelGroups)
      };
    }
  }, [socketConnection, user]);

  const handleLogout = async () => {
    const res = await logoutUser();
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
        <NavLink to="/home" className={({ isActive }) => `w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50 ${isActive ? "bg-slate-800" : ""}`} title="Chat">
            <div className="relative h-full w-full flex justify-center items-center">
            <TbMessageFilled size={25} />
            {unseenMessages > 0 && (
              <span className="absolute  h-5 w-5 top-1 right-1 bg-secondary text-white text-xs  flex justify-center items-center  font-bold rounded-full px-2">
                {unseenMessages}
               </span>
            )}
          </div>
        </NavLink>

        <NavLink to="/group" className={({ isActive }) => `w-12 h-12 flex justify-center items-center hover:bg-slate-800 rounded-sm text-slate-50 ${isActive ? "bg-slate-800" : ""}`} title="Chat">
          <div className="relative h-full w-full flex justify-center items-center">
            <MdGroups size={25} />
            {unseenGroupMessages > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-xs font-bold rounded-full px-1">
              {unseenGroupMessages}
              </span>
            )}
          </div>
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
        <div className='h-[4.25rem] flex items-center shadow-lg border border-slate-100 bg-white justify-left z-0'>
          {
            isGroupPage ? <h2 className='text-xl ml-2 font-bold text-slate-800'>Groups</h2> : <h2 className='text-xl ml-2 font-bold text-slate-800'>Messages</h2>
          }
          {
            isGroupPage && (
              <button className='ml-auto' title={'CreateGroup'} onClick={() => setaddGroupbox(true)}>
                <MdGroupAdd className='text-2xl font-bold text-slate-800 mr-2' />
              </button>)
          }
        </div>
        <div className='h-[calc(100vh-68px)] overflow-x-hidden overflow-y-auto scrollbar bg-slate-'>
          {
            isHomePage ? (
              allUser.length === 0 && (
                <div>
                  <div className='flex justify-center items-center my-5 text-slate-800'>
                    <TbMessageFilled size={50} />
                  </div>
                  <p className='text-lg text-center text-slate-800'>Explore users to start a conversation with.</p>
                </div>
              )
            ) : (
              allGroups.length === 0 && (
                <div>
                  <div className='flex justify-center items-center my-5 text-slate-800'>
                    <MdGroups size={75} />
                  </div>
                  <p className='text-lg text-center text-slate-800'>Create Groups to start a conversation with.</p>
                </div>
              )
            )
          }
          {
            isHomePage ? (

              allUser.map((conv, index) => {
                return (
                  <NavLink to={'/home/' + conv?.userDetails?._id} key={index} className='flex items-center gap-2 px-2 py-3 border-b border border-b-slate-400 hover:border-primary hover:border hover:bg-slate-200 rounded cursor-pointer'>
                    <div>
                      <Avatar imageUrl={conv.userDetails.profile_pic} userId={conv?.userDetails?._id} name={conv.userDetails.name} width={50} height={50} />
                    </div>
                    <div>
                      <h3 className='text-ellipsis line-clamp-1 font-semibold'>{conv?.userDetails?.name}</h3>
                      <div className='text-slate-500 text-sm flex items-center gap-1 '>
                        <div>
                          {
                            conv?.lastMsg?.image && (
                              <div className='flex items-center gap-1'>
                                <span><IoMdImage /></span>
                                {!conv?.lastMsg?.messageText && <span>Image</span>}
                              </div>
                            )
                          }
                          {
                            conv?.lastMsg?.video && (
                              <div className='flex items-center gap-1'>
                                <span><IoMdVideocam /></span>
                                {!conv?.lastMsg?.messageText && <span>Video</span>}
                              </div>
                            )
                          }
                        </div>
                        {
                          conv?.lastMsg?.messageText!==''  && (
                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.sender===user._id ? decryptLargeMessage(user.private_key,conv?.lastMsg?.senderText):decryptLargeMessage(user.private_key,conv?.lastMsg?.messageText)}</p>
                          )
                        }
                      </div>
                    </div>
                    {
                      Boolean(conv?.unseenMsg) && (<p className='text-sm w-7 h-7 flex justify-center items-center ml-auto p-1 bg-secondary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>)
                    }
                  </NavLink>
                )
              })
            ) :
              (
                allGroups.map((group, index) => {
                  return (
                    <NavLink to={'/group/' + group._id} key={index} className='flex items-center gap-2 px-2 py-3 border-b border border-b-slate-400 hover:border-primary hover:border hover:bg-slate-200 rounded cursor-pointer'>
                      <div>
                        <Avatar imageUrl={group.profile_pic} width={50} height={50} />
                      </div>
                      <div>
                        <h3 className='text-ellipsis line-clamp-1 font-semibold'>{group.name}</h3>
                        <div className='text-slate-500 text-sm flex items-center gap-1 '>
                          <p>{group?.lastMessage?.msgByUserID?.name+':'}</p>
                          <div className='h-full flex items-center'>
                            {
                              group?.lastMessage?.image && (
                                <div className='flex items-center h-full gap-1'>
                                  <span className='-mb-1'><IoMdImage /></span>
                                  {!group?.lastMessage?.messageText && <span>Image</span>}
                                </div>
                              )
                            }
                            {
                              group?.lastMessage?.video && (
                                <div className='flex items-center gap-1'>
                                  <span className='-mb-1'><IoMdVideocam /></span>
                                  {!group?.lastMessage?.messageText && <span>Video</span>}
                                </div>
                              )
                            }
                          </div>
                          <p className='text-ellipsis line-clamp-1'>{decryptLargeMessage(group.private_key,group?.lastMessage?.messageText)}</p>
                        </div>
                      </div>
                      {
                      Boolean(group?.unseenMessages) && (<p className='text-sm w-7 h-7 flex justify-center items-center ml-auto p-1 bg-secondary text-white font-semibold rounded-full'>{group?.unseenMessages}</p>)
                    }
                    </NavLink>
                  )
                })
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
      {
        addGroupbox && (
          <AddGroup onclose={() => setaddGroupbox(false)} />
        )
      }
    </div>
  )
}

export default Slidebar