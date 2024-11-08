// Đảm bảo import đúng multer
import upload from '../middleware/multer.js';
import express from 'express';
import {
  listFood,
  addFood,
  removeFood,
  singleFood,
  updateFood
} from "../controllers/foodController.js";

import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();

// Route thêm món ăn với hình ảnh
foodRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }]), addFood);
foodRouter.post('/remove', adminAuth, removeFood);
foodRouter.post('/single', singleFood);
foodRouter.get('/list', listFood);

// Route cập nhật món ăn với hình ảnh
foodRouter.post('/update', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }]), updateFood);

export default foodRouter;
