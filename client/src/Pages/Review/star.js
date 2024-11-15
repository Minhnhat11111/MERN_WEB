import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

export default function Rating({ value }) {
    return (
        <>
            <span>
                {
                    value >= 1 ? <FaStar className='text-yellow-400' /> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />
                }
            </span>
            <span>
                {
                    value >= 2 ? <FaStar className='text-yellow-400' /> : <FaRegStar />
                }
            </span>
            <span>
                {
                    value >= 3 ? <FaStar className='text-yellow-400' /> : <FaRegStar />
                }
            </span>
            <span>
                {
                    value >= 4 ? <FaStar className='text-yellow-400' /> : <FaRegStar />
                }
            </span>
            <span>
                {
                    value >= 5 ? <FaStar className='text-yellow-400' /> : <FaRegStar />
                }
            </span>
        </>
    )
}
