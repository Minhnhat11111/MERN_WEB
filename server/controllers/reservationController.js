import Reservation from '../models/reservationModel.js';
import Table from '../models/tableModel.js';
import User from '../models/userModel.js';
    


export const fetchTables = async (req, res) => {
    try {
        const { selectedDate } = req.query;
        
        if (!selectedDate) {
            return res.status(400).json({ success: false, message: "Ngày không hợp lệ" });
        }

        const reservationDate = new Date(selectedDate);
        reservationDate.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày

        // Lấy tất cả các bàn
        const allTables = await Table.find();  // Bạn có thể thêm paginate hoặc giới hạn số lượng bàn nếu cần

        // Lọc các bàn có khung giờ có bàn trống cho ngày đã chọn
        const availableTables = allTables.filter(table =>
            table.seatingCapacities.some(cap =>
                cap.timeSlots.some(slot =>
                    slot.availableQuantity > 0 &&  // Chỉ lấy các khung giờ có số lượng bàn còn trống
                    new Date(slot.date).toLocaleDateString() === reservationDate.toLocaleDateString() // Đảm bảo ngày chọn khớp
                )
            )
        );

        if (availableTables.length > 0) {
            res.status(200).json({
                success: true,
                availableTables: availableTables
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Không có bàn trống cho ngày này"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin bàn" });
    }
};

export const createReservation = async (req, res) => {
    try {
        const { userId, tableId, date, timeSlot, seatingCapacity, numberOfPeople, note, name, phone, email } = req.body;

        // Kiểm tra các dữ liệu bắt buộc
        if (!userId || !tableId || !date || !timeSlot || !seatingCapacity || !numberOfPeople || !name || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin đặt bàn"
            });
        }

        // Chuyển đổi ngày vào đúng múi giờ UTC
        const reservationDate = new Date(date);
        reservationDate.setUTCHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày theo UTC

        // Kiểm tra xem người dùng đã đặt bàn vào ngày đó chưa
        const existingReservation = await Reservation.findOne({
            userId: userId,
            date: reservationDate
        });

        if (existingReservation) {
            return res.status(400).json({
                success: false,
                message: "Bạn chỉ có thể đặt một bàn mỗi ngày."
            });
        }


        if (existingReservation) {
            return res.status(400).json({
                success: false,
                message: "Bạn chỉ có thể đặt một bàn mỗi ngày."
            });
        }

        // Xử lý đặt bàn
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bàn"
            });
        }

        const capacityInfo = table.seatingCapacities.find(cap => cap.capacity === parseInt(seatingCapacity));
        const timeSlotInfo = capacityInfo?.timeSlots.find(slot => slot.time === timeSlot && slot.availableQuantity > 0);

        if (!timeSlotInfo) {
            return res.status(400).json({
                success: false,
                message: "Không còn bàn trống cho khung giờ này"
            });
        }

        timeSlotInfo.availableQuantity -= 1;
        await table.save();

        const newReservation = new Reservation({
            userId,
            name,
            phone,
            email,
            table: tableId,
            date: reservationDate,  // Lưu ngày đã chuyển về UTC
            timeSlot,
            seatingCapacity: parseInt(seatingCapacity),
            numberOfPeople: parseInt(numberOfPeople),
            note,
            status: 'pending'
        });

        await newReservation.save();

        return res.status(201).json({
            success: true,
            message: "Đặt bàn thành công",
            reservation: newReservation
        });
    } catch (error) {
        console.error('Error in createReservation:', error);
        return res.status(500).json({
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
        
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        // Lấy các đặt bàn của người dùng
        const reservations = await Reservation.find({ userId: userId })
            .populate('table')
            .sort({ createdAt: -1 });

        // Trả về danh sách đặt bàn của người dùng
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
                tableNumber: reservation.table ? reservation.table.numberTable : null,
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