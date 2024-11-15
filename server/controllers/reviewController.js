import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const addReview = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const userId = req.userId;

        // Kiểm tra xem người dùng có tồn tại không
        const userExists = await userModel.findById(userId);
        if (!userExists) {
            return res.json({ success: false, message: "Người dùng không tồn tại!" });
        }

        // Kiểm tra xem người dùng đã bình luận cho movieId chưa
        const existingReview = await reviewModel.findOne({ userId });
        if (existingReview) {
            return res.json({ success: false, message: "Bạn đã bình luận rồi!" });
        }

        // Kiểm tra độ dài của comment
        if (!comment || !rating) {
            return res.json({ success: false, message: "Comment và rating là bắt buộc!" });
        }



        // Tạo review mới
        const newReview = new reviewModel({
            userId,
            comment,
            rating,
        });

        const review = await newReview.save();
        res.json({ success: true, review });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        // Lấy tất cả review, có thể sử dụng populate để lấy thông tin user liên quan
        const reviews = await reviewModel.find().populate("userId", "name");

        // Tính tổng số lượng review
        const totalReviews = reviews.length;

        // Tính tổng điểm rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

        res.json({
            success: true,
            reviews,
            totalReviews,
            totalRating
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addReview, getAllReviews };
