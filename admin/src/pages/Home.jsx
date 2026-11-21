import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import axios from 'axios'
import { HiOutlineCube, HiOutlineClipboardDocumentList } from "react-icons/hi2"

function Home() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  const { serverUrl } = useContext(authDataContext)

  const fetchCounts = async () => {
    try {
      const products = await axios.get(`${serverUrl}/api/product/list`, { withCredentials: true })
      setTotalProducts(products.data.length)

      const orders = await axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true })
      setTotalOrders(orders.data.length)
    } catch (err) {
      console.error("Failed to fetch counts", err)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: HiOutlineCube, hint: 'Live in your catalog' },
    { label: 'Total Orders', value: totalOrders, icon: HiOutlineClipboardDocumentList, hint: 'Placed by customers' },
  ]

  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white'>
      <Nav />
      <Sidebar />

      <div className='sm:ml-[64px] md:ml-[170px] lg:ml-[220px] pt-24 pb-16 px-4 sm:px-8 lg:px-10 flex flex-col items-center'>
        <div className='w-full max-w-4xl flex flex-col items-center'>

          <div className='flex flex-col items-center text-center gap-2 mb-10'>
            <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Dashboard</span>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-100'>OneCart Admin Panel</h1>
            <p className='text-sm text-slate-400 max-w-md'>A quick snapshot of your store, updated in real time.</p>
          </div>

          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {stats.map(({ label, value, icon: Icon, hint }, i) => (
              <div
                key={i}
                className='group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between gap-6 min-h-[190px] transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:shadow-[0_10px_30px_-12px_rgba(45,212,191,0.4)]'
              >
                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity' />

                <div className='flex items-center justify-between'>
                  <div className='w-11 h-11 rounded-xl bg-teal-400/10 border border-teal-300/30 flex items-center justify-center text-teal-300'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <span className='text-[11px] uppercase tracking-wider text-slate-500'>{hint}</span>
                </div>

                <div className='flex items-end justify-between'>
                  <p className='text-sm text-slate-400'>{label}</p>
                  <p className='text-4xl font-bold text-slate-100 leading-none'>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
