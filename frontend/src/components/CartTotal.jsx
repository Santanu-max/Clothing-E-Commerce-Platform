import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'

function CartTotal() {
  const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext)

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      {/* rounded-2xl + overflow-hidden keeps this flush inside whatever
          card it's dropped into, instead of spilling past the edges */}
      <div className='w-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/10 overflow-hidden'>
        <div className='flex justify-between items-center text-slate-300 text-sm sm:text-base px-5 py-4'>
          <p>Subtotal</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>

        <div className='flex justify-between items-center text-slate-300 text-sm sm:text-base px-5 py-4'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee}</p>
        </div>

        <div className='flex justify-between items-center text-slate-100 text-base sm:text-lg font-semibold px-5 py-4'>
          <p>Total</p>
          <p className='text-teal-300'>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
