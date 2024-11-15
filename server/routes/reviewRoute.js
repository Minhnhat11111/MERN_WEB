import express from "express";
import { addReview, getAllReviews,deleteReview } from "../controllers/reviewController.js";
import { userAuth } from '../middleware/auth.js';

const reviewRoute = express.Router();

reviewRoute.post("/", userAuth, addReview)
reviewRoute.get("/", getAllReviews)
reviewRoute.delete("/delete/:userId",deleteReview)

export default reviewRoute;
