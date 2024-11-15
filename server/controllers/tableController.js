
// controllers/tableController.js
import mongoose from "mongoose";
import Table from "../models/tableModel.js";

// Trong controller
const createTable = async (req, res) => {
    try {
        const { date, seatingCapacities } = req.body;
        
        console.log('Received data:', { date, seatingCapacities });

        // Validate input
        if (!date || !seatingCapacities || !Array.isArray(seatingCapacities)) {
            console.log('Validation failed:', { 
                hasDate: !!date, 
                hasCapacities: !!seatingCapacities, 
                isArray: Array.isArray(seatingCapacities) 
            });
            return res.status(400).json({
                success: false,
                message: "Dữ liệu đầu vào không hợp lệ"
            });
        }

        // Chuyển đổi ngày về múi giờ Việt Nam (UTC+7)
        const vietnamDate = new Date(date);
        console.log('Converted date:', vietnamDate);

        // Tạo object bàn mới
        const tableData = {
            date: vietnamDate,
            seatingCapacities: seatingCapacities.map(cap => ({
                capacity: parseInt(cap.capacity),
                timeSlots: cap.timeSlots.map(slot => ({
                    time: slot.time,
                    availableQuantity: parseInt(slot.availableQuantity)
                }))
            })),
            numberTable: await generateUniqueTableNumber()
        };

        console.log('Table data to save:', tableData);

        const newTable = new Table(tableData);
        
        // Lưu vào database
        const savedTable = await newTable.save();
        console.log('Saved table:', savedTable);

        res.json({
            success: true,
            message: "Tạo bàn thành công",
            table: savedTable
        });

    }catch (error) {
        console.error("Error details:", error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi tạo bàn",
            error: error.message,
            stack: error.stack
        });
    }
};
// Hàm để tạo số bàn duy nhất
const generateUniqueTableNumber = async () => {
    const highestTable = await Table.findOne().sort('-numberTable'); // Sắp xếp theo số bàn giảm dần
    return (highestTable?.numberTable || 0) + 1; // Tạo số bàn tiếp theo
};

// controllers/tableController.js

// controllers/tableController.js

const getAvailableTables = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};
        
        console.log("Received date query:", date); // Log ngày nhận được từ query

        if (date) {
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);
            const endDate = new Date(searchDate);
            endDate.setHours(23, 59, 59, 999);
query.date = { $gte: searchDate, $lte: endDate };
        }

        console.log("Query object:", query); // Log đối tượng truy vấn

        const tables = await Table.find(query)
            .select({
                '_id': 1,
                'date': 1,
                'seatingCapacities': 1,
                'numberTable': 1,
                'createdAt': 1,
                'updatedAt': 1
            })
            .lean();

        console.log("Retrieved tables:", tables); // Log bảng dữ liệu đã lấy

        if (tables.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không có bàn nào được tìm thấy."
            });
        }

        return res.status(200).json({
            success: true,
            availableTables: tables
        });

    } catch (error) {
        console.error("Error in getAvailableTables:", error);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách bàn.",
            error: error.message
        });
    }
};


export { createTable, getAvailableTables };