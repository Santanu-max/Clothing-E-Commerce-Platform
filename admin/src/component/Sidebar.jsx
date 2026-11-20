import React from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { SiTicktick } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  let navigate = useNavigate()
  let location = useLocation()

  const links = [
    { path: '/add', label: 'Add Items', icon: IoIosAddCircleOutline },
    { path: '/lists', label: 'List Items', icon: FaRegListAlt },
    { path: '/orders', label: 'View Orders', icon: AiOutlineProduct },
    { path: '/delivered', label: 'Delivered', icon: SiTicktick },
    { path: '/cancelled', label: 'Cancelled', icon: MdOutlineCancel },
  ]

  return (
    <div className='hidden sm:flex flex-col fixed left-0 top-[70px] bottom-0 w-[64px] lg:w-[220px] md:w-[170px] border-r border-white/10 bg-white/[0.02] backdrop-blur-md py-8 px-2.5 lg:px-4 gap-2 z-10'>
      {links.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <div
            key={path}
            onClick={() => navigate(path)}
            className={`group relative flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${active
                ? 'bg-teal-400/10 border border-teal-300/30 text-teal-200'
                : 'border border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
          >
            {active && (
              <span className='absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-gradient-to-b from-teal-400 to-emerald-400' />
            )}
            <Icon className='w-5 h-5 shrink-0' />
            <p className='hidden lg:block text-sm font-medium'>{label}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar
