import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TableManagement.css';

const TableManagement = () => {
    const [date, setDate] = useState('');
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
    
        try {
            const response = await axios.post('http://localhost:4000/api/table/create', {
                date: new Date(date).toISOString(), // Lưu định dạng chuẩn
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
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo bàn.');
            console.error("Error creating table:", error);
        }
    };

    return (
        <div className="table-management-container">
            <h1>Tạo Bàn Mới</h1>
            <div className="date-container">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="input-field"
                />
            </div>

            {seatingCapacities.map((capacity, capacityIndex) => (
                <div key={capacityIndex} className="capacity-container">
                    <div className="capacity-header">
                        <h2>Sức chứa {capacityIndex + 1}</h2>
                        {seatingCapacities.length > 1 && (
                            <button 
                                onClick={() => handleRemoveCapacity(capacityIndex)}
                                className="remove-button"
                            >
                                Xóa sức chứa
                            </button>
                        )}
                    </div>

                    <input
                        type="number"
                        placeholder="Nhập sức chứa"
                        value={capacity.capacity}
                        onChange={(e) => handleCapacityChange(capacityIndex, e.target.value)}
                        required
                        className="input-field"
                    />

                    {capacity.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-slot-container">
                            <input
                                type="time"
                                value={slot.time}
                                onChange={(e) => handleTimeSlotChange(capacityIndex, slotIndex, 'time', e.target.value)}
                                required
                                className="input-field time-slot-input"
                            />
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

            <div className="button-container">
                <button onClick={handleAddCapacity} className="add-button">
                    Thêm sức chứa mới
                </button>
                <button onClick={handleCreateTable} className="create-button">
                    Tạo bàn
                </button>
            </div>
        </div>
    );
};

export default TableManagement;
