import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RiDeleteBin6Line } from "react-icons/ri"

function Lists() {
  let [list, setList] = useState([])
  let { serverUrl } = useContext(authDataContext)

  const fetchList = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/product/list")
      setList(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const removeList = async (id) => {
    try {
      let result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true })

      if (result.data) {
        fetchList()
      } else {
        console.log("Failed to remove Product")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white'>
      <Nav />
      <Sidebar />

      <div className='sm:ml-[64px] md:ml-[170px] lg:ml-[220px] pt-24 pb-20 px-4 sm:px-8 lg:px-10 flex flex-col items-center'>

        <div className='w-full max-w-4xl flex flex-col items-center text-center gap-1 mb-8'>
          <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Inventory</span>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-100'>All Listed Products</h1>
        </div>

        {list?.length > 0 ? (
          <div className='flex flex-col gap-4 w-full max-w-4xl'>
            {list.map((item, index) => (
              <div
                key={index}
                className='group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 sm:p-5 flex items-center gap-4 sm:gap-6 transition-all duration-300 hover:border-teal-300/30'
              >
                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-50 group-hover:opacity-90 transition-opacity' />

                <img src={item.image1} alt={item.name} className='w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 shrink-0' />

                <div className='flex flex-col gap-1 flex-1 min-w-0'>
                  <p className='text-sm sm:text-lg text-slate-100 font-medium truncate'>{item.name}</p>
                  <p className='text-xs sm:text-sm text-teal-200/80'>{item.category}</p>
                  <p className='text-xs sm:text-sm text-slate-300'>₹{item.price}</p>
                </div>

                <button
                  onClick={() => removeList(item._id)}
                  aria-label='Remove product'
                  className='w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors'
                >
                  <RiDeleteBin6Line className='w-5 h-5' />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-24 text-center'>
            <p className='text-lg text-slate-200 font-medium'>No products available</p>
            <p className='text-sm text-slate-400'>Add your first product to see it here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Lists
