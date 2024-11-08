import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './ReservationHistory.css';

const ReservationHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:4000/api/reservations/user-reservations', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setReservations(response.data.reservations);
            } else {
                toast.error('Không thể lấy lịch sử đặt bàn');
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Có lỗi xảy ra khi lấy lịch sử đặt bàn');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="reservation-history-container">
            <h2>Lịch Sử Đặt Bàn</h2>
            {isLoading ? (
                <p>Đang tải...</p>
            ) : reservations.length === 0 ? (
                <p>Bạn chưa có đặt bàn nào.</p>
            ) : (
                <div className="reservations-list">
                    {reservations.map((reservation) => (
                        <div key={reservation._id} className="reservation-item">
                            <h3>Đặt bàn ngày {formatDate(reservation.date)}</h3>
                            <p>Thời gian: {reservation.timeSlot}</p>
                            <p>Số người: {reservation.numberOfPeople}</p>
                            <p>Bàn số: {reservation.tableNumber}</p>
                            <p>Trạng thái: {reservation.status}</p>
                            {reservation.note && <p>Ghi chú: {reservation.note}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationHistory;