import React from 'react'
import Title from '../components/Title'
import about from '../assets/about.jpg'
import NewLetterBox from '../components/NewLetterBox'

function About() {
  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] pt-24 pb-20 px-4 sm:px-8 lg:px-16 flex flex-col items-center gap-16'>

      <div className='flex flex-col items-center gap-3 text-center'>
        <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Our Story</span>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16'>
        <div className='w-full lg:w-1/2 flex justify-center'>
          <div className='relative w-4/5 sm:w-3/5 lg:w-full max-w-md'>
            <div className='absolute -inset-2 rounded-2xl bg-gradient-to-r from-teal-400/20 via-cyan-300/10 to-emerald-400/20 blur-xl' />
            <img
              src={about}
              alt="Inside the OneCart studio"
              className='relative w-full rounded-2xl shadow-xl shadow-black/40 border border-white/10'
            />
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex flex-col items-start gap-5 text-slate-300'>
          <p className='text-sm sm:text-base leading-relaxed'>
            OneCart was born for smart, seamless shopping — created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, OneCart makes online shopping simple, satisfying, and stress-free.
          </p>
          <p className='text-sm sm:text-base leading-relaxed'>
            Built for modern shoppers — combining style, convenience, and affordability. Whether it's fashion, essentials, or trends, we bring everything you need to one trusted platform with fast delivery, easy returns, and a customer-first experience you'll love.
          </p>
          <div className='w-full pt-2'>
            <p className='text-base sm:text-lg font-semibold text-teal-300 mb-2'>Our Mission</p>
            <p className='text-sm sm:text-base leading-relaxed'>
              To redefine online shopping by delivering quality, affordability, and convenience. OneCart connects customers with trusted products and brands, offering a seamless, customer-focused experience that saves time, adds value, and fits every lifestyle.
            </p>
          </div>
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col items-center gap-8'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>The Difference</span>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[
            { title: 'Quality Assurance', text: 'We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction, always.' },
            { title: 'Convenience', text: 'Shop easily with fast delivery, simple navigation, secure checkout, and everything you need in one place.' },
            { title: 'Exceptional Support', text: 'Our dedicated team ensures quick responses, helpful solutions, and a smooth shopping experience every time.' },
          ].map((card, i) => (
            <div
              key={i}
              className='group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:shadow-[0_10px_30px_-12px_rgba(45,212,191,0.4)]'
            >
              <div className='absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity' />
              <b className='text-lg sm:text-xl font-semibold text-teal-200'>{card.title}</b>
              <p className='text-sm sm:text-base text-slate-300 leading-relaxed'>{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      <NewLetterBox />
    </div>
  )
}

export default About
