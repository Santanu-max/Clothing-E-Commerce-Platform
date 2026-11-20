import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Title from '../components/Title'
import { shopDataContext } from '../context/ShopContext'
import axios from 'axios'

import { FaStar, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'

function Order() {

  const navigate = useNavigate()

  const [orderData, setOrderData] = useState([])

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewProduct, setReviewProduct] = useState(null)

  // Review form
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  // Review status
  const [reviewStatus, setReviewStatus] = useState({})

  const { currency } = useContext(shopDataContext)

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrderData = async () => {

    try {

      const result = await axios.post(
        '/api/order/userorder',
        {},
        {
          withCredentials: true
        }
      )

      if (result.data) {

        let allOrdersItem = []

        result.data.forEach((order) => {

          order.items.forEach((item) => {

            allOrdersItem.push({

              ...item,

              // IMPORTANT:
              // Store the parent order ID so Track Order
              // knows which order to open.
              orderId: order._id,

              // Order information
              // (a cancelled product shows "Cancelled" even if the
              //  rest of the order is still moving)
              status: item.cancelled ? 'Cancelled' : order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderDate: order.date

            })

          })

        })

        // =====================================================
        // ORDER PRIORITY
        // =====================================================

        /*
          Non-delivered orders appear first.

          Priority:
          1. Out for delivery
          2. Shipped
          3. Packing
          4. Order Placed
          5. Delivered
        */

        const statusPriority = {

          "Out for delivery": 1,
          "Shipped": 2,
          "Packing": 3,
          "Order Placed": 4,
          "Delivered": 5,
          "Cancelled": 6

        }

        allOrdersItem.sort((a, b) => {

          const priorityA = statusPriority[a.status] || 99
          const priorityB = statusPriority[b.status] || 99

          // First sort according to status
          if (priorityA !== priorityB) {
            return priorityA - priorityB
          }

          // Same status -> newest order first
          return new Date(b.date) - new Date(a.date)

        })

        setOrderData(allOrdersItem)

      }

    } catch (error) {

      console.log(error)

      toast.error(
        error.response?.data?.message ||
        "Failed to load orders"
      )

    }

  }


  // =========================================================
  // CHECK REVIEW STATUS
  // =========================================================

  const checkReviewStatus = async (items) => {

    try {

      const deliveredItems = items.filter(
        item => item.status === "Delivered"
      )

      const status = {}

      await Promise.all(

        deliveredItems.map(async (item) => {

          /*
            Supports both:

            New orders -> productId
            Old orders -> _id
          */

          const productId = item.productId || item._id

          if (!productId) return

          try {

            const result = await axios.get(
              `/api/review/eligibility/${productId}`,
              {
                withCredentials: true
              }
            )

            status[productId] = {

              canReview: result.data.canReview,

              alreadyReviewed:
                result.data.alreadyReviewed

            }

          } catch (error) {

            console.log(
              `Review eligibility error for ${productId}`,
              error
            )

          }

        })

      )

      setReviewStatus(status)

    } catch (error) {

      console.log(error)

    }

  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadOrderData()

  }, [])


  // =========================================================
  // CHECK REVIEW STATUS WHEN ORDERS LOAD
  // =========================================================

  useEffect(() => {

    if (orderData.length > 0) {

      checkReviewStatus(orderData)

    }

  }, [orderData])


  // =========================================================
  // OPEN REVIEW MODAL
  // =========================================================

  const openReviewModal = (item) => {

    // Supports old and new orders
    const productId = item.productId || item._id

    if (!productId) {

      toast.error("Product information not found")

      return

    }

    /*
      IMPORTANT:

      We DO NOT call the eligibility API here.

      The user has already clicked "Give Review",
      so the review window should open immediately.

      The backend will perform the final validation
      when the review is submitted.
    */

    setReviewProduct({

      ...item,

      productId

    })

    setReviewRating(5)
    setReviewComment('')
    setShowReviewModal(true)

  }


  // =========================================================
  // CLOSE REVIEW MODAL
  // =========================================================

  const closeReviewModal = () => {

    if (reviewSubmitting) return

    setShowReviewModal(false)
    setReviewProduct(null)
    setReviewRating(5)
    setReviewComment('')

  }


  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const submitReview = async (e) => {

    e.preventDefault()

    if (!reviewProduct) return

    if (!reviewComment.trim()) {

      toast.error("Please write a review")

      return

    }

    if (reviewRating < 1 || reviewRating > 5) {

      toast.error("Please select a rating")

      return

    }

    try {

      setReviewSubmitting(true)

      const result = await axios.post(

        '/api/review/add',

        {
          productId: reviewProduct.productId,
          rating: reviewRating,
          comment: reviewComment.trim()
        },

        {
          withCredentials: true
        }

      )

      if (result.data.success) {

        toast.success("Review added successfully")

        // Mark product as reviewed
        setReviewStatus(prev => ({

          ...prev,

          [reviewProduct.productId]: {

            canReview: false,
            alreadyReviewed: true

          }

        }))

        // Close modal
        setShowReviewModal(false)
        setReviewProduct(null)

        // Reset form
        setReviewRating(5)
        setReviewComment('')

      }

    } catch (error) {

      console.log(error)

      toast.error(

        error.response?.data?.message ||
        "Failed to submit review"

      )

    } finally {

      setReviewSubmitting(false)

    }

  }


  // =========================================================
  // TRACK ORDER
  // =========================================================

  const handleTrackOrder = (item) => {

    if (!item.orderId) {

      toast.error("Order ID not found")

      console.log(
        "Track Order Error: orderId is missing",
        item
      )

      return

    }

    console.log(
      "Navigating to Track Order:",
      item.orderId
    )

    navigate(`/track-order/${item.orderId}`)

  }


  // =========================================================
  // RENDER STARS
  // =========================================================

  const renderStars = () => {

    return (

      <div className='flex items-center gap-2'>

        {[1, 2, 3, 4, 5].map((star) => (

          <button
            key={star}
            type='button'
            onClick={() => setReviewRating(star)}
            className='transition-transform hover:scale-110'
          >

            <FaStar
              className={
                star <= reviewRating
                  ? 'text-yellow-400 text-xl'
                  : 'text-slate-600 text-xl'
              }
            />

          </button>

        ))}

      </div>

    )

  }


  // =========================================================
  // PAGE UI
  // =========================================================

  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-24 px-4 sm:px-8 lg:px-16'>

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <div className='text-center mb-10 flex flex-col items-center gap-3'>

        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>
          Order History
        </span>

        <Title
          text1={'MY'}
          text2={'ORDER'}
        />

      </div>


      {/* =====================================================
          NO ORDERS
      ===================================================== */}

      {orderData.length === 0 ? (

        <div className='w-full flex flex-col items-center justify-center gap-2 py-24 text-center'>

          <p className='text-lg sm:text-xl text-slate-200 font-medium'>
            No orders yet
          </p>

          <p className='text-sm sm:text-base text-slate-400'>
            Everything you order will show up here.
          </p>

        </div>

      ) : (

        <div className='w-full max-w-4xl mx-auto flex flex-col gap-4'>

          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          {orderData.map((item, index) => {

            // Supports old and new orders
            const productId = item.productId || item._id

            const isDelivered =
              item.status === "Delivered"

            const isAlreadyReviewed =
              reviewStatus[productId]?.alreadyReviewed

            return (

              <div
                key={`${item.orderId}-${productId}-${index}`}
                className={`
                  group relative rounded-2xl border
                  ${
                    isDelivered
                      ? 'border-white/10'
                      : 'border-teal-400/20'
                  }
                  bg-white/[0.04]
                  backdrop-blur-md
                  p-4 sm:p-6
                  flex flex-col sm:flex-row
                  items-start gap-5
                  transition-all duration-300
                  hover:border-teal-300/30
                `}
              >

                {/* TOP LINE */}

                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-50 group-hover:opacity-90 transition-opacity' />


                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <img
                  src={item.image1}
                  alt={item.name}
                  className='w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-white/10 shrink-0'
                />


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div className='flex flex-col gap-2 flex-1'>

                  {/* PRODUCT NAME */}

                  <p className='text-base sm:text-lg text-slate-100 font-medium'>
                    {item.name}
                  </p>


                  {/* PRICE / QUANTITY / SIZE */}

                  <div className='flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm text-teal-200/90'>

                    <p>
                      {currency} {item.price}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Size: {item.size}
                    </p>

                  </div>


                  {/* ORDER DATE */}

                  <p className='text-xs sm:text-sm text-slate-400'>

                    Date:

                    <span className='text-slate-200 ml-1'>
                      {new Date(item.date).toDateString()}
                    </span>

                  </p>


                  {/* PAYMENT METHOD */}

                  <p className='text-xs sm:text-sm text-slate-400'>

                    Payment Method:

                    <span className='text-slate-200 ml-1'>
                      {item.paymentMethod}
                    </span>

                  </p>


                  {/* =================================================
                      DELIVERED MESSAGE
                  ================================================= */}

                  {isDelivered && (

                    <div className='mt-2 pt-2 border-t border-white/10'>

                      <p className='text-xs sm:text-sm text-emerald-300 flex items-center gap-2'>

                        <span className='text-emerald-400 text-base'>
                          ✓
                        </span>

                        <span>
                          Product delivered on
                        </span>

                        <span className='text-slate-200'>
                          {new Date(item.date).toDateString()}
                        </span>

                      </p>

                    </div>

                  )}

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto sm:ml-auto'>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div className='flex items-center gap-2'>

                    <span
                      className={`
                        w-2 h-2 rounded-full
                        ${
                          isDelivered
                            ? 'bg-emerald-400'
                            : item.status === 'Cancelled'
                              ? 'bg-red-400'
                              : 'bg-teal-400'
                        }
                      `}
                    />

                    <p className='text-xs sm:text-sm text-slate-100'>
                      {item.status}
                    </p>

                  </div>


                  {/* =================================================
                      BUTTONS
                  ================================================= */}

                  <div className='flex flex-wrap items-center justify-end gap-2'>


                    {/* =================================================
                        REVIEW BUTTON
                    ================================================= */}

                    {isDelivered && (

                      isAlreadyReviewed ? (

                        <button
                          disabled
                          className='px-4 py-2 rounded-full border border-emerald-400/30 text-emerald-300/70 text-xs sm:text-sm font-medium tracking-wide cursor-not-allowed'
                        >
                          Reviewed
                        </button>

                      ) : (

                        <button
                          onClick={() => openReviewModal(item)}
                          className='px-4 py-2 rounded-full border border-yellow-400/50 bg-yellow-400 text-[#0a1520] text-xs sm:text-sm font-medium tracking-wide hover:bg-yellow-300 transition-colors duration-300'
                        >
                          Give Review
                        </button>

                      )

                    )}


                    {/* =================================================
                        TRACK ORDER
                    ================================================= */}

                    <button
                      type='button'
                      onClick={() => handleTrackOrder(item)}
                      className='px-4 py-2 rounded-full border border-teal-400/40 text-teal-100 text-xs sm:text-sm font-medium tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300'
                    >
                      Track Order
                    </button>


                  </div>

                </div>

              </div>

            )

          })}

        </div>

      )}


      {/* =========================================================
          REVIEW MODAL
      ========================================================= */}

      {showReviewModal && reviewProduct && (

        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>

          {/* MODAL */}

          <div className='relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1b24] shadow-2xl p-6 sm:p-8'>


            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type='button'
              onClick={closeReviewModal}
              disabled={reviewSubmitting}
              className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50'
            >
              <FaTimes />
            </button>


            {/* =================================================
                MODAL TITLE
            ================================================= */}

            <div className='mb-6 pr-8'>

              <p className='text-xs tracking-[0.3em] uppercase text-teal-300/70 mb-2'>
                Product Review
              </p>

              <h2 className='text-xl sm:text-2xl font-semibold text-white'>
                {reviewProduct.name}
              </h2>

            </div>


            {/* =================================================
                REVIEW FORM
            ================================================= */}

            <form
              onSubmit={submitReview}
              className='flex flex-col gap-6'
            >


              {/* =================================================
                  RATING
              ================================================= */}

              <div>

                <p className='text-sm text-slate-300 mb-3'>
                  Your Rating
                </p>

                {renderStars()}

              </div>


              {/* =================================================
                  COMMENT
              ================================================= */}

              <div>

                <label className='text-sm text-slate-300'>
                  Your Review
                </label>

                <textarea
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(e.target.value)
                  }
                  placeholder='Write your experience with this product...'
                  rows={5}
                  maxLength={500}
                  className='mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-teal-400/50'
                />

                <p className='text-xs text-slate-500 mt-1 text-right'>
                  {reviewComment.length}/500
                </p>

              </div>


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className='flex justify-end gap-3'>


                {/* CANCEL */}

                <button
                  type='button'
                  disabled={reviewSubmitting}
                  onClick={closeReviewModal}
                  className='px-5 py-2.5 rounded-full border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors disabled:opacity-50'
                >
                  Cancel
                </button>


                {/* SUBMIT */}

                <button
                  type='submit'
                  disabled={reviewSubmitting}
                  className='px-5 py-2.5 rounded-full bg-teal-400 text-[#0a1520] text-sm font-semibold hover:bg-teal-300 transition-colors disabled:opacity-50'
                >

                  {reviewSubmitting
                    ? 'Submitting...'
                    : 'Submit Review'
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}

export default Order