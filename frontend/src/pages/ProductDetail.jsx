import React, {
    useContext,
    useEffect,
    useState
} from 'react'

import {
    useParams
} from 'react-router-dom'

import {
    shopDataContext
} from '../context/ShopContext'

import {
    FaStar,
    FaStarHalfAlt
} from "react-icons/fa"

import RelatedProduct
    from '../components/RelatedProduct'

import Loading
    from '../components/Loading'

import axios
    from 'axios'


function ProductDetail() {

    let { productId } = useParams()


    let {
        products,
        currency,
        addtoCart,
        loading
    } = useContext(shopDataContext)


    let [productData, setProductData] =
        useState(false)


    const [image, setImage] =
        useState('')


    const [image1, setImage1] =
        useState('')


    const [image2, setImage2] =
        useState('')


    const [image3, setImage3] =
        useState('')


    const [image4, setImage4] =
        useState('')


    const [size, setSize] =
        useState('')


    // =====================================================
    // REVIEW STATES
    // =====================================================

    const [reviews, setReviews] =
        useState([])


    const [reviewLoading, setReviewLoading] =
        useState(false)


    const [showAllReviews, setShowAllReviews] =
        useState(false)


    // =====================================================
    // FETCH PRODUCT
    // =====================================================

    const fetchProductData = async () => {

        products.map((item) => {

            if (item._id === productId) {

                setProductData(item)

                setImage1(item.image1)

                setImage2(item.image2)

                setImage3(item.image3)

                setImage4(item.image4)

                setImage(item.image1)

                return null

            }

            return null

        })

    }


    useEffect(() => {

        fetchProductData()

    }, [
        productId,
        products
    ])


    // =====================================================
    // FETCH REVIEWS
    // =====================================================

    const fetchReviews = async () => {

        try {

            setReviewLoading(true)


            const result =
                await axios.get(
                    `/api/review/${productId}`
                )


            if (result.data.success) {

                setReviews(
                    result.data.reviews || []
                )

            }

        } catch (error) {

            console.log(
                "Fetch Reviews Error:",
                error
            )

        } finally {

            setReviewLoading(false)

        }

    }


    useEffect(() => {

        if (productId) {

            fetchReviews()

        }

    }, [productId])


    // =====================================================
    // RENDER STARS
    // =====================================================

    const renderStars = (rating) => {

        let stars = []

        let numericRating =
            Number(rating) || 0


        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            if (
                numericRating >= i
            ) {

                stars.push(

                    <FaStar
                        key={i}
                        className='text-lg text-amber-400'
                    />

                )

            } else if (
                numericRating >=
                i - 0.5
            ) {

                stars.push(

                    <FaStarHalfAlt
                        key={i}
                        className='text-lg text-amber-400'
                    />

                )

            } else {

                stars.push(

                    <FaStar
                        key={i}
                        className='text-lg text-slate-600'
                    />

                )

            }

        }


        return stars

    }


    const thumbs = [
        image1,
        image2,
        image3,
        image4
    ].filter(Boolean)


    return productData ? (

        <div className='w-full overflow-x-hidden bg-gradient-to-br from-[#0a121a] via-[#0d1b24] to-[#0a1520]'>


            {/* ================================================= */}
            {/* PRODUCT SECTION */}
            {/* ================================================= */}

            <div className='w-full min-h-screen pt-24 pb-16 px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-14'>


                {/* ================================================= */}
                {/* PRODUCT IMAGES */}
                {/* ================================================= */}

                <div className='w-full lg:w-1/2 flex flex-col-reverse lg:flex-row items-center lg:items-start gap-4 lg:gap-5'>


                    <div className='flex lg:flex-col flex-row items-center justify-center gap-3 flex-wrap lg:flex-nowrap'>


                        {thumbs.map(
                            (thumb, i) => (

                                <button
                                    key={i}
                                    onClick={() =>
                                        setImage(thumb)
                                    }
                                    className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border transition-colors ${
                                        image === thumb
                                            ? 'border-teal-300/70'
                                            : 'border-white/10 hover:border-teal-300/40'
                                    }`}
                                >

                                    <img
                                        src={thumb}
                                        alt={`${productData.name} thumbnail ${i + 1}`}
                                        className='w-full h-full object-cover'
                                    />

                                </button>

                            )
                        )}

                    </div>


                    <div className='relative w-full max-w-md lg:max-w-none lg:flex-1 aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]'>

                        <img
                            src={image}
                            alt={productData.name}
                            className='w-full h-full object-cover'
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* PRODUCT INFORMATION */}
                {/* ================================================= */}

                <div className='w-full lg:w-1/2 flex flex-col items-start gap-4'>


                    <span className='text-xs sm:text-sm tracking-[0.35em] uppercase text-teal-300/70'>

                        {productData.category}

                        {productData.subCategory
                            ? ` · ${productData.subCategory}`
                            : ''
                        }

                    </span>


                    <h1 className='text-3xl sm:text-4xl font-bold text-slate-100'>

                        {productData.name.toUpperCase()}

                    </h1>


                    {/* PRODUCT RATING */}

                    <div className='flex items-center gap-1'>

                        {renderStars(
                            productData.rating || 0
                        )}


                        <p className='text-sm font-medium pl-2 text-slate-300'>

                            ({productData.numReviews || 0})

                        </p>

                    </div>


                    <p className='text-2xl sm:text-3xl font-semibold text-teal-300'>

                        {currency} {productData.price}

                    </p>


                    <p className='w-full sm:w-4/5 text-sm sm:text-base text-slate-300 leading-relaxed'>

                        {productData.description}

                    </p>


                    {/* SIZE */}

                    <div className='flex flex-col gap-3 my-2 w-full'>


                        <p className='text-base sm:text-lg font-semibold text-slate-100'>

                            Select Size

                        </p>


                        <div className='flex gap-2 flex-wrap'>

                            {productData.sizes.map(
                                (item, index) => (

                                    <button
                                        key={index}
                                        className={`px-4 py-2 rounded-lg border text-sm sm:text-base font-medium transition-colors ${
                                            item === size
                                                ? 'bg-teal-400 text-[#0a1520] border-teal-400'
                                                : 'bg-white/5 border-white/10 text-slate-200 hover:border-teal-300/40'
                                        }`}
                                        onClick={() =>
                                            setSize(item)
                                        }
                                    >

                                        {item}

                                    </button>

                                )
                            )}

                        </div>


                        <button
                            className='mt-2 px-8 py-3 rounded-full border border-teal-400/40 text-teal-100 text-sm sm:text-base font-medium tracking-wide hover:bg-teal-400 hover:text-[#0a1520] transition-colors duration-300 w-fit'
                            onClick={() =>
                                addtoCart(
                                    productData._id,
                                    size
                                )
                            }
                        >

                            {loading
                                ? <Loading />
                                : "Add to Cart"
                            }

                        </button>

                    </div>


                    <div className='w-full h-[1px] bg-white/10 my-1'></div>


                    <div className='text-sm text-slate-400 flex flex-col gap-1'>

                        <p>
                            100% original product.
                        </p>

                        <p>
                            Cash on delivery is available on this product.
                        </p>

                        <p>
                            Easy return and exchange policy within 7 days.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* DESCRIPTION + REVIEWS */}
            {/* ================================================= */}

            <div className='w-full min-h-[60vh] pb-20 px-4 sm:px-8 lg:px-16 flex flex-col items-start gap-6'>


                {/* TABS */}

                <div className='flex gap-3'>

                    <p className='px-5 py-3 text-sm rounded-full border border-teal-300/40 text-teal-200 bg-white/5'>

                        Description

                    </p>


                    <p className='px-5 py-3 text-sm rounded-full border border-white/10 text-slate-300'>

                        Reviews ({productData.numReviews || 0})

                    </p>

                </div>


                {/* DESCRIPTION */}

                <div className='w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8'>

                    <p className='text-sm sm:text-base text-slate-300 leading-relaxed'>

                        {productData.description}

                    </p>

                </div>


                {/* ================================================= */}
                {/* REVIEWS */}
                {/* ================================================= */}

                <div className='w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8'>


                    <div className='flex flex-col gap-6'>


                        {/* ================================================= */}
                        {/* OVERALL RATING */}
                        {/* ================================================= */}

                        <div>

                            <h2 className='text-2xl font-bold text-slate-100'>

                                Customer Reviews

                            </h2>


                            <div className='flex flex-wrap items-center gap-3 mt-2'>


                                <div className='flex items-center gap-1'>

                                    {renderStars(
                                        productData.rating || 0
                                    )}

                                </div>


                                <span className='text-slate-300'>

                                    {Number(
                                        productData.rating || 0
                                    ).toFixed(1)}

                                    {" "}out of 5

                                </span>


                                <span className='text-slate-500'>

                                    ({productData.numReviews || 0} reviews)

                                </span>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* LATEST 5 REVIEWS */}
                        {/* ================================================= */}

                        <div className='border-t border-white/10 pt-6'>


                            <h3 className='text-lg font-semibold text-slate-100 mb-5'>

                                Latest Reviews

                            </h3>


                            {reviewLoading ? (

                                <p className='text-sm text-slate-400'>

                                    Loading reviews...

                                </p>

                            ) : reviews.length === 0 ? (

                                <p className='text-sm text-slate-400'>

                                    No reviews yet.

                                </p>

                            ) : (

                                <div className='flex flex-col gap-5'>


                                    {reviews
                                        .slice(0, 5)
                                        .map(
                                            (review) => (

                                                <div
                                                    key={review._id}
                                                    className='border-b border-white/10 pb-5 last:border-b-0'
                                                >


                                                    <div className='flex items-center justify-between gap-4'>


                                                        <div>

                                                            <p className='font-semibold text-slate-200'>

                                                                {review.user?.name || "User"}

                                                            </p>


                                                            <div className='flex items-center gap-1 mt-1'>

                                                                {renderStars(
                                                                    review.rating
                                                                )}

                                                            </div>

                                                        </div>


                                                        <p className='text-xs text-slate-500'>

                                                            {review.createdAt
                                                                ? new Date(
                                                                    review.createdAt
                                                                ).toLocaleDateString()
                                                                : ''
                                                            }

                                                        </p>

                                                    </div>


                                                    <p className='text-sm text-slate-300 leading-relaxed mt-3'>

                                                        {review.comment}

                                                    </p>

                                                </div>

                                            )
                                        )}

                                </div>

                            )}


                            {/* ================================================= */}
                            {/* VIEW ALL BUTTON */}
                            {/* ================================================= */}

                            {reviews.length > 5 && (

                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowAllReviews(true)
                                    }
                                    className='mt-6 px-6 py-3 rounded-full border border-teal-400/40 text-teal-200 text-sm font-medium hover:bg-teal-400 hover:text-[#0a1520] transition-colors'
                                >

                                    View All Reviews

                                </button>

                            )}

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* RELATED PRODUCTS */}
                {/* ================================================= */}

                <RelatedProduct
                    category={
                        productData.category
                    }
                    subCategory={
                        productData.subCategory
                    }
                    currentProductId={
                        productData._id
                    }
                />

            </div>


            {/* ================================================= */}
            {/* ALL REVIEWS MODAL */}
            {/* ================================================= */}

            {showAllReviews && (

                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>


                    <div className='w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b24] shadow-2xl'>


                        {/* HEADER */}

                        <div className='flex items-center justify-between px-6 py-5 border-b border-white/10'>


                            <div>

                                <h2 className='text-xl sm:text-2xl font-bold text-slate-100'>

                                    All Reviews

                                </h2>


                                <p className='text-sm text-slate-400 mt-1'>

                                    {reviews.length}

                                    {' '}

                                    review
                                    {reviews.length !== 1
                                        ? 's'
                                        : ''
                                    }

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowAllReviews(
                                        false
                                    )
                                }
                                className='text-2xl text-slate-400 hover:text-white'
                            >

                                ×

                            </button>

                        </div>


                        {/* REVIEWS */}

                        <div className='max-h-[65vh] overflow-y-auto px-6 py-5'>


                            {reviews.length === 0 ? (

                                <p className='text-sm text-slate-400'>

                                    No reviews yet.

                                </p>

                            ) : (

                                <div className='flex flex-col gap-6'>


                                    {reviews.map(
                                        (review) => (

                                            <div
                                                key={review._id}
                                                className='border-b border-white/10 pb-5 last:border-b-0'
                                            >


                                                <div className='flex items-start justify-between gap-4'>


                                                    <div>

                                                        <p className='font-semibold text-slate-200'>

                                                            {review.user?.name || "User"}

                                                        </p>


                                                        <div className='flex items-center gap-1 mt-1'>

                                                            {renderStars(
                                                                review.rating
                                                            )}

                                                        </div>

                                                    </div>


                                                    <p className='text-xs text-slate-500'>

                                                        {review.createdAt
                                                            ? new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString()
                                                            : ''
                                                        }

                                                    </p>

                                                </div>


                                                <p className='text-sm text-slate-300 leading-relaxed mt-3'>

                                                    {review.comment}

                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    ) : (

        <div className='opacity-0'></div>

    )

}

export default ProductDetail