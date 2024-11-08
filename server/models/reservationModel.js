import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    numberOfPeople: { type: Number, required: true },
    note: { type: String, default: '' },
    status: { type: String, default: 'pending' }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;