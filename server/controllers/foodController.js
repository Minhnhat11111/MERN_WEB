import {v2 as cloudinary} from "cloudinary"
import foodModel from "../models/foodModel.js"

// Them mon an
const addFood = async (req, res) => {
    try {
      const { name, category } = req.body
      
       // Validate dữ liệu
       if(!name || !category) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin món ăn"
        })
    }

    if(!req.files || !req.files['image1']) {
        return res.status(400).json({
            success: false, 
            message: "Cần 1 hình ảnh cho món ăn"
        })
    }

    const image1 = req.files['image1'][0];
    const images = [image1].filter(item => item !== undefined)

  
    
    // Upload lên cloudinary
    let imagesURL = await Promise.all(
        images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {
                resource_type: 'image'
            });
          
            return result.secure_url
        })
    );
   
   
    const foodData = {
        name, 
        category,
        images: imagesURL
    }
 
    console.log(foodData);

    
     // Lưu thông tin vào database 
  
    const food = new foodModel(foodData)
    await food.save()
    res.json({ success: true, message: "Thêm món ăn thành công" })
  


} catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: "Có lỗi xảy ra khi thêm món ăn" })
    }
  }


//Xem danh sach mon
const listFood = async(req,res) => {
try {
    const foods= await foodModel.find({});
    res.json({ success: true,foods })
} catch (error) {
    console.log(error)
    res.json({success : false,message:error.message})
}
}

const updateFood = async (id) => {
  try {
      const response = await axios.post(
          'http://localhost:4000/api/food/update',
          { id, name: editData.name, category: editData.category },
          { headers: { token } }
      );

      if (response.data.success) {
          toast.success(response.data.message);

          // Reset the edit mode and data
          setEditMode(null);
          setEditData({ name: '', category: '' });

          // Fetch the updated food list immediately
          await fetchList();
      } else {
          toast.error(response.data.message || "Cập nhật thất bại");
      }
  } catch (error) {
      console.error("Error updating food:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
  }
};



//Xoa mon an 
const removeFood = async(req,res) => {
  try {
    
    await foodModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: "Xóa món ăn thành công" })
  
} catch (error) {

    console.log(error)
    res.json({success : false,message:"Lỗi không thể xóa món ăn"})

  }
}


//Xem mon an 
const singleFood = async(req,res) => {
 try {
    
const { Id } = req.body
const food = await foodModel.findById(Id)
res.json({success:true,food})

 } catch (error) {
    console.log(error)
    res.json({success : false,message:"Lỗi không có món ăn"})

 }
}

export {listFood,addFood,removeFood,singleFood,updateFood}