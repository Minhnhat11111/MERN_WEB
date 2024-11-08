import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReservationList.css';

const ReservationList = ({ token }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'

    // Format date để hiển thị
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Lấy danh sách đặt bàn
    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/reservations/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setReservations(response.data.reservations);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Không thể lấy danh sách đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật trạng thái đặt bàn
    const updateReservationStatus = async (reservationId, status) => {
        try {
            const response = await axios.patch(
                `http://localhost:4000/api/reservations/${reservationId}/status`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Cập nhật trạng thái thành công!');
                setReservations(prevReservations =>
                    prevReservations.map(reservation =>
                        reservation._id === reservationId
                            ? { ...reservation, status }
                            : reservation
                    )
                );
            } else {
                toast.error('Không thể cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [token]);

    // Lọc danh sách đặt bàn theo trạng thái
    const filteredReservations = filter === 'all' 
        ? reservations 
        : reservations.filter(res => res.status === filter);

    return (
        <div className="reservation-list-container">
            <h2 className="page-title">Danh sách đặt bàn</h2>
            
            <div className="filter-section">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">Tất cả</option>
                    <option value="pending">Đang chờ</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <div className="reservations-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày đặt</th>
                                <th>Khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Thời gian</th>
                                <th>Số người</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation._id} className={`status-${reservation.status}`}>
                                    <td>{formatDate(reservation.date)}</td>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.phone}</td>
                                    <td>{reservation.timeSlot}</td>
                                    <td>{reservation.numberOfPeople}</td>
                                    <td>{reservation.note || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${reservation.status}`}>
                                            {reservation.status === 'pending' && 'Đang chờ'}
                                            {reservation.status === 'confirmed' && 'Đã xác nhận'}
                                            {reservation.status === 'cancelled' && 'Đã hủy'}
                                        </span>
                                    </td>
                                    <td>
                                        {reservation.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateReservationStatus(reservation._id, 'confirmed')}
                                                    className="action-button confirm"
                                                >
                                                    Xác nhận
                                                </button>
                                                <button
                                                    onClick={() => updateReservationStatus(reservation._id, 'cancelled')}
                                                    className="action-button cancel"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReservationList;
