import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../Actions/UserActions'

const Register = () => {
  const [data,setData]=useState({
    name:'',
    email:'',
    password:'',
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
    registerUser(data).then((res) => {
      alert("User is Created")
      navigate('/')
    }).catch((err) => {
      alert("Something went wrong")
    });

  }
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
        <h3 className='text-center text-2xl text-primary font-bold'>Welcome to Chat App !</h3>

        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name : </label>
            <input type="text" name="name" id="name" placeholder='Enter Name' value={data.name} onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email : </label>
            <input type="email" name="email" id="email" placeholder='Enter Email' value={data.email} onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password : </label>
            <input type="password" name="password" id="password" placeholder='Enter Password' value={data.password} onChange={handleChange} required className='bg-slate-100 px-2 py-1 focus:outline-primary '/>
          </div>
          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white font-bold leading-relaxed tracking-wide'>
            Register
          </button>
        </form>
        <p className='my-2 text-center'>Already Have Account? <Link to={'/email'} className='text-secondary hover:text-primary hover:underline font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register