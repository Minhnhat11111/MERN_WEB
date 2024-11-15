import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReservationHistory.css';  // Import file CSS

function UserReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API để lấy lịch sử đặt bàn
        axios.get('http://localhost:4000/api/reservations/user-reservations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Đảm bảo sử dụng token nếu có
            }
        })
        .then(response => {
            setReservations(response.data.reservations); // Lưu dữ liệu vào state
            setLoading(false); // Đặt loading thành false khi lấy dữ liệu thành công
        })
        .catch(error => {
            console.error(error);
            toast.error("Có lỗi khi tải lịch sử đặt bàn.");
            setLoading(false); // Đặt loading thành false nếu có lỗi
        });
    }, []); // Chạy một lần khi component mount

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ); // Hiển thị khi dữ liệu đang được tải
    }

    return (
        <div className="container">
            <h1 className="text-center font-semibold text-4xl mb-6">Lịch sử đặt bàn của bạn</h1>
            
            {reservations.length === 0 ? (
                <p className="no-reservation">Chưa có đặt bàn nào.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Thời gian</th>
                                <th>Số người</th>
                                <th>Tên người đặt</th>
                                <th>Số điện thoại</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation, index) => (
                                <tr key={index}>
                                    <td>{new Date(reservation.date).toLocaleDateString()}</td>
                                    <td>{reservation.timeSlot}</td>
                                    <td>{reservation.numberOfPeople}</td>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.phone}</td>
                                    <td>{reservation.note || "Không có"}</td>
                                    <td>
                                        <span className={`status ${reservation.status.toLowerCase()}`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserReservations;
