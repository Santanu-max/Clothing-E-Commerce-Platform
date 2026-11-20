import React from 'react'
import Title from './Title'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

const POLICIES = [
  {
    icon: RiExchangeFundsLine,
    title: 'Easy Exchange Policy',
    text: 'Exchange Made Easy – Quick, Simple, and Customer-Friendly Process.',
  },
  {
    icon: TbRosetteDiscountCheckFilled,
    title: '7 Days Return Policy',
    text: 'Shop with Confidence – 7 Days Easy Return Guarantee.',
  },
  {
    icon: BiSupport,
    title: 'Best Customer Support',
    text: 'Trusted Customer Support – Your Satisfaction Is Our Priority.',
  },
]

function OurPolicy() {
  return (
    // w-full (NOT w-[100vw]) so the section stays inside its parent container
    // and no longer gets pushed to the right. Height is automatic.
    <section className='w-full rounded-2xl bg-gradient-to-l from-[#141414] to-[#0c2025] py-12 md:py-16 px-4 sm:px-8 flex flex-col items-center gap-10 md:gap-14'>

      <div className='w-full text-center flex flex-col items-center gap-2'>
        <Title text1={"OUR"} text2={"POLICY"} />
        <p className='max-w-2xl text-[13px] md:text-[18px] px-2 text-blue-100'>
          Customer-Friendly Policies – Committed to Your Satisfaction and Safety.
        </p>
      </div>

      <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8'>
        {POLICIES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className='flex flex-col items-center text-center gap-3 px-2'
          >
            <Icon className='w-[40px] h-[40px] md:w-[56px] md:h-[56px] text-[#90b9ff]' />
            <p className='font-semibold text-[18px] md:text-[22px] text-[#a5e8f7]'>
              {title}
            </p>
            <p className='font-medium text-[13px] md:text-[16px] text-[aliceblue] max-w-xs'>
              {text}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}

export default OurPolicy
