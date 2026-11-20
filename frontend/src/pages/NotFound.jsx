import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  let navigate = useNavigate()
  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] flex items-center justify-center flex-col gap-6 px-4 text-center'>
      <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Lost in the Aisles</span>
      <h1 className='text-5xl sm:text-7xl font-bold text-white'>404</h1>
      <p className='text-base sm:text-xl text-slate-300'>We couldn't find the page you were looking for.</p>
      <button
        className='mt-2 px-8 py-3 rounded-full border border-teal-400/40 text-teal-100 text-sm sm:text-base font-medium tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300'
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
    </div>
  )
}

export default NotFound
