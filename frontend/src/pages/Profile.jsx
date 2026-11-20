import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import Title from '../components/Title'
import { userDataContext } from '../context/UserContext'
import { shopDataContext } from '../context/ShopContext'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  country: '',
  phone: ''
}

const FIELD_LABELS = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email address',
  street: 'Street',
  city: 'City',
  state: 'State',
  pinCode: 'Pincode',
  country: 'Country',
  phone: 'Phone'
}

function Profile() {

  const { userData } = useContext(userDataContext)
  const { currency } = useContext(shopDataContext)

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalSpent: 0
  })

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSaved, setIsSaved] = useState(false)   // is delivery info already saved?
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)


  // =========================================================
  // LOAD STATS + SAVED DELIVERY INFORMATION
  // =========================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const [statsRes, deliveryRes] = await Promise.all([
          axios.get('/api/user/stats', { withCredentials: true }),
          axios.get('/api/user/delivery', { withCredentials: true })
        ])

        setStats({
          totalOrders: statsRes.data.totalOrders,
          totalProducts: statsRes.data.totalProducts,
          totalSpent: statsRes.data.totalSpent
        })

        if (deliveryRes.data.isSaved) {

          const { isSaved: _ignored, ...info } = deliveryRes.data.deliveryInfo

          setFormData({ ...EMPTY_FORM, ...info })
          setIsSaved(true)

        } else {

          // Nothing saved yet -> show the form straight away,
          // with name + email pre-filled from the account.
          const [first = '', ...rest] = (userData?.name || '').split(' ')

          setFormData({
            ...EMPTY_FORM,
            firstName: first,
            lastName: rest.join(' '),
            email: userData?.email || ''
          })

        }

      } catch (error) {

        console.log(error)

        toast.error(
          error.response?.data?.message ||
          'Failed to load profile'
        )

      } finally {

        setLoading(false)

      }

    }

    loadProfile()

  }, [])


  const onChangeHandler = (e) => {

    const { name, value } = e.target

    setFormData(data => ({ ...data, [name]: value }))

  }


  // =========================================================
  // SAVE
  // =========================================================

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    try {

      setSaving(true)

      await axios.put(
        '/api/user/delivery',
        formData,
        { withCredentials: true }
      )

      toast.success('Delivery information saved')

      setIsSaved(true)
      setEditing(false)

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Failed to save delivery information'
      )

    } finally {

      setSaving(false)

    }

  }


  const inputClass =
    'w-full h-12 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 text-sm sm:text-base px-4 text-slate-100 outline-none focus:border-teal-300/50 focus:bg-white/[0.07] transition-colors'

  const cardClass =
    'relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden'

  const topLine =
    <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />

  const showForm = !isSaved || editing


  return (

    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-24 px-4 sm:px-8 lg:px-16'>

      {/* PAGE HEADER */}

      <div className='max-w-2xl mx-auto text-center mb-12 flex flex-col items-center gap-3'>

        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>
          Account
        </span>

        <Title text1={'MY'} text2={'PROFILE'} />

      </div>


      <div className='max-w-3xl mx-auto flex flex-col gap-8'>

        {/* USER INFO + STATS */}

        <div className={cardClass}>

          {topLine}

          <div className='flex items-center gap-4 mb-6'>

            <div className='w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-black text-white flex items-center justify-center text-xl font-semibold shadow-md shrink-0'>
              {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
            </div>

            <div className='min-w-0'>
              <p className='text-lg text-slate-100 font-medium truncate'>
                {userData?.name}
              </p>
              <p className='text-sm text-slate-400 truncate'>
                {userData?.email}
              </p>
            </div>

          </div>


          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>

            <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-xs uppercase tracking-widest text-slate-400'>Orders</p>
              <p className='text-2xl font-semibold text-teal-200 mt-1'>
                {loading ? '–' : stats.totalOrders}
              </p>
            </div>

            <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-xs uppercase tracking-widest text-slate-400'>Total Products</p>
              <p className='text-2xl font-semibold text-teal-200 mt-1'>
                {loading ? '–' : stats.totalProducts}
              </p>
            </div>

            <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-xs uppercase tracking-widest text-slate-400'>Total Spent</p>
              <p className='text-2xl font-semibold text-teal-200 mt-1'>
                {loading ? '–' : `${currency}${stats.totalSpent.toLocaleString('en-IN')}`}
              </p>
            </div>

          </div>

        </div>


        {/* DELIVERY / PERSONAL INFORMATION */}

        <div className={cardClass}>

          {topLine}

          <div className='flex items-start justify-between gap-4 mb-2'>

            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-teal-300/70 mb-1'>
                {isSaved ? 'Saved' : 'Not saved yet'}
              </p>
              <Title text1={'DELIVERY'} text2={'INFORMATION'} />
            </div>

            {isSaved && !editing && (
              <button
                type='button'
                onClick={() => setEditing(true)}
                className='px-5 py-2 rounded-full border border-teal-400/40 text-teal-100 text-sm font-medium hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300'
              >
                Edit
              </button>
            )}

          </div>


          {loading ? (

            <p className='text-slate-400 text-sm mt-6'>Loading...</p>

          ) : showForm ? (

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 mt-6'>

              {!isSaved && (
                <p className='text-sm text-slate-400'>
                  Save your personal details once and they will be filled in automatically when you place an order.
                </p>
              )}

              <div className='flex flex-col sm:flex-row gap-4'>
                <input type='text' name='firstName' placeholder='First name' required className={inputClass} value={formData.firstName} onChange={onChangeHandler} />
                <input type='text' name='lastName' placeholder='Last name' required className={inputClass} value={formData.lastName} onChange={onChangeHandler} />
              </div>

              <input type='email' name='email' placeholder='Email address' required className={inputClass} value={formData.email} onChange={onChangeHandler} />

              <input type='text' name='street' placeholder='Street' required className={inputClass} value={formData.street} onChange={onChangeHandler} />

              <div className='flex flex-col sm:flex-row gap-4'>
                <input type='text' name='city' placeholder='City' required className={inputClass} value={formData.city} onChange={onChangeHandler} />
                <input type='text' name='state' placeholder='State' required className={inputClass} value={formData.state} onChange={onChangeHandler} />
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <input type='text' name='pinCode' placeholder='Pincode' required className={inputClass} value={formData.pinCode} onChange={onChangeHandler} />
                <input type='text' name='country' placeholder='Country' required className={inputClass} value={formData.country} onChange={onChangeHandler} />
              </div>

              <input type='text' name='phone' placeholder='Phone' required className={inputClass} value={formData.phone} onChange={onChangeHandler} />

              <div className='flex justify-end gap-3 mt-2'>

                {editing && (
                  <button
                    type='button'
                    disabled={saving}
                    onClick={() => setEditing(false)}
                    className='px-6 py-2.5 rounded-full border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors disabled:opacity-50'
                  >
                    Cancel
                  </button>
                )}

                <button
                  type='submit'
                  disabled={saving}
                  className='px-8 py-2.5 rounded-full bg-teal-400 text-[#0a1520] text-sm font-semibold hover:bg-teal-300 transition-colors disabled:opacity-60'
                >
                  {saving ? 'Saving...' : 'SAVE'}
                </button>

              </div>

            </form>

          ) : (

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6'>

              {Object.keys(FIELD_LABELS).map((key) => (

                <div key={key} className={key === 'street' || key === 'email' ? 'sm:col-span-2' : ''}>
                  <p className='text-xs uppercase tracking-widest text-slate-500'>{FIELD_LABELS[key]}</p>
                  <p className='text-slate-100 text-sm sm:text-base mt-0.5 break-words'>{formData[key]}</p>
                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  )

}

export default Profile
