import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { email } from '../Actions/UserActions'
import toast from 'react-hot-toast'
import { LuUserCircle } from "react-icons/lu";
const CheckEmail = () => {
  const [data,setData]=useState({
    email:'',
  })
  const navigate=useNavigate()
  const handleChange=(e)=>{
    const {name,value}=e.target
    setData((preve)=>{
      return{
        ...preve,
        [name]:value
      }
    })
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    e.stopPropagation()
    email(data).then((res) => {
      if(res.error){
        toast.error(res.message)
      }else{
        toast.success(res.message)
        setData({
          email:'',
        })
        navigate('/password',{
          state:res?.data
        })
      }

    }).catch((err) => {
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    });

  }
  return (
    <div className='mt-5'>
    <div className='bg-white w-full max-w-sm  rounded overflow-hidden shadow-lg p-4 mx-auto'>
      <div className='w-fit mx-auto mb-2'>
        <LuUserCircle size={80}/>
      </div>
      <h3 className='text-xl text-primary font-bold mb-2'>Welcome to Chat App !</h3>
      <form onSubmit={handleSubmit} className='grid gap-4'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='email'>Email : </label>
          <input type="email" name="email" id="email" placeholder='Enter Email' value={data.email} onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
        </div>
        <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white font-bold leading-relaxed tracking-wide'>
          Let,s Go
        </button>
      </form>
      <p className='my-2 text-center'>Don't Have Account? <Link to={'/register'} className='text-secondary hover:text-primary hover:underline font-semibold'>Register</Link></p>
    </div>
  </div>
  )
}

export default CheckEmail