// models/tableModel.js

import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    time: { type: String, required: true },
    availableQuantity: { type: Number, required: true }
});

const seatingCapacitySchema = new mongoose.Schema({
    capacity: { type: Number, required: true },
    timeSlots: [timeSlotSchema]
});

const tableSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    seatingCapacities: [seatingCapacitySchema],
    numberTable: { type: Number, required: true }
}, {
    timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

export default Table;