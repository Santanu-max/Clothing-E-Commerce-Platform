import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../components/CartTotal';

function Cart() {
  const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext)
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-20 px-4 sm:px-8 lg:px-16'>

      <div className='text-center mb-10 flex flex-col items-center gap-3'>
        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Review & Checkout</span>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='w-full flex flex-col items-center justify-center gap-3 py-24 text-center'>
          <p className='text-lg sm:text-xl text-slate-200 font-medium'>Your cart is empty</p>
          <p className='text-sm sm:text-base text-slate-400'>Add something you love and it'll show up here.</p>
          <button
            onClick={() => navigate('/collections')}
            className='mt-4 px-6 py-3 rounded-full border border-teal-400/40 text-teal-100 text-sm sm:text-base font-medium tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300'
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className='w-full max-w-4xl mx-auto flex flex-col gap-4'>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            const name = productData?.name ?? 'Item unavailable'
            const price = productData?.price ?? '—'
            const image = productData?.image1

            return (
              <div
                key={index}
                className='group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 transition-all duration-300 hover:border-teal-300/30'
              >
                <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-50 group-hover:opacity-90 transition-opacity' />

                {image ? (
                  <img
                    className='w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10'
                    src={image}
                    alt={name}
                  />
                ) : (
                  <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[10px] text-slate-400 text-center px-2'>
                    No image
                  </div>
                )}

                <div className='flex flex-col gap-2 flex-1 min-w-[140px]'>
                  <p className='text-base sm:text-lg text-slate-100 font-medium'>{name}</p>
                  <div className='flex items-center gap-3'>
                    <p className='text-sm sm:text-base text-teal-300 font-semibold'>{currency} {price}</p>
                    <span className='w-9 h-9 text-sm text-slate-100 bg-white/5 rounded-md flex items-center justify-center border border-white/10'>
                      {item.size}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-4 ml-auto'>
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className='w-16 sm:w-20 px-2 py-2 text-center text-slate-100 text-base font-semibold bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-teal-300/50'
                    onChange={(e) => (e.target.value === ' ' || e.target.value === '0') ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                  />
                  <button aria-label="Remove item" onClick={() => updateQuantity(item._id, item.size, 0)}>
                    <RiDeleteBin6Line className='text-slate-400 hover:text-red-400 w-5 h-5 transition-colors' />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className='w-full flex justify-center lg:justify-end mt-16'>
        <div className='w-full sm:w-[420px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6'>
          <CartTotal />
          <button
            className='w-full mt-6 text-sm sm:text-base font-medium tracking-wide py-3 rounded-full border border-teal-400/40 text-teal-100 hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 flex items-center justify-center gap-2'
            onClick={() => {
              if (cartData.length > 0) {
                navigate("/placeorder");
              }
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>

    </div>
  )
}

export default Cart
