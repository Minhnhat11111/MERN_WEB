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
// Lấy thông tin user hiện tại
const getUserInfo = async (req, res) => {
   try {
       const user = await userModel.findById(req.userId); // req.userId phải được truyền từ middleware xác thực

       if (!user) {
           return res.json({ success: false, message: "Không tìm thấy người dùng!" });
       }

       res.json({
           success: true,
           user: {
               id: user._id,
               name: user.name,
               email: user.email,
               phone: user.phone
           }
       });
   } catch (error) {
       console.log(error);
       res.json({ success: false, message: "Có lỗi xảy ra khi lấy thông tin người dùng!" });
   }
};

// Lấy danh sách tất cả user
const getAllUsers = async (req, res) => {
   try {
       const users = await userModel.find({}, 'name email phone'); // Lấy tất cả user với các trường cụ thể

       res.json({
           success: true,
           users: users.map(user => ({
               id: user._id,
               name: user.name,
               email: user.email,
               phone: user.phone
           }))
       });
   } catch (error) {
       console.log(error);
       res.json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách người dùng!" });
   }
};

const removeUser = async (req, res) => {
   try {
       await userModel.findByIdAndDelete(req.body.id);
       res.json({ success: true, message: "Xóa món ăn thành công" });
   } catch (error) {
       console.log(error);
       res.json({ success: false, message: "Lỗi không thể xóa món ăn" });
   }
};

const deleteUser = async (req, res) => {
   try {
       const userId = req.params.id;  // Lấy id từ URL (tham số)
       
       // Tìm và xóa người dùng theo ID
       const deletedUser = await userModel.findByIdAndDelete(userId);
       
       // Nếu không tìm thấy người dùng với ID này
       if (!deletedUser) {
           return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
       }
       
       // Nếu xóa thành công
       res.json({ success: true, message: "Xóa tài khoản thành công!" });
   } catch (error) {
       console.error('Error in deleteUser:', error);
       res.status(500).json({ success: false, message: "Có lỗi xảy ra khi xóa tài khoản" });
   }
};



export { loginUser, registerUser, adminLogin, getUserInfo, getAllUsers,deleteUser,removeUser };
