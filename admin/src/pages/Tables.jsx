// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Hàm format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Hàm format giờ cho chuẩn định dạng hh:mm AM/PM
const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const period = isPM ? 'PM' : 'AM';
    return `${String(formattedHour).padStart(2, '0')}:${formattedMinutes} ${period}`;
};


const TimeSlot = ({ slot, tableDate, seatingCapacity }) => (
    <div>
        <span>Ngày: {tableDate}, Sức chứa: {seatingCapacity}, Khung giờ: {slot.time} - {slot.availableQuantity} bàn còn</span>
    </div>
);

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [seatingCapacityFilter, setSeatingCapacityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10; // Số lượng bàn hiển thị trên mỗi trang

    // Lấy dữ liệu từ API
    useEffect(() => {
        fetchTables();
    }, [dateFilter, timeFilter, seatingCapacityFilter]);

    const fetchTables = async () => {
        try {
            const url = dateFilter 
                ? `http://localhost:4000/api/table/get?date=${dateFilter}`
                : 'http://localhost:4000/api/table/get';
            
            const response = await axios.get(url);
            if (response.data.success) {
                const formattedTables = response.data.availableTables.map(table => ({
                    ...table,
                    date: new Date(table.date)
                }));
                setTables(formattedTables);
            } else {
                toast.error(response.data.message || 'Không thể lấy danh sách bàn');
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            toast.error('Có lỗi xảy ra khi lấy danh sách bàn.');
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDateFilter(selectedDate);  // Cập nhật lại dateFilter với giá trị mới
        setCurrentPage(1); // Đặt lại trang về 1 khi lọc mới
    };

    const handleTimeChange = (e) => {
        setTimeFilter(e.target.value);
        console.log('Time Filter:', e.target.value);  // Kiểm tra giá trị timeFilter
        setCurrentPage(1); // Đặt lại trang về 1 khi lọc mới
    };

    const handleSeatingCapacityChange = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value)) {
            setSeatingCapacityFilter(value);
            setCurrentPage(1); // Đặt lại trang về 1 khi lọc mới
        } else {
            toast.error("Vui lòng nhập số chỗ ngồi hợp lệ");
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":");
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // Lọc bàn theo thời gian và sức chứa
 const filteredTables = tables.reduce((acc, table) => {
    if (Array.isArray(table.seatingCapacities)) {
        table.seatingCapacities.forEach(capacity => {
            if (Array.isArray(capacity.timeSlots)) {
                capacity.timeSlots.forEach(slot => {
                    const isMatchingCapacity = seatingCapacityFilter
                        ? capacity.capacity === parseInt(seatingCapacityFilter)
                        : true;

                    // So sánh thời gian
                    const formattedSlotTime = formatTime(slot.time); // Thời gian từ API
                    const formattedTimeFilter = timeFilter ? formatTime(timeFilter) : ''; // Thời gian người dùng nhập vào

                    if ((!timeFilter || formattedSlotTime === formattedTimeFilter) && isMatchingCapacity) {
                        // Kiểm tra ngày
                        if (!dateFilter || formatDate(table.date) === dateFilter) {
                            acc.push({
                                ...table,
                                slot,
                                seatingCapacity: capacity.capacity
                            });
                        }
                    }
                });
            }
        });
    }
    return acc;
}, []);


    // Phân trang
    const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
    const displayedTables = filteredTables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const resetFilters = () => {
        setDateFilter('');
        setTimeFilter('');
        setSeatingCapacityFilter('');
        setCurrentPage(1);
    };

    return (
        <div>
            <h1>Danh Sách Bàn</h1>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="date"
                    value={dateFilter} // Giá trị ngày sẽ được hiển thị ở đây
                    onChange={handleDateChange}
                    placeholder="Chọn ngày"
                    style={{ marginRight: '10px' }}
                />
               <input
    type="text"
    value={timeFilter}
    onChange={handleTimeChange}
    placeholder="Chọn giờ (hh:mm AM/PM)"
    style={{ marginRight: '10px' }}
/>
                <input
                    type="text"
                    value={seatingCapacityFilter}
                    onChange={handleSeatingCapacityChange}
                    placeholder="Nhập số chỗ ngồi"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={resetFilters} style={{ padding: '5px 10px', marginLeft: '10px' }}>
                    Reset Filter
                </button>
            </div>

            {displayedTables.length === 0 ? (
                <p>Không có dữ liệu bàn nào trống cho ngày và giờ đã chọn.</p>
            ) : (
                <ul>
                    {displayedTables.map((table, index) => (
                        <li key={index}>
                            <TimeSlot
                                slot={table.slot}
                                tableDate={formatDate(table.date)}
                                seatingCapacity={table.seatingCapacity}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Trang trước
                </button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default Tables;
