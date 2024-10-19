import React from 'react'
import logo from '../Assets/logo1.svg'
const AuthLayout = ({children}) => {
  return (
    <>
      <header className='flex justify-center items-center py-3 h-20 shadow-lg bg-white'>
        <img src={logo} alt='logo' width={210} height={70}/>
      </header>
      {children}
    </>
  )
}

export default AuthLayout