import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'reservation' },
    paid: { type: Number, require: true },
})

const invoiceModel = mongoose.models.invoice || mongoose.model('invoice', invoiceSchema)

export default invoiceModel