// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReservationList.css';

const ReservationList = ({ token }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'paid'
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchReservations();
    }, [token]);

    // Hàm kiểm tra trạng thái đã thanh toán
    const isPaid = (status) => {
        return status.includes('paid');
    };

    // Lọc danh sách đặt bàn theo trạng thái, ngày, và tìm kiếm
    const filteredReservations = reservations.filter((reservation) => {
        const matchesStatus = filterStatus === 'all' || (filterStatus === 'pending' && reservation.status === 'pending') || (filterStatus === 'paid' && isPaid(reservation.status));

        // Kiểm tra ngày theo đúng định dạng 'YYYY-MM-DD'
        const matchesDate = filterDate ? new Date(reservation.date).toLocaleDateString('en-CA') === filterDate : true;

        const matchesSearch = reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) || reservation.phone.includes(searchTerm);

        return matchesStatus && matchesDate && matchesSearch;
    });

    // Reset bộ lọc
    const resetFilters = () => {
        setFilterStatus('all');
        setFilterDate('');
        setSearchTerm('');
    };

    return (
        <div className="reservation-list-container">
            <h2 className="page-title">Danh sách đặt bàn</h2>

            <div className="filter-section">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="filter-date"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm"
                    className="search-input"
                />

                <button onClick={resetFilters} className="reset-filters-button">
                    Xóa bộ lọc
                </button>
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation) => {
                                const paidAmount = isPaid(reservation.status) ? reservation.status.split(' ')[1] : null;

                                return (
                                    <tr key={reservation._id} className={`status-${reservation.status}`}>
                                        <td>{formatDate(reservation.date)}</td>
                                        <td>{reservation.name}</td>
                                        <td>{reservation.phone}</td>
                                        <td>{reservation.timeSlot}</td>
                                        <td>{reservation.numberOfPeople}</td>
                                        <td>{reservation.note || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${reservation.status}`}>
                                                {reservation.status === 'pending' && 'Chưa thanh toán'}
                                                {reservation.status === 'confirmed' && 'Đã xác nhận'}
                                                {reservation.status === 'cancelled' && 'Đã hủy'}
                                                {isPaid(reservation.status) && `Đã thanh toán: ${paidAmount} VND`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReservationList;
