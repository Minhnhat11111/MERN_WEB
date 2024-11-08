import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Hàm format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

    // Thay đổi useEffect để theo dõi dateFilter
    useEffect(() => {
        fetchTables();
    }, [dateFilter]); // Thêm dateFilter vào dependencies
    
    const fetchTables = async () => {
        try {
            const url = dateFilter 
                ? `http://localhost:4000/api/table/get?date=${dateFilter}`
                : 'http://localhost:4000/api/table/get';
            
            // Log URL để debug
            console.log('Requesting URL:', url);
            
            const response = await axios.get(url);
            
            // Log toàn bộ response để kiểm tra
            console.log('Full server response:', response);
            console.log('Response data:', response.data);
        
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
            console.error('Error details:', error);
            console.error('Error response:', error.response);
            toast.error('Có lỗi xảy ra khi lấy danh sách bàn.');
        }
    };
    
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        // Format date to ISO string before sending to server
        const formattedDate = new Date(selectedDate).toISOString();
        console.log("Formatted date:", formattedDate);
        setDateFilter(formattedDate);
    };
    
    const handleTimeChange = (e) => {
        const selectedTime = e.target.value;
        console.log("Selected time:", selectedTime);
        setTimeFilter(selectedTime);
    };
    
    // Lọc bàn - chỉ lọc theo thời gian vì ngày đã được lọc ở backend
    const filteredTables = tables.reduce((acc, table) => {
        if (Array.isArray(table.seatingCapacities)) { // Kiểm tra seatingCapacities có phải là mảng
            table.seatingCapacities.forEach(capacity => {
                if (Array.isArray(capacity.timeSlots)) { // Kiểm tra timeSlots có phải là mảng
                    capacity.timeSlots.forEach(slot => {
                        if (!timeFilter || slot.time === timeFilter) {
                            acc.push({
                                ...table,
                                slot,
                                seatingCapacity: capacity.capacity
                            });
                        }
                    });
                }
            });
        }
        return acc;
    }, []);
    
    const resetFilters = () => {
        setDateFilter('');
        setTimeFilter('');
    };
    
    return (
        <div>
            <h1>Danh Sách Bàn</h1>
            <div>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={handleDateChange}
                    placeholder="Chọn ngày"
                />
                <input
                    type="time"
                    value={timeFilter}
                    onChange={handleTimeChange}
                    placeholder="Chọn giờ"
                />
                <button onClick={resetFilters}>Reset Filter</button>
            </div>
            {filteredTables.length === 0 ? (
                <p>Không có dữ liệu bàn nào trống cho ngày và giờ đã chọn.</p> // Thay đổi thông báo
            ) : (
                <ul>
                    {filteredTables.map((table, index) => (
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
        </div>
    );
}

export default Tables;
