import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'

function Card({
    name,
    image,
    id,
    price,
    rating,
    bestseller = false,
    showBestsellerBadge = false
}) {

    let { currency } = useContext(shopDataContext)

    let navigate = useNavigate()

    return (

        <div
            className='
                w-[300px]
                max-w-[90%]
                h-auto
                min-h-[470px]
                bg-[#ffffff0a]
                backdrop-blur-lg
                rounded-lg
                hover:scale-[102%]
                flex
                items-start
                justify-start
                flex-col
                p-[10px]
                cursor-pointer
                border-[1px]
                border-[#80808049]
                transition-transform
                duration-200
            '
            onClick={() => navigate(`/productdetail/${id}`)}
        >

            {/* Product Image */}

            <div className='relative w-full'>

                <img
                    src={image}
                    alt={name}
                    className='
                        w-full
                        h-[350px]
                        rounded-sm
                        object-cover
                        flex-shrink-0
                    '
                />

                {/* ==========================================
                    BESTSELLER BADGE
                    Shows ONLY when the parent enables it
                    ========================================== */}

                {showBestsellerBadge && bestseller && (

                    <div
                        className='
                                absolute
                                top-0
                                
                                bg-teal-400
                                text-white
                                px-2
                                py-1
                                rounded-md
                                text-sm
                                sm:text-base
                                font-bold
                                shadow-md
                                leading-none
                                z-10
                           '
                    >
                        Bestseller
                    </div>

                )}

                {/* Overall Rating */}

                {Number(rating || 0) > 0 && (

                    <div
                        className='
                            absolute
                            bottom-2
                            left-2
                            bg-white
                            rounded-md
                            px-2
                            py-1
                            flex
                            items-center
                            gap-1
                            shadow-md
                        '
                    >

                        <span
                            className='
                                text-[16px]
                                font-medium
                                text-gray-800
                            '
                        >
                            {Number(rating).toFixed(1)}
                        </span>

                        <FaStar
                            className='
                                text-green-600
                                text-[15px]
                            '
                        />

                    </div>

                )}

            </div>


            {/* Product Name */}

            <div
                className='
                    w-full
                    text-[#c3f6fa]
                    text-[18px]
                    py-[10px]
                    break-words
                '
            >
                {name}
            </div>


            {/* Price */}

            <div
                className='
                    w-full
                    text-[#f3fafa]
                    text-[14px]
                    pb-[5px]
                '
            >
                {currency} {price}
            </div>

        </div>

    )

}

export default Card