import React from 'react'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] flex flex-col items-center justify-start py-6 gap-14'>

      <div className='w-full flex flex-col items-center justify-center gap-3'>
        <LatestCollection />
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-3'>
        <BestSeller />
      </div>

    </div>
  )
}

export default Product
