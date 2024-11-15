import express from "express";
import { addReview, getAllReviews } from "../controllers/reviewController.js";
import { userAuth } from '../middleware/auth.js';

const reviewRoute = express.Router();

reviewRoute.post("/", userAuth, addReview)
reviewRoute.get("/", getAllReviews)

export default reviewRoute;
