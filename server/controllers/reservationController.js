// server/controllers/reservationController.js
import Reservation from '../models/reservationModel.js';
import Table from '../models/tableModel.js';
import User from '../models/userModel.js';

export const createReservation = async (req, res) => {
    try {
        const { tableId, date, timeSlot, seatingCapacity, numberOfPeople, note, name, phone } = req.body;
        const userId = req.userId;

        // Kiểm tra các trường nhập vào
        if (!tableId || !date || !timeSlot || !seatingCapacity || !numberOfPeople || !name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin đặt bàn"
            });
        }

        // Tìm bàn và kiểm tra số lượng còn lại
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bàn"
            });
        }

        const capacityInfo = table.seatingCapacities.find(cap => cap.capacity === parseInt(seatingCapacity));
        if (!capacityInfo) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy thông tin sức chứa phù hợp"
            });
        }

        const timeSlotInfo = capacityInfo.timeSlots.find(slot => slot.time === timeSlot);
        if (!timeSlotInfo || timeSlotInfo.availableQuantity === 0) {
            return res.status(400).json({
                success: false,
                message: "Không còn bàn trống cho khung giờ này"
            });
        }

        // Giảm số lượng bàn có sẵn
        timeSlotInfo.availableQuantity -= 1;
        await table.save();

        // Tạo đặt bàn mới
        const newReservation = new Reservation({
            userId,
            name,
            phone,
            table: tableId,
            date: new Date(date),
            timeSlot,
            seatingCapacity: parseInt(seatingCapacity),
            numberOfPeople: parseInt(numberOfPeople),
            note,
            status: 'pending'
        });

        await newReservation.save();

        res.status(201).json({
            success: true,
            message: "Đặt bàn thành công",
            reservation: newReservation
        });

    } catch (error) {
        console.error('Error in createReservation:', error);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi đặt bàn",
            error: error.message
        });
    }
};
export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('table userId', 'name phone');
        return res.status(200).json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Error in getAllReservations:', error);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách đặt bàn",
            error: error.message
        });
    }
};
// Lấy danh sách đặt bàn của người dùng
export const getUserReservations = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        const reservations = await Reservation.find({ phone: user.phone })
            .populate('table')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reservations: reservations.map(reservation => ({
                _id: reservation._id,
                name: reservation.name,
                phone: reservation.phone,
                date: reservation.date,
                timeSlot: reservation.timeSlot,
                seatingCapacity: reservation.seatingCapacity,
                numberOfPeople: reservation.numberOfPeople,
                status: reservation.status,
                note: reservation.note,
                tableNumber: reservation.table?.numberTable,
                createdAt: reservation.createdAt
            }))
        });

    } catch (error) {
        console.error('Error in getUserReservations:', error);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy lịch sử đặt bàn",
            error: error.message
        });
    }
};
export const getAvailableTables = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};
        
        if (date) {
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);
            const endDate = new Date(searchDate);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: searchDate, $lte: endDate };
        }

        const tables = await Table.find(query);

        // Lọc ra chỉ những bàn còn trống
        const availableTables = tables.map(table => {
            const availableCapacities = table.seatingCapacities.map(cap => ({
                ...cap.toObject(),
                timeSlots: cap.timeSlots.filter(slot => slot.availableQuantity > 0)
            })).filter(cap => cap.timeSlots.length > 0);

            return {
                ...table.toObject(),
                seatingCapacities: availableCapacities
            };
        }).filter(table => table.seatingCapacities.length > 0);

        if (availableTables.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không có bàn nào còn trống."
            });
        }

        return res.status(200).json({
            success: true,
            availableTables: availableTables
        });

    } catch (error) {
        console.error("Error in getAvailableTables:", error);
        return res.status(500).json({
            success: false, message: "Có lỗi xảy ra khi lấy danh sách bàn",
            error: error.message
        });
    }
};
