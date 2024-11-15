import Invoice from "../models/invoiceModel.js";



const getAllInvoice = async (req, res) => {
    try {
        // Truy vấn tất cả các bàn
        const invoices = await Invoice.find().populate("reservationId");

        res.json({ success: true, invoices });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách hóa đơn." });
    }
};



export { getAllInvoice };