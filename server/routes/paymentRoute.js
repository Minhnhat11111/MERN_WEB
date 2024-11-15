import express from "express";
import { updateReservation, createPaymentLink } from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/payment", createPaymentLink)
paymentRoute.post("/update", updateReservation)

export default paymentRoute;
