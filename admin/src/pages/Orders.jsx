import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { SiEbox } from "react-icons/si"

function Orders() {

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
        {
          withCredentials: true
        }
      )

      setOrders(result.data.reverse())

    } catch (error) {

      console.log(error)

    }
  }


  // =========================================================
  // CHANGE ORDER STATUS
  // =========================================================

  const statusHandler = async (e, orderId) => {

    try {

      const selectedStatus = e.target.value

      // Find current order
      const currentOrder = orders.find(
        (order) => order._id === orderId
      )


      // =====================================================
      // IMPORTANT:
      // If order is already Delivered,
      // do not allow any status change.
      // =====================================================

      if (currentOrder?.status === "Delivered") {

        return

      }


      const result = await axios.post(
        serverUrl + '/api/order/status',
        {
          orderId,
          status: selectedStatus
        },
        {
          withCredentials: true
        }
      )


      if (result.data) {

        await fetchAllOrders()

      }

    } catch (error) {

      console.log(error)

    }
  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchAllOrders()

  }, [])


  // =========================================================
  // ONLY SHOW ORDERS THAT ARE NOT DELIVERED
  // =========================================================

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== 'Delivered' &&
      order.status !== 'Cancelled'
  )


  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white'>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Nav />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className='sm:ml-[64px] md:ml-[170px] lg:ml-[220px] pt-24 pb-20 px-4 sm:px-8 lg:px-10'>


        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <div className='flex flex-col gap-1 mb-8'>

          <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>
            Fulfilment
          </span>

          <h1 className='text-2xl sm:text-3xl font-bold text-slate-100'>
            All Orders
          </h1>

        </div>


        {/* ===================================================
            NO ORDERS
        =================================================== */}

        {pendingOrders.length === 0 ? (

          <div className='flex flex-col items-center justify-center gap-2 py-24 text-center'>

            <p className='text-lg text-slate-200 font-medium'>
              No orders yet
            </p>

            <p className='text-sm text-slate-400'>
              New orders will show up here.
            </p>

          </div>

        ) : (

          <div className='flex flex-col gap-5 max-w-5xl'>


            {/* =================================================
                ORDER LIST
            ================================================= */}

            {pendingOrders.map((order, index) => (

              <div
                key={index}
                className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5 overflow-hidden'
              >


                {/* =================================================
                    TOP LINE
                ================================================= */}

                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-60' />


                {/* =================================================
                    ORDER ICON
                ================================================= */}

                <div className='w-12 h-12 shrink-0 rounded-xl bg-teal-400/10 border border-teal-300/30 flex items-center justify-center text-teal-300'>

                  <SiEbox className='w-6 h-6' />

                </div>


                {/* =================================================
                    ORDER / CUSTOMER INFORMATION
                ================================================= */}

                <div className='flex-1 min-w-0'>


                  {/* PRODUCT ITEMS */}

                  <div className='flex flex-col gap-0.5 text-sm text-teal-200/90'>

                    {order.items.map((item, i) => (

                      <p
                        key={i}
                        className={item.cancelled ? 'line-through text-slate-500' : ''}
                      >

                        {item.name.toUpperCase()} × {item.quantity}

                        <span className='text-slate-400'>
                          ({item.size})
                        </span>

                        {item.cancelled && (
                          <span className='ml-2 text-red-400 no-underline text-xs'>
                            [Cancelled]
                          </span>
                        )}

                      </p>

                    ))}

                  </div>


                  {/* CUSTOMER ADDRESS */}

                  <div className='text-xs sm:text-sm text-slate-300 mt-3 space-y-0.5'>

                    <p>
                      {order.address.firstName} {order.address.lastName}
                    </p>

                    <p>
                      {order.address.street}
                    </p>

                    <p>
                      {order.address.city}, {order.address.state}, {order.address.country}, {order.address.pinCode}
                    </p>

                    <p>
                      {order.address.phone}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    ORDER DETAILS
                ================================================= */}

                <div className='text-xs sm:text-sm text-slate-300 space-y-1 shrink-0'>

                  <p>
                    Items: {order.items.length}
                  </p>

                  <p>
                    Method: {order.paymentMethod}
                  </p>

                  <p>

                    Payment:

                    <span
                      className={
                        order.payment
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }
                    >

                      {order.payment
                        ? 'Done'
                        : 'Pending'
                      }

                    </span>

                  </p>

                  <p>
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>

                  <p className='text-lg font-semibold text-slate-100'>
                    ₹ {order.amount}
                  </p>

                </div>


                {/* =================================================
                    STATUS DROPDOWN
                ================================================= */}

                <select
                  value={order.status}
                  disabled={order.status === "Delivered"}
                  className={`shrink-0 h-11 px-4 rounded-xl bg-white border border-gray-300 text-sm text-black outline-none transition-colors ${
                    order.status === "Delivered"
                      ? "cursor-not-allowed opacity-60"
                      : "focus:border-teal-300/50 cursor-pointer"
                  }`}
                  onChange={(e) => statusHandler(e, order._id)}
                >

                  <option value="Order Placed">
                    Order Placed
                  </option>

                  <option value="Packing">
                    Packing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Out for delivery">
                    Out for delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                </select>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}

export default Orders