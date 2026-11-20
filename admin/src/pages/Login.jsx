import React, { useContext, useState } from 'react'
import logo from '../assets/logo.jpg'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import axios from 'axios'
import { authDataContext } from '../context/AuthContext';
import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let { serverUrl } = useContext(authDataContext)
  let { adminData, getAdmin } = useContext(adminDataContext)
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const AdminLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const result = await axios.post(serverUrl + '/api/auth/adminlogin', { email, password }, { withCredentials: true })
      console.log(result.data)
      toast.success("AdminLogin Successfully")
      getAdmin()
      navigate("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("AdminLogin Failed")
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white flex flex-col items-center'>

      <div className='w-full h-[80px] flex items-center px-4 sm:px-8 gap-3'>
        <img className='w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-teal-300/40' src={logo} alt="OneCart" />
        <h1 className='text-xl sm:text-2xl font-bold tracking-wide'>OneCart <span className='text-teal-300 font-normal'>Admin</span></h1>
      </div>

      <div className='flex-1 w-full flex items-center justify-center px-4 py-10'>
        <div className='relative w-full max-w-[440px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-10 shadow-2xl'>
          <div className='absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-80' />

          <span className='block text-center text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70 mb-2'>Admin Access</span>
          <h2 className='text-2xl sm:text-3xl font-bold text-center mb-2'>Welcome back</h2>
          <p className='text-sm text-slate-400 text-center mb-8'>Sign in to manage OneCart</p>

          <form onSubmit={AdminLogin} className='flex flex-col gap-4'>
            <input
              type="text"
              className='w-full h-12 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 px-4 text-sm sm:text-base outline-none focus:border-teal-300/50 transition-colors'
              placeholder='Email'
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <div className='relative w-full'>
              <input
                type={show ? "text" : "password"}
                className='w-full h-12 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 px-4 pr-12 text-sm sm:text-base outline-none focus:border-teal-300/50 transition-colors'
                placeholder='Password'
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {show ? (
                <IoEye className='w-5 h-5 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-300 transition-colors' onClick={() => setShow(prev => !prev)} />
              ) : (
                <IoEyeOutline className='w-5 h-5 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-300 transition-colors' onClick={() => setShow(prev => !prev)} />
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full h-12 mt-2 rounded-full border border-teal-400/40 text-teal-100 font-semibold tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 disabled:opacity-60'
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
