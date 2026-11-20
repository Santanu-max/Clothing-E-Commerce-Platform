import React, { useContext } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import upload from '../assets/upload image.jpg'
import { useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function Add() {
  let [image1, setImage1] = useState(false)
  let [image2, setImage2] = useState(false)
  let [image3, setImage3] = useState(false)
  let [image4, setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Men")
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState("TopWear")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)
  let { serverUrl } = useContext(authDataContext)

  const handleAddProduct = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      let formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("image1", image1)
      formData.append("image2", image2)
      formData.append("image3", image3)
      formData.append("image4", image4)

      let result = await axios.post(serverUrl + "/api/product/addproduct", formData, { withCredentials: true })

      console.log(result.data)
      toast.success("ADD Product Successfully")
      setLoading(false)

      if (result.data) {
        setName("")
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice("")
        setBestSeller(false)
        setCategory("Men")
        setSubCategory("TopWear")
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error("Add Product Failed")
    }
  }

  const inputClass = 'w-full h-12 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 px-4 text-sm sm:text-base text-slate-100 outline-none focus:border-teal-300/50 transition-colors'
  const selectClass = 'w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-black outline-none focus:border-teal-300/50 transition-colors'
  const sectionLabel = 'text-sm uppercase tracking-wider text-teal-300 mb-3'
  const fieldLabel = 'text-xs uppercase tracking-wide text-slate-400 mb-2 block'

  const sizeOptions = ["S", "M", "L", "XL", "XXL"]
  const imageSlots = [
    { state: image1, setter: setImage1, id: 'image1' },
    { state: image2, setter: setImage2, id: 'image2' },
    { state: image3, setter: setImage3, id: 'image3' },
    { state: image4, setter: setImage4, id: 'image4' },
  ]

  return (
    <div className='w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520] text-white'>
      <Nav />
      <Sidebar />

      <div className='sm:ml-[64px] md:ml-[170px] lg:ml-[220px] pt-24 pb-20 px-4 sm:px-8 lg:px-10 flex flex-col items-center'>

        <div className='w-full max-w-3xl flex flex-col items-center text-center gap-1 mb-10'>
          <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>Inventory</span>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-100'>Add Product</h1>
          <p className='text-sm text-slate-400 mt-1'>Fill in the details below to list a new product.</p>
        </div>

        <form onSubmit={handleAddProduct} className='flex flex-col gap-8 w-full max-w-3xl'>

          {/* Images */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden">
  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70" />

  <p className={`${sectionLabel} mb-4 text-center`}>
    Upload Images
  </p>

  <div className="grid grid-cols-4 gap-10 max-w-md mx-auto">
    {imageSlots.map(({ state, setter, id }, i) => (
      <label
        key={id}
        htmlFor={id}
        className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-teal-300/40 transition-colors relative"
      >
        <img
          src={!state ? upload : URL.createObjectURL(state)}
          alt="Upload preview"
          className="w-full h-full object-cover"
        />

        <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-slate-300 rounded px-1.5 py-0.5">
          {i + 1}
        </span>

        <input
          type="file"
          id={id}
          hidden
          onChange={(e) => setter(e.target.files[0])}
          required
        />
      </label>
    ))}
  </div>
</div>

          {/* Basic info */}
          <div className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden flex flex-col gap-6'>
            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />
            <p className={sectionLabel}>Product Details</p>

            <div>
              <label className={fieldLabel}>Product Name</label>
              <input
                type="text" placeholder='e.g. Stylish Jacket' className={inputClass}
                onChange={(e) => setName(e.target.value)} value={name} required
              />
            </div>

            <div>
              <label className={fieldLabel}>Description</label>
              <textarea
                placeholder='A short, clear description customers will see on the product page'
                className='w-full h-28 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 px-4 py-3 text-sm sm:text-base text-slate-100 outline-none focus:border-teal-300/50 transition-colors resize-none'
                onChange={(e) => setDescription(e.target.value)} value={description} required
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
              <div>
                <label className={fieldLabel}>Category</label>
                <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Sub-Category</label>
                <select className={selectClass} value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                  <option value="TopWear">TopWear</option>
                  <option value="BottomWear">BottomWear</option>
                  <option value="WinterWear">WinterWear</option>
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Price</label>
                <input
                  type="number" placeholder='₹ 2000' className={inputClass}
                  onChange={(e) => setPrice(e.target.value)} value={price} required
                />
              </div>
            </div>
          </div>

          {/* Sizes + bestseller */}
          <div className='relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 overflow-hidden flex flex-col gap-6'>
            <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 opacity-70' />

            <div>
  <p className={`${sectionLabel} mb-3 text-center`}>Available Sizes</p>

  <div className="flex items-center justify-center gap-10 flex-wrap">
    {sizeOptions.map((s) => (
      <button
        type="button"
        key={s}
        onClick={() =>
          setSizes((prev) =>
            prev.includes(s)
              ? prev.filter((item) => item !== s)
              : [...prev, s]
          )
        }
        className={`w-14 h-11 rounded-lg border text-sm font-medium transition-colors ${
          sizes.includes(s)
            ? 'bg-teal-400 text-[#0a1520] border-teal-400'
            : 'bg-white/5 border-white/10 text-slate-200 hover:border-teal-300/40'
        }`}
      >
        {s}
      </button>
    ))}
  </div>
</div>

            <div className='h-px bg-white/10' />

            <label htmlFor="checkbox" className='flex items-center justify-between cursor-pointer w-full'>
              <span className='text-sm sm:text-base font-medium text-slate-200'>Add to Bestseller</span>
              <input type="checkbox" id='checkbox' className='w-5 h-5 accent-teal-400 cursor-pointer' onChange={() => setBestSeller(prev => !prev)} />
            </label>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full sm:w-fit self-center px-12 py-3.5 rounded-full border border-teal-400/40 text-teal-100 text-sm sm:text-base font-semibold tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60'
          >
            {loading ? <Loading /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Add
