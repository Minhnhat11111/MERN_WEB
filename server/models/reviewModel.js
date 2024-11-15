import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Xếp hạng tối thiểu
        max: 5, // Xếp hạng tối đa
    },
}, {
    timestamps: true, // Thêm createdAt và updatedAt tự động
})

const reviewModel = mongoose.models.danhgia || mongoose.model("danhgia", reviewSchema)

export default reviewModel;