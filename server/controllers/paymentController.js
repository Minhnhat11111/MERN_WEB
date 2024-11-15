import crypto from 'crypto';
import axios from 'axios';
import Reservation from "../models/reservationModel.js"; // Model reservation của bạn

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const orderInfo = 'Pay with MoMo';
const partnerCode = 'MOMO';
const redirectUrl = 'https://e719-113-161-94-80.ngrok-free.app'; // Cập nhật URL đúng của bạn
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; // URL xử lý IPN
const requestType = "payWithMethod";
const lang = 'vi';

// API tạo liên kết thanh toán
const createPaymentLink = async (req, res) => {
    try {
        const { amount, reservationId } = req.body;
        if (!amount || !reservationId) {
            return res.json({ success: false, message: "Không đủ thông tin để thanh toán." });
        }

        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = Buffer.from(JSON.stringify({ reservationId })).toString('base64');
        const autoCapture = true;

        // Tạo chữ ký HMAC SHA256
        const rawSignature =
            `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        // Body request gửi đến MoMo API
        const requestBody = {
            partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            signature
        };

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: { 'Content-Type': 'application/json' },
            data: requestBody
        };

        const result = await axios(options);
        if (result.data && result.data.payUrl) {
            return res.json({ success: true, link: result.data.payUrl }); // Trả về link thanh toán
        } else {
            return res.json({ success: false, message: 'Không thể tạo liên kết thanh toán' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const updateReservation = async (req, res) => {
    const { orderId, partnerCode, resultCode, extraData, amount } = req.body;
  
    if (resultCode === '0') {  // Kiểm tra nếu thanh toán thành công
      const decodedExtraData = Buffer.from(extraData, 'base64').toString('utf-8');
      const parsedData = JSON.parse(decodedExtraData);
      const { reservationId } = parsedData;
  
      // Cập nhật trạng thái thanh toán của đặt bàn
      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { status: `Paid - ${amount}` }, // Cập nhật trạng thái thanh toán
        { new: true }
      );
  
      if (!updatedReservation) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt bàn' });
      }
  
      return res.json({ success: true, message: 'Thanh toán thành công và thông tin đặt bàn đã được lưu' });
    } else {
      return res.status(400).json({ success: false, message: 'Thanh toán không thành công' });
    }
  };
  
export { updateReservation, createPaymentLink }

