// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalRating, setTotalRating] = useState(0);

    // Lấy dữ liệu review khi component mount
    useEffect(() => {
        fetchReviews();
    }, []);

    // Hàm lấy dữ liệu reviews
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/review');
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalReviews);
            setTotalRating(response.data.totalRating);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="admin-reviews">
            <h1>Danh sách đánh giá</h1>
            <div className="summary">
                <h2>Tổng số đánh giá: {totalReviews}</h2>
                <h3>Điểm trung bình: {(totalRating / totalReviews).toFixed(1)}</h3>
            </div>

            <table className="review-table">
                <thead>
                    <tr>
                        <th>Tên người dùng</th>
                        <th>Đánh giá</th>
                        <th>Bình luận</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review._id}>
                            <td>{review.userId.name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminReviews;
