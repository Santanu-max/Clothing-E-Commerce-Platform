import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { MdOutlineCancel } from "react-icons/md"

function CancelledOrders() {

  const [orders, setOrders] = useState([])

  const { serverUrl } = useContext(authDataContext)


  // =========================================================
  // FETCH ALL ORDERS
  // =========================================================

  const fetchAllOrders = async () => {

    try {

      const result = await axios.post(
        serverUrl + '/api/order/list',
        {},
        { withCredentials: true }
      )

      setOrders(result.data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchAllOrders()

  }, [])


  // =========================================================
  // FLATTEN: ONE ROW PER CANCELLED PRODUCT
  // =========================================================

  const cancelledItems = []

  orders.forEach((order) => {

    order.items.forEach((item, itemIndex) => {

      if (item.cancelled) {

        cancelledItems.push({
          ...item,
          itemIndex,
          orderId: order._id,
          orderDate: order.date,
          address: order.address,
          paymentMethod: order.paymentMethod,
          payment: order.payment,
          // current delivery position of the whole order
          currentStatus: order.status
        })

      }

    })

  })

  // newest cancellation first
  cancelledItems.sort((a, b) => b.cancelledAt - a.cancelledAt)


  // Delivery position shown to admin:
  // if the whole order is "Cancelled", show the position at the moment of cancel
  const getPosition = (item) =>
    item.currentStatus === 'Cancelled'
      ? item.statusAtCancel
      : item.currentStatus


  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white'>

      <Nav />

      <Sidebar />

      <div className='sm:ml-[64px] md:ml-[170px] lg:ml-[220px] pt-24 pb-20 px-4 sm:px-8 lg:px-10'>

        {/* PAGE TITLE */}

        <div className='flex flex-col gap-1 mb-8'>

          <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>
            Fulfilment
          </span>

          <h1 className='text-2xl sm:text-3xl font-bold text-slate-100'>
            Cancelled Orders
          </h1>

          <p className='text-sm text-slate-400'>
            Total cancelled products: {cancelledItems.length}
          </p>

        </div>


        {cancelledItems.length === 0 ? (

          <div className='flex flex-col items-center justify-center gap-2 py-24 text-center'>

            <p className='text-lg text-slate-200 font-medium'>
              No cancelled orders
            </p>

            <p className='text-sm text-slate-400'>
              Products cancelled by customers will show up here.
            </p>

          </div>

        ) : (

          <div className='flex flex-col gap-5 max-w-5xl'>

            {cancelledItems.map((item, index) => (

              <div
                key={`${item.orderId}-${item.itemIndex}-${index}`}
                className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start gap-5 overflow-hidden'
              >

                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-red-400 via-rose-300 to-red-400 rounded-full opacity-60' />

                {/* ICON / IMAGE */}

                {item.image1 ? (

                  <img
                    src={item.image1}
                    alt={item.name}
                    className='w-16 h-16 shrink-0 rounded-xl object-cover border border-white/10 opacity-70'
                  />

                ) : (

                  <div className='w-12 h-12 shrink-0 rounded-xl bg-red-400/10 border border-red-300/30 flex items-center justify-center text-red-300'>
                    <MdOutlineCancel className='w-6 h-6' />
                  </div>

                )}


                {/* PRODUCT + CUSTOMER */}

                <div className='flex-1 min-w-0'>

                  <p className='text-sm text-teal-200/90'>

                    {item.name.toUpperCase()} × {item.quantity}

                    <span className='text-slate-400'> ({item.size})</span>

                  </p>

                  <p className='text-xs text-slate-500 mt-1 break-all'>
                    Order ID: {item.orderId}
                  </p>

                  <div className='text-xs sm:text-sm text-slate-300 mt-3 space-y-0.5'>

                    <p>{item.address?.firstName} {item.address?.lastName}</p>

                    <p>
                      {item.address?.city}, {item.address?.state}, {item.address?.pinCode}
                    </p>

                    <p>{item.address?.phone}</p>

                  </div>

                  {/* REASON */}

                  <div className='mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3'>

                    <p className='text-[11px] uppercase tracking-wider text-red-300/80 mb-1'>
                      Reason for cancellation
                    </p>

                    <p className='text-sm text-slate-200 break-words'>
                      {item.cancelReason}
                    </p>

                  </div>

                </div>


                {/* DATES / STATUS */}

                <div className='text-xs sm:text-sm text-slate-300 space-y-1 shrink-0'>

                  <p>
                    Order Date: {new Date(item.orderDate).toLocaleDateString()}
                  </p>

                  <p>
                    Cancelled On: {new Date(item.cancelledAt).toLocaleString()}
                  </p>

                  <p>
                    Delivery Position:{' '}
                    <span className='text-amber-300 font-medium'>
                      {getPosition(item)}
                    </span>
                  </p>

                  <p>
                    Method: {item.paymentMethod}
                  </p>

                  <p>
                    Payment:{' '}
                    <span className={item.payment ? 'text-emerald-400' : 'text-amber-400'}>
                      {item.payment ? 'Done' : 'Pending'}
                    </span>
                  </p>

                  <p className='text-lg font-semibold text-slate-100'>
                    ₹ {item.price * item.quantity}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}

export default CancelledOrders
