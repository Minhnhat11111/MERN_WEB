import React, { useEffect, useState } from 'react'
import Rating from './star'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const Ratings = [
    {
        title: '1 - Fair',
        value: 1,
    },
    {
        title: '2 - Good',
        value: 2,
    },
    {
        title: '3 - Very Good',
        value: 3,
    },
    {
        title: '4 - Excellent',
        value: 4,
    },
    {
        title: '5 - Masterpiece',
        value: 5,
    },
]

function ReviewPage() {
    const navigate = useNavigate()
    const [selectRating, setSelectRating] = useState(5)
    const [comment, setComment] = useState('')
    const { isAuthenticated, getToken } = useAuth();
    const [totalReviews, setTotalReviews] = useState(null)
    const [totalRating, setTotalRating] = useState(0)
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        axios.get("http://localhost:4000/api/review")
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get("http://localhost:4000/api/review")
            .then(res => {
                setTotalReviews(res.data.totalReviews)
                setTotalRating(res.data.totalRating)
                setReviews(res.data.reviews)
            })
            .catch(err => console.log(err))
    }

    const handleReview = () => {

        if (!isAuthenticated()) {
            toast.error('Vui lòng đăng nhập để bình luận.');
            setTimeout(() => {

                navigate('/login');
            }, 1000)
            return;
        }


        if (!comment) {
            toast.error("Hãy để lại bình luận.");
            return
        }

        const token = getToken();
        if (!token) {
            toast.error('Không tìm thấy token xác thực');
            return;
        }

        axios.post("http://localhost:4000/api/review",
            {
                rating: selectRating,
                comment,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(res => {
                console.log(res)
                if (!res.data.success) {
                    toast.error(res.data.message);
                    return;
                }
                toast.success('Bình luận thành công.');
                setSelectRating(5)
                setComment("")
                fetchData()
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='min-h-[600px] pl-[3vw] pr-[2vw] pt-[1vw] pb-[1vw] flex gap-[100px] mt-10'>
            <div className='w-1/2'>
                <h1 className="font-[Italianno,serif] text-6xl">Bạn cảm thấy nhà hàng tôi như thế nào ?</h1>
                <div className='text-sm w-full mt-10'>
                    <select value={selectRating} onChange={e => setSelectRating(e.target.value)} className='w-full mt-2 px-6 py-4 border-none outline-none rounded text-black'>
                        {
                            Ratings.map((item, index) => (
                                <option key={index} value={item.value}>{item.title}</option>
                            ))
                        }
                    </select>
                    <div className='flex mt-4 text-lg gap-2 text-star'>
                        <Rating value={selectRating} />
                    </div>
                </div>
                <div className='text-sm w-full mt-10'>
                    <label className='text-border font-semibold text-xl'>Viết bình luận</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} className='w-full h-40 mt-2 p-6 rounded outline-none text-black' placeholder='Hãy viết cảm nhận tại đây....'></textarea>
                </div>
                <button className='border-[#EDE9D2] border text-[#EDE9D2] py-3 w-full rounded mt-10' onClick={handleReview}>Đánh giá</button>
            </div>
            <div className='w-1/2'>
                {
                    totalReviews != null &&
                    <div className='flex gap-10'>
                        <h1 className="font-[Italianno,serif] text-6xl">Tewaiseuu</h1>
                        <div className='flex items-center gap-1 text-3xl'>
                            {totalReviews !== 0 && <h1>{(totalRating / totalReviews).toFixed(1)}</h1>}
                            {totalReviews !== 0 && <FaStar className='text-yellow-400' />}
                            {totalReviews === 0 && <h1>Chưa có ai bình luận.</h1>}
                        </div>

                    </div>
                }
                {
                    reviews && reviews[0] &&
                    <div className='bg-white mt-10 text-black rounded-md p-4'>
                        {
                            reviews.map((review, index) => (
                                <div key={index} className='mt-2'>
                                    <div className='flex items-center gap-4'>
                                        <h2 className='min-w-[100px]'>{review.userId.name}</h2>
                                        <div className='flex gap-1'><Rating value={review.rating} /></div>
                                    </div>
                                    <h2 className='pl-[116px]'>{review.comment}</h2>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default ReviewPage