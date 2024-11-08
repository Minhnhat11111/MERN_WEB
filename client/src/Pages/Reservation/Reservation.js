import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Reservation.css';

const Reservation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, getToken } = useAuth();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [note, setNote] = useState('');
  const [tables, setTables] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableCapacities, setAvailableCapacities] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : ''
  });

  useEffect(() => {
    if (selectedDate && selectedTime && selectedCapacity) {
      const availableTable = tables.find(table => 
        table.seatingCapacities.some(cap => 
          cap.capacity === parseInt(selectedCapacity) &&
          cap.timeSlots.some(slot => 
            slot.time === selectedTime && 
            slot.availableQuantity > 0
          )
        )
      );
      setSelectedTable(availableTable || null);
    }
  }, [selectedDate, selectedTime, selectedCapacity, tables]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchTables = async () => {
    if (!selectedDate) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/table/get?date=${selectedDate}`);
      if (response.data.success && response.data.availableTables) {
        const tableData = response.data.availableTables;
        
        // Lọc ra chỉ những bàn còn trống
        const availableTables = tableData.filter(table => 
          table.seatingCapacities.some(cap => 
            cap.timeSlots.some(slot => slot.availableQuantity > 0)
          )
        );

        setTables(availableTables);

        if (availableTables.length > 0) {
          const capacities = availableTables.flatMap(table => 
            table.seatingCapacities.filter(cap => 
              cap.timeSlots.some(slot => slot.availableQuantity > 0)
            ).map(cap => cap.capacity)
          );
          const uniqueCapacities = [...new Set(capacities)];
          setAvailableCapacities(uniqueCapacities);

          const allTimeSlots = availableTables.flatMap(table =>
            table.seatingCapacities.flatMap(cap =>
              cap.timeSlots.filter(slot => slot.availableQuantity > 0).map(slot => slot.time)
            )
          );
          const uniqueTimeSlots = [...new Set(allTimeSlots)];
          setAvailableTimeSlots(uniqueTimeSlots);
        } else {
          setAvailableCapacities([]);
          setAvailableTimeSlots([]);
          toast.info('Không có bàn trống cho ngày này');
        }
      } else {
        setTables([]);
        setAvailableCapacities([]);
        setAvailableTimeSlots([]);
        toast.info('Không có bàn trống cho ngày này');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Không thể lấy thông tin bàn trống');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [selectedDate]);

  const updateAvailableCapacities = () => {
    if (!selectedTime) return;

    const availableCapacities = tables.flatMap(table =>
      table.seatingCapacities.filter(cap =>
        cap.timeSlots.some(slot => slot.time === selectedTime && slot.availableQuantity > 0)
      ).map(cap => cap.capacity)
    );

    const uniqueCapacities = [...new Set(availableCapacities)];
    setAvailableCapacities(uniqueCapacities);
  };

  useEffect(() => {
    updateAvailableCapacities();
  }, [selectedTime, tables]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đặt bàn');
      navigate('/login');
      return;
    }

    if (parseInt(numberOfPeople) > parseInt(selectedCapacity)) {
      toast.error('Số người không được vượt quá sức chứa của bàn');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }
      
      const reservationData = {
        tableId: selectedTable._id,
        date: selectedDate,
        timeSlot: selectedTime,
        seatingCapacity: parseInt(selectedCapacity),
        numberOfPeople: parseInt(numberOfPeople),
        note: note || '',
        name: userInfo.name,
        phone: userInfo.phone
      };

      const response = await axios.post(
        'http://localhost:4000/api/reservations/create',
        reservationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Đặt bàn thành công!');
        
        // Giảm `availableQuantity` và cập nhật danh sách giờ
        setTables(prevTables => prevTables.map(table => {
          if (table._id === selectedTable._id) {
            return {
              ...table,
              seatingCapacities: table.seatingCapacities.map(cap => {
                if (cap.capacity === parseInt(selectedCapacity)) {
                  return {
                    ...cap,
                    timeSlots: cap.timeSlots.map(slot => {
                      if (slot.time === selectedTime) {
                        return {
                          ...slot,
                          availableQuantity: slot.availableQuantity - 1
                        };
                      }
                      return slot;
                    }).filter(slot => slot.availableQuantity > 0) // Lọc các slot còn chỗ
                  };
                }
                return cap;
              })
            };
          }
          return table;
        }));
        
        navigate('/reservations');
      } else {
        toast.error(response.data.message || 'Đặt bàn thất bại');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error(error.response?.data?.message || 'Không thể đặt bàn');
    }
  };

  return (
    <div className="reservation-container">
      <h2>Đặt bàn</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleUserInfoChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserInfoChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Giờ:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={!selectedDate}
          >
            <option value="">Chọn giờ</option>
            {availableTimeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sức chứa:</label>
          <select
            value={selectedCapacity}
            onChange={(e) => setSelectedCapacity(e.target.value)}
            required
            disabled={!selectedTime}
          >
            <option value="">Chọn sức chứa</option>
            {availableCapacities.map((capacity, index) => (
              <option key={index} value={capacity}>
                {capacity} người
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Số lượng người:</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          Đặt bàn
        </button>
      </form>
    </div>
  );
};

export default Reservation;
