import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import crypto from 'crypto';
import axios from 'axios';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import tableRouter from './routes/tableRoute.js';
import reservationRouter from './routes/reservationRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import reviewRoute from './routes/reviewRoute.js';
// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.get(`/`, (req, res) => {
    res.send("API working");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/api/table', tableRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/review', reviewRoute)
app.post("/payment", async (req, res) => {
    // Các thông số MoMo API
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'https://6132-113-176-64-137.ngrok-free.app';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = "payWithMethod";
    const amount = '50000';
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    // Tạo chữ ký HMAC SHA256
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    // Định nghĩa requestBody
    const requestBody = {
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        signature: signature
    };

    // Cấu hình axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': "application/json",
        },
        data: requestBody
    };

    try {
        const result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/api', paymentRoute); 

app.listen(port, () => console.log(`Server started on port: ${port}`));
