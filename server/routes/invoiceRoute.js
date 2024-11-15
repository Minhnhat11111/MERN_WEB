import express from "express";
import { adminAuth } from "../middleware/auth.js";
import { getAllInvoice } from "../controllers/invoiceController.js"

const invoiceRoute = express.Router();

invoiceRoute.get("/", adminAuth, getAllInvoice)

export default invoiceRoute;
