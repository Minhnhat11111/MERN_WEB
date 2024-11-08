import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}


// server/controllers/userController.js
const loginUser = async (req,res) => {
    try {
      const {email,password} = req.body;
      const user = await userModel.findOne({email});
   
      if(!user) {
         return res.json({success:false, message:"Người dùng không tồn tại!"})
      }
 
      const isMatch = await bcrypt.compare(password, user.password);
 
      if(isMatch){
          const token = createToken(user._id)
          // Đảm bảo gửi thông tin user
          const userData = {
             id: user._id,
             name: user.name,
             email: user.email,
             phone: user.phone
          }
          res.json({
            success: true, 
            token,
            user: userData  // Thêm dòng này để gửi thông tin user
          })
      } else {
         res.json({success:false, message:"Sai mật khẩu!"})
      }
    } catch(error) {
      console.log(error);
      res.json({success:false, message:"Đăng nhập thất bại!"})
    }
 }



//Route cho user Register
const registerUser = async (req,res) => {
   try {

    const {name, phone,email,password} = req.body;
    
    // kiem tra nguoi dung da ton tai hay chua
    const exists = await userModel.findOne({email})
    if(exists){
        return res.json({success:false, message:"Nguoi dung ton tai"})
    }

    //kiem tra format email va password va phone
    if(!validator.isEmail(email)) {
        return res.json({success:false, message:"email khong dung dinh dang !"})
    }

    if(password.length <8) {
        return res.json({success:false, message:"password phai tu 8 ki tu tro len !"})
    }

    if(phone.length <10 || phone.length >10) {
        return res.json({success:false, message:"so dien thoai phai du 10 so !"})
    }

    // bam mat khau ra 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
       name,
       email,
       phone,
       password:hashedPassword
    })


    const user = await newUser.save()

    const token = createToken(user._id)

    res.json({success:true,token})

} catch (error)
   {
     console.log(error);
     res.json({success:false,message:error.message})
   }   
}
// Route cho dang nhap admin
const adminLogin = async (req,res) => {
  try {
     const {email,password} = req.body
     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
     {
        const token = jwt.sign(email+password, process.env.JWT_SECRET);
        res.json({success:true,token}) 
     }
     else 
     {
         res.json({success:false,message:"email hoặc mật khẩu không hợp lệ !"})
     }
  } catch (error) {
     // Không có xử lý lỗi ở đây
  }
 }



export {loginUser,registerUser,adminLogin}