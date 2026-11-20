import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.jpg"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Nav() {
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let { getAdmin } = useContext(adminDataContext)

  const logOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      console.log(result.data)
      toast.success("LogOut Successfully")
      getAdmin()
      navigate("/login")
    } catch (error) {
      console.log(error)
      toast.error("LogOut Failed")
    }
  }

  return (
    <div className='w-full h-[70px] fixed top-0 z-20 flex items-center justify-between px-4 sm:px-8 border-b border-teal-400/10 bg-[#0e2429]/90 backdrop-blur-md shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)]'>
      <div
        className='flex items-center gap-3 cursor-pointer'
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="OneCart" className='w-9 h-9 rounded-full object-cover border-2 border-teal-300/40' />
        <h1 className='text-lg sm:text-xl font-bold text-slate-100 tracking-wide'>
          OneCart <span className='text-teal-300 font-normal'>Admin</span>
        </h1>
      </div>

      <button
        className='px-5 py-2.5 rounded-full border border-teal-400/40 text-teal-100 text-sm font-medium tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300'
        onClick={logOut}
      >
        Log Out
      </button>
    </div>
  )
}

export default Nav
