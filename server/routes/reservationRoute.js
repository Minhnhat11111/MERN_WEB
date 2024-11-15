    import express from 'express';
    import { createReservation, getUserReservations,getAllReservations} from '../controllers/reservationController.js';
    import { userAuth } from '../middleware/auth.js';

    const reservationRouter = express.Router();

    // Đặt bàn mới
    reservationRouter.post('/create', userAuth, createReservation);
    reservationRouter.get('/all',getAllReservations)
    // Lấy danh sách đặt bàn của user
    reservationRouter.get('/user-reservations', userAuth, getUserReservations);
    // Hủy đặt bàn
    export default reservationRouter;