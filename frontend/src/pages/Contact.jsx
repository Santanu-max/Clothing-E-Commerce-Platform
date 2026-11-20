import React from 'react'
import Title from '../components/Title'
import contact from "../assets/contact.jpg"
import NewLetterBox from '../components/NewLetterBox'

function Contact() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-20 px-4 sm:px-8 lg:px-16 flex flex-col items-center gap-16'>

      <div className='flex flex-col items-center gap-3 text-center'>
        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Get In Touch</span>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16'>
        <div className='w-full lg:w-1/2 flex justify-center'>
          <div className='relative w-4/5 sm:w-3/5 lg:w-full max-w-md'>
            <div className='absolute -inset-2 rounded-2xl bg-gradient-to-r from-teal-400/20 via-cyan-300/10 to-emerald-400/20 blur-xl' />
            <img
              src={contact}
              alt="OneCart support desk"
              className='relative w-full rounded-2xl shadow-xl shadow-black/40 border border-white/10'
            />
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex flex-col items-start gap-6'>
          <div className='rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 w-full'>
            <p className='text-base sm:text-lg font-semibold text-teal-300 mb-3'>Our Store</p>
            <div className='text-sm sm:text-base text-slate-300 leading-relaxed space-y-1'>
              <p>12345 Random Station</p>
              <p>Random City, State, India</p>
            </div>
            <div className='text-sm sm:text-base text-slate-300 leading-relaxed space-y-1 mt-4'>
              <p>Tel: +91-9876543210</p>
              <p>Email: admin@onecart.com</p>
            </div>
          </div>
        </div>
      </div>

      <NewLetterBox />
    </div>
  )
}

export default Contact
