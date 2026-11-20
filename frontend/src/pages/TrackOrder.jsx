import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft, FaBox, FaCheck, FaTruck, FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import { MdInventory2 } from 'react-icons/md'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'


function TrackOrder() {

  const { orderId } = useParams()
  const navigate = useNavigate()

  const { currency } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cancel product
  const [cancelIndex, setCancelIndex] = useState(null)      // index of item being cancelled
  const [cancelReason, setCancelReason] = useState('')      // selected reason
  const [cancelNote, setCancelNote] = useState('')          // extra message
  const [cancelling, setCancelling] = useState(false)

  const cancelReasons = [
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Delivery is taking too long',
    'Want to change size / colour',
    'No longer need the product',
    'Other'
  ]

  // Cancel is allowed only until the order is "Out for delivery"
  const CANCELLABLE_STATUSES = ['Order Placed', 'Packing', 'Shipped']


  // =========================================================
  // ORDER STATUS
  // =========================================================

  const statuses = [
    {
      name: 'Order Placed',
      icon: FaBox
    },
    {
      name: 'Packing',
      icon: MdInventory2
    },
    {
      name: 'Shipped',
      icon: FaTruck
    },
    {
      name: 'Out for delivery',
      icon: FaMapMarkerAlt
    },
    {
      name: 'Delivered',
      icon: FaCheck
    }
  ]


  // =========================================================
  // GET STATUS INDEX
  // =========================================================

  const getStatusIndex = (status) => {

    return statuses.findIndex(
      (item) => item.name === status
    )

  }


  // =========================================================
  // FETCH ORDER
  // =========================================================

  const loadOrder = async () => {

    try {

      setLoading(true)
      setError('')


      /*
       * This endpoint should return one order
       * belonging to the logged-in user.
       */

      const result = await axios.post(
        `${serverUrl}/api/order/single`,
        {
          orderId
        },
        {
          withCredentials: true
        }
      )


      if (result.data) {

        /*
         * Supports both:
         *
         * { order: {...} }
         *
         * and directly:
         *
         * {...}
         */

        const orderData =
          result.data.order || result.data

        setOrder(orderData)

      } else {

        setError('Order not found')

      }

    } catch (error) {

      console.log(error)

      setError(
        error.response?.data?.message ||
        'Unable to load order'
      )

    } finally {

      setLoading(false)

    }

  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    if (orderId) {
      loadOrder()
    }

  }, [orderId])


  // =========================================================
  // CANCEL PRODUCT
  // =========================================================

  const openCancelModal = (index) => {
    setCancelIndex(index)
    setCancelReason('')
    setCancelNote('')
  }

  const closeCancelModal = () => {
    if (cancelling) return
    setCancelIndex(null)
    setCancelReason('')
    setCancelNote('')
  }

  const submitCancel = async (e) => {

    e.preventDefault()

    if (!cancelReason) {
      toast.error('Please select a reason')
      return
    }

    if (cancelReason === 'Other' && !cancelNote.trim()) {
      toast.error('Please write your reason')
      return
    }

    // Final reason that is saved in the database
    const finalReason = cancelNote.trim()
      ? `${cancelReason} - ${cancelNote.trim()}`
      : cancelReason

    try {

      setCancelling(true)

      const result = await axios.post(
        `${serverUrl}/api/order/cancel`,
        {
          orderId: order._id,
          itemIndex: cancelIndex,
          reason: finalReason
        },
        { withCredentials: true }
      )

      if (result.data.success) {

        toast.success('Product cancelled successfully')

        setOrder(result.data.order)
        setCancelIndex(null)
        setCancelReason('')
        setCancelNote('')

      }

    } catch (error) {

      console.log(error)

      toast.error(
        error.response?.data?.message ||
        'Failed to cancel product'
      )

      // order status may have changed (e.g. out for delivery) - refresh
      loadOrder()
      setCancelIndex(null)

    } finally {

      setCancelling(false)

    }

  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className='w-full min-h-screen bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] flex items-center justify-center'>

        <div className='flex flex-col items-center gap-4'>

          <div className='w-10 h-10 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin' />

          <p className='text-slate-400 text-sm'>
            Loading order details...
          </p>

        </div>

      </div>

    )

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error || !order) {

    return (

      <div className='w-full min-h-screen bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white flex items-center justify-center px-4'>

        <div className='text-center max-w-md'>

          <div className='w-16 h-16 mx-auto mb-5 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center'>

            <FaBox className='text-red-400 text-2xl' />

          </div>

          <h2 className='text-xl font-semibold mb-2'>
            Order Not Found
          </h2>

          <p className='text-sm text-slate-400 mb-6'>
            {error || 'We could not find this order.'}
          </p>

          <button
            onClick={() => navigate('/order')}
            className='px-6 py-3 rounded-full bg-teal-400 text-[#0a1520] font-semibold hover:bg-teal-300 transition'
          >
            Back to Orders
          </button>

        </div>

      </div>

    )

  }


  // =========================================================
  // CURRENT STATUS
  // =========================================================

  const currentStatusIndex =
    getStatusIndex(order.status)


  const isCancelled =
    order.status === 'Cancelled'


  const isDelivered =
    order.status === 'Delivered'


  // Cancel button is visible only while the order is not out for delivery
  const canCancel =
    CANCELLABLE_STATUSES.includes(order.status)


  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white pt-24 pb-24 px-4 sm:px-8 lg:px-16'>


      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className='max-w-5xl mx-auto mb-8'>

        <button
          onClick={() => navigate('/order')}
          className='flex items-center gap-2 text-sm text-slate-400 hover:text-teal-300 transition'
        >

          <FaArrowLeft />

          Back to Orders

        </button>

      </div>


      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className='text-center mb-10 flex flex-col items-center gap-3'>

        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>
          Order Tracking
        </span>

        <Title
          text1='TRACK'
          text2='ORDER'
        />

        <p className='text-xs sm:text-sm text-slate-400'>
          Order ID: {order._id}
        </p>

      </div>


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className='max-w-5xl mx-auto flex flex-col gap-6'>


        {/* ===================================================
            ORDER STATUS
        =================================================== */}

        <div className='rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-8'>


          {/* HEADER */}

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-10'>

            <div>

              <p className='text-xs tracking-[0.25em] uppercase text-teal-300/70'>
                Current Status
              </p>

              <h2 className='text-xl sm:text-2xl font-semibold text-white mt-1'>
                {order.status}
              </h2>

            </div>


            {/* PAYMENT */}

            <div className='flex flex-col items-start sm:items-end gap-1'>

              <p className='text-xs text-slate-500'>
                Payment
              </p>

              <p
                className={`text-sm font-medium ${
                  order.payment
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >

                {order.payment
                  ? 'Payment Done'
                  : 'Payment Pending'
                }

              </p>

            </div>

          </div>


          {/* =================================================
              CANCELLED
          ================================================= */}

          {isCancelled ? (

            <div className='rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center'>

              <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center'>

                <FaBox className='text-red-400 text-xl' />

              </div>

              <h3 className='text-lg font-semibold text-red-300'>
                Order Cancelled
              </h3>

              <p className='text-sm text-slate-400 mt-2'>
                This order has been cancelled and will not be delivered.
              </p>

            </div>

          ) : (

            /* =================================================
                TRACKING PROGRESS
            ================================================= */

            <div className='relative'>


              {/* DESKTOP CONNECTING LINE */}

              <div className='hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-white/10' />

              <div
                className='hidden md:block absolute top-7 left-[10%] h-[2px] bg-teal-400 transition-all duration-500'
                style={{
                  width:
                    currentStatusIndex <= 0
                      ? '0%'
                      : `${(currentStatusIndex / (statuses.length - 1)) * 80}%`
                }}
              />


              {/* STATUS ITEMS */}

              <div className='flex flex-col md:flex-row md:justify-between gap-6 md:gap-0'>

                {statuses.map((status, index) => {

                  const Icon = status.icon

                  const completed =
                    index <= currentStatusIndex

                  const current =
                    index === currentStatusIndex


                  return (

                    <div
                      key={status.name}
                      className='relative flex md:flex-col items-center md:items-center gap-4 md:gap-3 md:w-1/5'
                    >


                      {/* MOBILE LINE */}

                      {index !== statuses.length - 1 && (

                        <div
                          className={`md:hidden absolute left-[15px] top-8 w-[2px] h-[45px] ${
                            index < currentStatusIndex
                              ? 'bg-teal-400'
                              : 'bg-white/10'
                          }`}
                        />

                      )}


                      {/* ICON */}

                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          completed
                            ? 'bg-teal-400 border-teal-300 text-[#0a1520]'
                            : 'bg-[#0d1b24] border-white/20 text-slate-500'
                        } ${
                          current
                            ? 'ring-4 ring-teal-400/20'
                            : ''
                        }`}
                      >

                        <Icon className='text-xs' />

                      </div>


                      {/* TEXT */}

                      <div className='md:text-center'>

                        <p
                          className={`text-sm font-medium ${
                            completed
                              ? 'text-teal-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {status.name}
                        </p>

                        {current && (

                          <p className='text-[11px] text-slate-500 mt-1'>
                            Current status
                          </p>

                        )}

                      </div>

                    </div>

                  )

                })}

              </div>

            </div>

          )}

        </div>


        {/* =====================================================
            ORDER ITEMS
        ===================================================== */}

        <div className='rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-8'>

          <div className='mb-6'>

            <p className='text-xs tracking-[0.25em] uppercase text-teal-300/70'>
              Order Details
            </p>

            <h2 className='text-xl font-semibold text-white mt-1'>
              Items in this order
            </h2>

          </div>


          <div className='flex flex-col gap-4'>

            {order.items?.map((item, index) => (

              <div
                key={index}
                className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border ${
                  item.cancelled
                    ? 'border-red-400/20 bg-red-400/[0.03]'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >

                {/* IMAGE */}

                <img
                  src={item.image1}
                  alt={item.name}
                  className={`w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0 ${
                    item.cancelled ? 'opacity-50 grayscale' : ''
                  }`}
                />


                {/* INFO */}

                <div className='flex-1'>

                  <h3 className={`text-base font-medium ${
                    item.cancelled
                      ? 'text-slate-400 line-through'
                      : 'text-white'
                  }`}>
                    {item.name}
                  </h3>

                  <div className='flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-slate-400'>

                    <span>
                      Size: {item.size}
                    </span>

                    <span>
                      Quantity: {item.quantity}
                    </span>

                  </div>


                  {/* CANCELLED DETAILS */}

                  {item.cancelled && (

                    <div className='mt-3 text-xs text-red-300/90 space-y-1'>

                      <p className='font-semibold uppercase tracking-wider'>
                        Cancelled
                      </p>

                      <p>
                        Reason: <span className='text-slate-300'>{item.cancelReason}</span>
                      </p>

                      <p>
                        Cancelled on: <span className='text-slate-300'>
                          {new Date(item.cancelledAt).toLocaleString()}
                        </span>
                      </p>

                    </div>

                  )}

                </div>


                {/* PRICE */}

                <div className='sm:text-right'>

                  <p className='text-sm text-slate-400'>
                    Price
                  </p>

                  <p className={`text-lg font-semibold ${
                    item.cancelled
                      ? 'text-slate-500 line-through'
                      : 'text-teal-300'
                  }`}>
                    {currency} {item.price}
                  </p>


                  {/* CANCEL BUTTON
                      Shown only for this product and only until the
                      order is out for delivery. */}

                  {canCancel && !item.cancelled && (

                    <button
                      type='button'
                      onClick={() => openCancelModal(index)}
                      className='mt-3 px-4 py-2 rounded-full border border-red-400/40 text-red-300 text-xs sm:text-sm font-medium hover:bg-red-500 hover:text-white transition-colors duration-300'
                    >
                      Cancel Product
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>


          {/* TOTAL */}

          <div className='mt-6 pt-5 border-t border-white/10 flex justify-between items-center'>

            <span className='text-sm text-slate-400'>
              Total Amount
            </span>

            <span className='text-xl font-semibold text-white'>
              {currency} {order.amount}
            </span>

          </div>

        </div>


        {/* =====================================================
            DELIVERY + PAYMENT INFORMATION
        ===================================================== */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>


          {/* ===================================================
              DELIVERY ADDRESS
          =================================================== */}

          <div className='rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-7'>

            <div className='flex items-center gap-3 mb-5'>

              <div className='w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-300/20 flex items-center justify-center'>

                <FaMapMarkerAlt className='text-teal-300' />

              </div>

              <div>

                <p className='text-xs text-slate-500 uppercase tracking-wider'>
                  Delivery
                </p>

                <h3 className='text-lg font-semibold text-white'>
                  Delivery Address
                </h3>

              </div>

            </div>


            <div className='text-sm text-slate-300 space-y-1'>

              <p className='font-medium text-white'>
                {order.address?.firstName} {order.address?.lastName}
              </p>

              <p>
                {order.address?.street}
              </p>

              <p>
                {order.address?.city}, {order.address?.state}
              </p>

              <p>
                {order.address?.country} - {order.address?.pinCode}
              </p>

              <p className='pt-2 text-slate-400'>
                Phone: {order.address?.phone}
              </p>

            </div>

          </div>


          {/* ===================================================
              PAYMENT INFORMATION
          =================================================== */}

          <div className='rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-7'>

            <div className='flex items-center gap-3 mb-5'>

              <div className='w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-300/20 flex items-center justify-center'>

                <FaBox className='text-teal-300' />

              </div>

              <div>

                <p className='text-xs text-slate-500 uppercase tracking-wider'>
                  Payment
                </p>

                <h3 className='text-lg font-semibold text-white'>
                  Payment Details
                </h3>

              </div>

            </div>


            <div className='space-y-3 text-sm'>

              <div className='flex justify-between'>

                <span className='text-slate-400'>
                  Method
                </span>

                <span className='text-white'>
                  {order.paymentMethod}
                </span>

              </div>


              <div className='flex justify-between'>

                <span className='text-slate-400'>
                  Status
                </span>

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

              </div>


              <div className='flex justify-between'>

                <span className='text-slate-400'>
                  Order Date
                </span>

                <span className='text-white'>
                  {new Date(order.date).toDateString()}
                </span>

              </div>


              <div className='flex justify-between pt-3 border-t border-white/10'>

                <span className='text-slate-400'>
                  Total
                </span>

                <span className='text-lg font-semibold text-teal-300'>
                  {currency} {order.amount}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CANCEL PRODUCT MODAL
      ===================================================== */}

      {cancelIndex !== null && order.items?.[cancelIndex] && (

        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>

          <div className='relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1b24] shadow-2xl p-6 sm:p-8'>

            <button
              type='button'
              onClick={closeCancelModal}
              disabled={cancelling}
              className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50'
            >
              <FaTimes />
            </button>

            <div className='mb-6 pr-8'>

              <p className='text-xs tracking-[0.3em] uppercase text-red-300/70 mb-2'>
                Cancel Product
              </p>

              <h2 className='text-xl font-semibold text-white'>
                {order.items[cancelIndex].name}
              </h2>

              <p className='text-xs text-slate-400 mt-1'>
                Size: {order.items[cancelIndex].size} &nbsp;|&nbsp; Quantity: {order.items[cancelIndex].quantity}
              </p>

            </div>

            <form onSubmit={submitCancel} className='flex flex-col gap-5'>

              <div>

                <label className='text-sm text-slate-300'>
                  Why do you want to cancel?
                </label>

                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none'
                >
                  <option value=''>Select a reason</option>
                  {cancelReasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

              </div>

              <div>

                <label className='text-sm text-slate-300'>
                  Message {cancelReason === 'Other' ? '(required)' : '(optional)'}
                </label>

                <textarea
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder='Tell us more about the reason...'
                  rows={4}
                  maxLength={300}
                  className='mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-400/50'
                />

                <p className='text-xs text-slate-500 mt-1 text-right'>
                  {cancelNote.length}/300
                </p>

              </div>

              <div className='flex justify-end gap-3'>

                <button
                  type='button'
                  disabled={cancelling}
                  onClick={closeCancelModal}
                  className='px-5 py-2.5 rounded-full border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors disabled:opacity-50'
                >
                  Keep Product
                </button>

                <button
                  type='submit'
                  disabled={cancelling}
                  className='px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-400 transition-colors disabled:opacity-50'
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )
}

export default TrackOrder