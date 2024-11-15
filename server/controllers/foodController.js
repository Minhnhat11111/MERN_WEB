import { v2 as cloudinary } from "cloudinary";
import foodModel from "../models/foodModel.js";
import axios from 'axios';


// Thêm món ăn
const addFood = async (req, res) => {
    try {
        const { name, category } = req.body;

        // Validate dữ liệu
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin món ăn",
            });
        }

        if (!req.files || !req.files['image1']) {
            return res.status(400).json({
                success: false,
                message: "Cần 1 hình ảnh cho món ăn",
            });
        }

        const image1 = req.files['image1'][0];
        const images = [image1].filter(item => item !== undefined);

        // Upload lên Cloudinary
        let imagesURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                });

                return result.secure_url;
            })
        );

        const foodData = {
            name,
            category,
            images: imagesURL,
        };

        // Lưu thông tin vào database
        const food = new foodModel(foodData);
        await food.save();
        res.json({ success: true, message: "Thêm món ăn thành công" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi thêm món ăn" });
    }
};

// Xem danh sách món ăn
const listFood = async (req, res) => {
    const { category, page, itemsPerPage } = req.query;
    const query = category ? { category } : {}; // Filter theo category

    const pageNum = parseInt(page) || 1;
    const limit = parseInt(itemsPerPage) || 100;
    const skip = (pageNum - 1) * limit;

    try {
        const foods = await foodModel.find(query).skip(skip).limit(limit);
        res.json({ success: true, foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateFood = async (req, res) => {
    const { id, name, category } = req.body;

    if (!name.trim() || !category) {
        return res.status(400).json({ success: false, message: "Tên món ăn và danh mục không được để trống." });
    }

    try {
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            { name, category },
            { new: true }
        );

        if (updatedFood) {
            // Lấy danh sách mới sau khi cập nhật
            const foods = await foodModel.find();

            return res.json({
                success: true,
                message: "Cập nhật món ăn thành công",
                foods, // Trả về danh sách mới
            });
        } else {
            return res.status(404).json({ success: false, message: "Không tìm thấy món ăn" });
        }
    } catch (error) {
        console.error("Error updating food:", error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi cập nhật" });
    }
};


// Xoá món ăn
const removeFood = async (req, res) => {
    try {
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Xóa món ăn thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi không thể xóa món ăn" });
    }
};

// Xem món ăn đơn
const singleFood = async (req, res) => {
    try {
        const { Id } = req.body;
        const food = await foodModel.findById(Id);
        res.json({ success: true, food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi không có món ăn" });
    }
};


export { listFood, addFood, removeFood, singleFood ,updateFood};
