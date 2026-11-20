import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

function PlaceOrder() {

  let [method, setMethod] = useState('cod')

  let navigate = useNavigate()

  const {
    cartItem,
    setCartItem,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(shopDataContext)

  let { serverUrl } = useContext(authDataContext)

  let [loading, setLoading] = useState(false)


  let [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  })


  let [saving, setSaving] = useState(false)


  // =====================================================
  // PRE-FILL SAVED DELIVERY INFORMATION
  // =====================================================

  useEffect(() => {

    const loadSavedInfo = async () => {

      try {

        const { data } = await axios.get(
          '/api/user/delivery',
          { withCredentials: true }
        )

        if (data.isSaved) {

          const {
            firstName, lastName, email, street,
            city, state, pinCode, country, phone
          } = data.deliveryInfo

          setFormData({
            firstName, lastName, email, street,
            city, state, pinCode, country, phone
          })

        }

      } catch (error) {

        console.log("Load delivery info error:", error)

      }

    }

    loadSavedInfo()

  }, [])


  // =====================================================
  // SAVE DELIVERY INFORMATION
  // =====================================================

  const saveDeliveryHandler = async () => {

    const missing = Object.values(formData).some(v => !String(v).trim())

    if (missing) {

      toast.error("Please fill all delivery fields before saving")

      return

    }

    try {

      setSaving(true)

      await axios.put(
        '/api/user/delivery',
        formData,
        { withCredentials: true }
      )

      toast.success("Delivery information saved")

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to save delivery information"
      )

    } finally {

      setSaving(false)

    }

  }


  const onChangeHandler = (e) => {

    const name = e.target.name

    const value = e.target.value

    setFormData(data => ({
      ...data,
      [name]: value
    }))

  }


  // =====================================================
  // RAZORPAY
  // =====================================================

  const initPay = (order) => {

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: 'Order Payment',

      description: 'Order Payment',

      order_id: order.id,

      receipt: order.receipt,

      handler: async (response) => {

        try {

          console.log(response)

          const { data } = await axios.post(
            '/api/order/verifyrazorpay',
            response,
            {
              withCredentials: true
            }
          )


          if (data) {

            navigate("/order")

            setCartItem({})

          }

        } catch (error) {

          console.log(
            "Payment Verification Error:",
            error
          )

          toast.error(
            error.response?.data?.message ||
            "Payment verification failed"
          )

        }

      }

    }


    const rzp = new window.Razorpay(options)

    rzp.open()

  }


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    setLoading(true)


    try {

      let orderItems = []


      // -------------------------------------------------
      // CREATE ORDER ITEMS
      // -------------------------------------------------

      for (const items in cartItem) {

        for (const item in cartItem[items]) {

          if (cartItem[items][item] > 0) {

            const itemInfo = structuredClone(
              products.find(
                product => product._id === items
              )
            )


            if (itemInfo) {

              // IMPORTANT
              // Store productId explicitly
              // so the review system can verify
              // that the user purchased this product.

              itemInfo.productId = itemInfo._id


              itemInfo.size = item

              itemInfo.quantity =
                cartItem[items][item]


              orderItems.push(itemInfo)

            }

          }

        }

      }


      // -------------------------------------------------
      // ORDER DATA
      // -------------------------------------------------

      let orderData = {

        address: formData,

        items: orderItems,

        amount:
          getCartAmount() + delivery_fee

      }


      // -------------------------------------------------
      // PAYMENT METHOD
      // -------------------------------------------------

      switch (method) {


        // =================================================
        // COD
        // =================================================

        case 'cod':

          const result = await axios.post(

            "/api/order/placeorder",

            orderData,

            {
              withCredentials: true
            }

          )


          console.log(result.data)


          if (result.data) {

            setCartItem({})

            toast.success(
              "Order Placed"
            )

            navigate("/order")

            setLoading(false)

          } else {

            console.log(
              result.data.message
            )

            toast.error(
              "Order Placed Error"
            )

            setLoading(false)

          }

          break


        // =================================================
        // RAZORPAY
        // =================================================

        case 'razorpay':

          const resultRazorpay =
            await axios.post(

              "/api/order/razorpay",

              orderData,

              {
                withCredentials: true
              }

            )


          if (resultRazorpay.data) {

            initPay(
              resultRazorpay.data
            )

            toast.success(
              "Order Created"
            )

            setLoading(false)

          }

          break


        default:

          setLoading(false)

          break

      }


    } catch (error) {

      console.log(
        "Place Order Error:",
        error
      )

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      )

      setLoading(false)

    }

  }


  const inputClass =
    'w-full h-12 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 text-sm sm:text-base px-4 text-slate-100 outline-none focus:border-teal-300/50 focus:bg-white/[0.07] transition-colors'


  // =====================================================
  // STEP BADGE
  // =====================================================

  const StepBadge = ({ n }) => (

    <div className='absolute -left-[52px] sm:-left-[60px] top-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a1520] border-2 border-teal-400/50 flex items-center justify-center text-teal-300 font-bold text-xs sm:text-sm shrink-0'>

      {n}

    </div>

  )


  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-24 px-4 sm:px-8 lg:px-16'>


      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className='max-w-2xl mx-auto text-center mb-16 flex flex-col items-center gap-3'>

        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>

          Checkout

        </span>


        <Title
          text1={'COMPLETE'}
          text2={'YOUR ORDER'}
        />

      </div>


      <form
        onSubmit={onSubmitHandler}
        className='relative max-w-2xl mx-auto pl-[52px] sm:pl-[60px] flex flex-col gap-14'
      >


        {/* CONNECTING LINE */}

        <div className='absolute left-[17px] sm:left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-teal-400/50 via-white/10 to-transparent' />


        {/* ================================================= */}
        {/* STEP 1 */}
        {/* ================================================= */}

        <div className='relative'>

          <StepBadge n='01' />


          <div className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden'>

            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />


            <p className='text-xs uppercase tracking-[0.3em] text-teal-300/70 mb-1'>

              Step One

            </p>


            <Title
              text1={'DELIVERY'}
              text2={'INFORMATION'}
            />


            <div className='flex flex-col gap-4 mt-6'>


              <div className='flex flex-col sm:flex-row gap-4'>

                <input
                  type="text"
                  placeholder='First name'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='firstName'
                  value={formData.firstName}
                />


                <input
                  type="text"
                  placeholder='Last name'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='lastName'
                  value={formData.lastName}
                />

              </div>


              <input
                type="email"
                placeholder='Email address'
                className={inputClass}
                required
                onChange={onChangeHandler}
                name='email'
                value={formData.email}
              />


              <input
                type="text"
                placeholder='Street'
                className={inputClass}
                required
                onChange={onChangeHandler}
                name='street'
                value={formData.street}
              />


              <div className='flex flex-col sm:flex-row gap-4'>

                <input
                  type="text"
                  placeholder='City'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='city'
                  value={formData.city}
                />


                <input
                  type="text"
                  placeholder='State'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='state'
                  value={formData.state}
                />

              </div>


              <div className='flex flex-col sm:flex-row gap-4'>

                <input
                  type="text"
                  placeholder='Pincode'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='pinCode'
                  value={formData.pinCode}
                />


                <input
                  type="text"
                  placeholder='Country'
                  className={inputClass}
                  required
                  onChange={onChangeHandler}
                  name='country'
                  value={formData.country}
                />

              </div>


              <input
                type="text"
                placeholder='Phone'
                className={inputClass}
                required
                onChange={onChangeHandler}
                name='phone'
                value={formData.phone}
              />


              <button
                type='button'
                onClick={saveDeliveryHandler}
                disabled={saving}
                className='self-end px-8 py-2.5 rounded-full border border-teal-400/40 text-teal-100 text-sm font-semibold tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 disabled:opacity-60'
              >

                {saving ? 'Saving...' : 'SAVE'}

              </button>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* STEP 2 */}
        {/* ================================================= */}

        <div className='relative'>

          <StepBadge n='02' />


          <div className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden'>

            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />


            <p className='text-xs uppercase tracking-[0.3em] text-teal-300/70 mb-1'>

              Step Two

            </p>


            <Title
              text1={'PAYMENT'}
              text2={'METHOD'}
            />


            <div className='flex flex-col gap-3 mt-6'>


              {/* RAZORPAY */}

              <button
                type="button"
                onClick={() =>
                  setMethod('razorpay')
                }
                className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  method === 'razorpay'
                    ? 'border-teal-300/70 bg-teal-400/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-teal-300/30'
                }`}
              >

                <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  method === 'razorpay'
                    ? 'border-teal-300'
                    : 'border-white/30'
                }`}>

                  {method === 'razorpay' && (

                    <span className='w-2 h-2 rounded-full bg-teal-300' />

                  )}

                </span>


                <img
                  src={razorpay}
                  className='h-8 rounded object-contain'
                  alt="Razorpay"
                />


                <div className='flex flex-col'>

                  <span className='text-sm sm:text-base font-medium text-slate-100'>

                    Pay with Razorpay

                  </span>


                  <span className='text-xs text-slate-400'>

                    Card, UPI, netbanking & wallets

                  </span>

                </div>

              </button>


              {/* COD */}

              <button
                type="button"
                onClick={() =>
                  setMethod('cod')
                }
                className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  method === 'cod'
                    ? 'border-teal-300/70 bg-teal-400/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-teal-300/30'
                }`}
              >

                <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  method === 'cod'
                    ? 'border-teal-300'
                    : 'border-white/30'
                }`}>

                  {method === 'cod' && (

                    <span className='w-2 h-2 rounded-full bg-teal-300' />

                  )}

                </span>


                <div className='flex flex-col'>

                  <span className='text-sm sm:text-base font-medium text-slate-100'>

                    Cash on Delivery

                  </span>


                  <span className='text-xs text-slate-400'>

                    Pay in cash when your order arrives

                  </span>

                </div>

              </button>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* STEP 3 */}
        {/* ================================================= */}

        <div className='relative'>

          <StepBadge n='03' />


          <div className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden'>

            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />


            <p className='text-xs uppercase tracking-[0.3em] text-teal-300/70 mb-1'>

              Step Three

            </p>


            <div className='mt-2'>

              <CartTotal />

            </div>


            <button
              type='submit'
              disabled={loading}
              className='w-full mt-8 px-10 py-3 rounded-full border border-teal-400/40 text-teal-100 text-sm sm:text-base font-semibold tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60'
            >

              {loading
                ? <Loading />
                : "PLACE ORDER"
              }

            </button>

          </div>

        </div>

      </form>

    </div>

  )

}

export default PlaceOrder