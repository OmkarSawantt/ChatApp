import React, { useState, useEffect } from 'react'
import {useLocation, useNavigate } from 'react-router-dom'
import { passwordCheak } from '../Actions/UserActions'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setToken} from '../redux/userSlice'

const CheckPassword = () => {
  const [data, setData] = useState({
    userID: '',
    password: '',
  })
  const [userAvatar, setUserAvatar] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch=useDispatch()
  useEffect(() => {
    if (location.state) {
      setUserAvatar(location.state.profile_pic)
      setData(prevData => ({
        ...prevData,
        userID: location.state._id
      }))
    }
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    passwordCheak(data)
      .then(res => {
        if (res.error) {
          toast.error(res.message)
        } else {
          dispatch(setToken(res.token))
          localStorage.setItem('token',res.token)
          toast.success(res.message)
          setData({
            id: '',
            password: ''
          })
          navigate('/home')
        }
      })
      .catch(err => {
        const errorMessage = err.message || 'Something went wrong. Please try again.'
        toast.error(errorMessage)
      })
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden shadow-lg p-4 mx-auto'>
        <div className='w-fit mx-auto'>
          <img src={userAvatar} alt='User Avatar' className='border-4 border-slate-700 shadow-2xl w-[65px] h-[64px] rounded-full bg-slate-400 '/>
          <p className='text-center font-bold text-slate-700 '>{location.state.name}</p>
        </div>
        <h3 className='text-xl text-primary font-bold mb-2'>Welcome to Chat App!</h3>
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password:</label>
            <input type='password' name='password'id='password' placeholder='Enter Password' value={data.password} onChange={handleChange}required className='bg-slate-100 px-2 py-1 focus:outline-primary'/>
          </div>
          <button type='submit'className='bg-primary text-lg px-4 py-1  hover:bg-secondary rounded mt-2 text-white font-bold leading-relaxed tracking-wide'>
            Let's Go
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckPassword
