import React, { useEffect, useState } from 'react'
import {Link } from 'react-router-dom'
import logo from '../Assets/logo1.svg'
import { MdOutlineAccessTime ,MdOutlineImage ,MdLockPerson ,MdDevicesOther  } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import Spline from '@splinetool/react-spline';

const Landing = () => {

  const [loggedIn,setLoggedIn]=useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  },[])
  return (
    <div>
      <header className='h-[4.5rem] bg-white shadow-2xl fixed top-0 w-full flex items-center justify-between z-50'>
        <img src={logo} className='w-36 lg:w-48 ml-2 lg:ml-8 ' alt="logo" />
          {
            loggedIn ?(
              <div className='flex mx-4 lg:mx-8 gap-4 h-3/4 items-center'>
                <div>
                <Link to={'/home'}  className=" cursor-pointer transition-all text-sm lg:text-base bg-blue-500 text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] ">Get Started</Link>
                </div>
              </div>
            ):(
              <div className='flex mx-4 lg:mx-8 gap-4 h-3/4 items-center'>
                <div>
                  <Link to={'/register'} className="cursor-pointer text-sm lg:text-base transition-all bg-primary text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-secondary border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Sign Up</Link>
                </div>
                <div>
                  <Link to={'/email'} className="cursor-pointer transition-all text-sm lg:text-base bg-blue-500 text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Log In</Link>
                </div>
              </div>
            )
          }

      </header>
      <div>
        <div className="h-[calc(100vh-4.5rem)]     mt-[4.5rem]  shadow-2xl bg-no-repeat bg-center bg-cover border-b-2 border-slate-400 lg:mb-0" >
        <div className="absolute inset-0 h-full  -z-0">
          <Spline scene="https://prod.spline.design/6tP7-9KKlGKpx80Z/scene.splinecode"/>
        </div>
        <div className='h-full flex flex-col gap-4 justify-end items-center'>

        {/* <div className='flex flex-col w-full  mt-auto lg:pt-20 px-4 gap-4 lg:items-start items-center justify-center'>
          <h1 className='text-4xl text-center mx-auto z-10 font-extrabold  rounded underline font-roboto text-slate-400 shadow lg:text-5xl'>Connect Instantly</h1>
          <h1 className='text-4xl mx-auto font-extrabold z-10 rounded underline text-center text-slate-400 font-roboto lg:text-5xl'>Chat Effortlessly</h1>
        </div>
        <div className='mx-4 mt-4 -ml-1 text-xs  z-10  text-center px-4 text-slate-400 lg:text-left font-roboto w-full lg:w-1/2 lg:text-lg'>
          <p className='mx-2 z-10 text-center'>
            A simple and secure platform for real-time communication. Chat with friends or make new connections instantly!
          </p>
        </div> */}
        <div className='flex gap-4 p-8 mb-0 -mt-4 lg:mt-0 bg-white 100% w-full z-10 items-center justify-center '>
          <div>
            <Link to={'/home'} className="cursor-pointer text-sm lg:text-base transition-all bg-primary text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-secondary border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Chat Now</Link>
          </div>
          <div>
            <a href='https://github.com/OmkarSawantt/ChatApp' target="_blank" rel="noopener noreferrer" className="cursor-pointer transition-all text-sm lg:text-base bg-blue-500 text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Source Code</a>
          </div>
        </div>
        </div>

        </div>
        <div className='min-h-[calc(100vh-4.5rem)] bg-slate-200 border-b-2 z-10 border-slate-400'>
          <h1 className='px-8 py-5  text-2xl font-extrabold font-roboto z-50 lg:text-7xl'>Powerful Features</h1>
          <p className='px-8 pb-2 lg:pb-5 text-sm lg:text-xl text-slate-700 '>Explore the powerful features designed to enhance your chatting experience. From seamless messaging to personalized interactions, we've got everything covered to keep you connected.</p>
          <div className='flex flex-wrap w-full h-3/4 gap-4 lg:gap-8 items-start justify-evenly'>
            <div className='flex w-full h-1/2 mt-8 flex-wrap justify-evenly gap-4'>
              <div className='w-96 bg-white h-full rounded-sm shadow-xl mx-2 lg-mx-0'><div className='flex items-center justify-left mx-4 my-4'> <MdOutlineAccessTime className='text-5xl text-secondary'/> <p className='mx-4 text-xl lg:text-xl font-bold'>Real-Time Messaging</p></div> <p className='mx-4 my-4 text-base text-slate-700 text-center'>Experience seamless communication with real-time chat powered by Socket.io. Send messages instantly, no delays.</p></div>
              <div className='w-96 bg-white h-full rounded-sm shadow-xl mx-2 lg-mx-0'><div className='flex items-center justify-left mx-4 my-4'><MdOutlineImage className='text-5xl text-secondary'/><p className='mx-4 text-xl font-bold'>Photo & Image Sharing</p></div> <p className='mx-4 my-4 text-base text-slate-700 text-center'>Share photos and images effortlessly within your conversations. Capture moments and send them instantly to your friends.</p></div>
              <div className='w-96 bg-white h-full rounded-sm shadow-xl mx-2 lg-mx-0'><div className='flex items-center justify-left mx-4 my-4'><MdLockPerson  className='text-5xl text-secondary'/><p className='mx-4 text-xl font-bold'>Secure & Private</p></div>  <p className='mx-4 my-4 text-base text-slate-700 text-center'>Your messages and media are encrypted to ensure your privacy is always protected. Chat and share without worry.</p></div>
            </div>
            <div className='flex w-full flex-wrap h-1/2 mb-4 justify-evenly gap-4 '>
              <div className='w-96 bg-white h-full rounded-sm shadow-xl mx-2 lg-mx-0'><div className='flex items-center justify-left mx-4 my-4'><BsStars className='text-5xl text-secondary'/><p className='mx-4 text-xl font-bold'>User-Friendly Interface</p></div> <p className='mx-6 my-4 text-base text-slate-700 text-center'>Enjoy a clean, intuitive interface that makes chatting and  sharing photos easy and enjoyable.</p></div>
              <div className='w-96 bg-white h-full rounded-sm shadow-xl mx-2 lg-mx-0'><div className='flex items-center justify-left mx-4 my-4'><MdDevicesOther className='text-5xl text-secondary'/><p className='mx-4 text-xl font-bold'>Cross-Device Support</p></div> <p className='mx-4 my-4 text-base text-slate-700 text-center'>Stay connected on any device, whether you're using a desktop, tablet, or mobile. Your conversations go wherever you go.</p></div>
            </div>
          </div>
        </div>
      </div>
      <footer className='h-24  flex flex-col lg:flex-row justify-between  items-center bg-white shadow-md'>
        <div className=' border-b flex border-slate-500 lg:border-none items-center  justify-center'><img src={logo} className='w-36 lg:w-48 ml-2 lg:ml-8  ' alt="logo" /></div>
          <p className=' text-sm text-slate-400 '>@ 2024 Sonorous, Inc. All rights reserved.</p>
          <Link to={'/home'}  className=" cursor-pointer mr-0 lg:mr-8 transition-all text-sm lg:text-base bg-blue-500 text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Get Started</Link>
      </footer>
    </div>
  )
}

export default Landing