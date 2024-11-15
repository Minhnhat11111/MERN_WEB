import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TableManagement.css';

const TableManagement = () => {
    const [date, setDate] = useState('');
    const [timeSlotsVisible, setTimeSlotsVisible] = useState(false); // Ẩn giờ khi chưa chọn ngày
    const [seatingCapacities, setSeatingCapacities] = useState([
        {
            capacity: '',
            timeSlots: [{ time: '', availableQuantity: '' }]
        }
    ]);

    const handleAddCapacity = () => {
        setSeatingCapacities([
            ...seatingCapacities,
            {
                capacity: '',
                timeSlots: [{ time: '', availableQuantity: '' }]
            }
        ]);
    };

    const handleAddTimeSlot = (capacityIndex) => {
        const newCapacities = [...seatingCapacities];
        newCapacities[capacityIndex].timeSlots.push({ time: '', availableQuantity: '' });
        setSeatingCapacities(newCapacities);
    };

    const handleCapacityChange = (index, value) => {
        const newCapacities = [...seatingCapacities];
        newCapacities[index].capacity = value;
        setSeatingCapacities(newCapacities);
    };

    const handleTimeSlotChange = (capacityIndex, slotIndex, field, value) => {
        const newCapacities = [...seatingCapacities];
        newCapacities[capacityIndex].timeSlots[slotIndex][field] = value;

        // Kiểm tra ngày đã chọn và thời gian
        const selectedDate = new Date(date);
        const selectedTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${value}`);
        const currentTime = new Date();

        // Nếu là ngày hôm nay thì chỉ được chọn giờ sau thời gian hiện tại
        if (selectedDate.toISOString().split('T')[0] === currentTime.toISOString().split('T')[0]) {
            if (selectedTime <= currentTime) {
                toast.error('Thời gian phải lớn hơn thời gian hiện tại!');
                return;
            }
        }

        setSeatingCapacities(newCapacities);
    };

    const handleRemoveCapacity = (capacityIndex) => {
        const newCapacities = seatingCapacities.filter((_, index) => index !== capacityIndex);
        setSeatingCapacities(newCapacities);
    };

    const handleRemoveTimeSlot = (capacityIndex, slotIndex) => {
        const newCapacities = [...seatingCapacities];
        newCapacities[capacityIndex].timeSlots = newCapacities[capacityIndex].timeSlots
            .filter((_, index) => index !== slotIndex);
        setSeatingCapacities(newCapacities);
    };

    const handleCreateTable = async () => {
        if (!date || seatingCapacities.some(cap => 
            !cap.capacity || cap.timeSlots.some(slot => !slot.time || !slot.availableQuantity)
        )) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(date);

        // Kiểm tra nếu ngày chọn là trong quá khứ
        if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
            toast.error('Ngày chọn không được là quá khứ.');
            return;
        }

        // Kiểm tra thời gian không được chọn trong quá khứ
        for (const capacity of seatingCapacities) {
            for (const slot of capacity.timeSlots) {
                const slotTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${slot.time}`);
                if (slotTime < currentDate) {
                    toast.error('Thời gian không được chọn trong quá khứ.');
                    return;
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:4000/api/table/create', {
                date: selectedDate.toISOString(),
                seatingCapacities: seatingCapacities.map(cap => ({
                    capacity: parseInt(cap.capacity),
                    timeSlots: cap.timeSlots.map(slot => ({
                        time: slot.time,
                        availableQuantity: parseInt(slot.availableQuantity)
                    }))
                }))
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setDate('');
                setSeatingCapacities([{
                    capacity: '',
                    timeSlots: [{ time: '', availableQuantity: '' }]
                }]);
                setTimeSlotsVisible(false); // Ẩn giờ khi đã tạo bàn thành công
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo bàn.');
            console.error("Error creating table:", error);
        }
    };

    const timeOptions = (capacityIndex, slotIndex) => {
        const times = [];
        const selectedDate = new Date(date);
        const currentTime = new Date();

        // Nếu ngày chọn là hôm nay, chỉ hiển thị thời gian sau giờ hiện tại
        if (selectedDate.toISOString().split('T')[0] === currentTime.toISOString().split('T')[0]) {
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();

            for (let hour = currentHour; hour < 24; hour++) {
                const startMinute = (hour === currentHour && currentMinute > 0) ? Math.ceil(currentMinute / 30) * 30 : 0;
                for (let minute = startMinute; minute < 60; minute += 30) {
                    const hourStr = hour < 10 ? `0${hour}` : hour;
                    const minuteStr = minute === 0 ? '00' : '30';
                    const timeString = `${hourStr}:${minuteStr}`;
                    times.push(timeString);
                }
            }
        } else {
            // Nếu ngày chọn là tương lai, hiển thị tất cả các giờ trong ngày
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const hourStr = hour < 10 ? `0${hour}` : hour;
                    const minuteStr = minute === 0 ? '00' : '30';
                    const timeString = `${hourStr}:${minuteStr}`;
                    times.push(timeString);
                }
            }
        }

        return times.map((time, index) => (
            <option key={index} value={time}>{time}</option>
        ));
    };

    return (
        <div className="table-management-container">
            <h1>Tạo Bàn Mới</h1>
            <div className="date-container">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        setTimeSlotsVisible(true); // Hiển thị giờ khi chọn ngày
                    }}
                    required
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]} // Ràng buộc không chọn ngày trong quá khứ
                />
            </div>

            {timeSlotsVisible && seatingCapacities.map((capacity, capacityIndex) => (
                <div key={capacityIndex} className="capacity-container">
                    <div className="capacity-header">
                        <h2>Chỗ ngồi {capacityIndex + 1}</h2>
                        {seatingCapacities.length > 1 && (
                            <button 
                                onClick={() => handleRemoveCapacity(capacityIndex)}
                                className="remove-button"
                            >
                                Xóa chỗ ngồi
                            </button>
                        )}
                    </div>

                    <input
                        type="number"
                        placeholder="Nhập Số Chỗ Ngồi"
                        value={capacity.capacity}
                        onChange={(e) => handleCapacityChange(capacityIndex, e.target.value)}
                        required
                        className="input-field"
                    />

                    {capacity.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-slot-container">
                            <select
                                value={slot.time}
                                onChange={(e) => handleTimeSlotChange(capacityIndex, slotIndex, 'time', e.target.value)}
                                required
                                className="input-field time-slot-input"
                            >
                                <option value="">Chọn thời gian</option>
                                {timeOptions(capacityIndex, slotIndex)}
                            </select>
                            <input
                                type="number"
                                placeholder="Số lượng bàn"
                                value={slot.availableQuantity}
                                onChange={(e) => handleTimeSlotChange(capacityIndex, slotIndex, 'availableQuantity', e.target.value)}
                                required
                                className="input-field time-slot-input"
                            />
                            {capacity.timeSlots.length > 1 && (
                                <button 
                                    onClick={() => handleRemoveTimeSlot(capacityIndex, slotIndex)}
                                    className="remove-button"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    ))}

                    <button 
                        onClick={() => handleAddTimeSlot(capacityIndex)}
                        className="add-button"
                    >
                        Thêm khung giờ
                    </button>
                </div>
            ))}

            <button
                onClick={handleAddCapacity}
                className="add-button"
            >
                Thêm chỗ ngồi
            </button>

            <button
                onClick={handleCreateTable}
                className="add-button"
            >
                Tạo bàn
            </button>
        </div>
    );
};

export default TableManagement;
