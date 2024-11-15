import express from "express";
import { loginUser,registerUser,adminLogin,getUserInfo,getAllUsers,removeUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/userinfo', getUserInfo)
userRouter.get('/all',getAllUsers)
userRouter.delete('/delete', removeUser)


export default userRouter;