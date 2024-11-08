import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track which item is being edited
  const [editData, setEditData] = useState({ name: '', category: '' }); // Store edited data

  // Danh sách loại món ăn cố định
  const categories = ['Món chính', 'Salad','Tráng miệng','Súp','Thức Uống'];

  // Fetch list of foods from database
  const fetchList = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/food/list');
      if (response.data.success) {
        setList(response.data.foods);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Remove food item
  const removeFood = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/api/food/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateFood = async (id) => {
    // Kiểm tra xem tên món ăn và danh mục có trống không
    if (!editData.name.trim() || !editData.category) {
      toast.error("Tên món ăn và danh mục không được để trống.");
      return; // Ngưng thực hiện nếu có trường trống
    }
  
    try {
      const response = await axios.post(
        'http://localhost:4000/api/food/update',
        { id, name: editData.name, category: editData.category },
        { headers: { token } }
      );
  
      if (response.data.success) {
        toast.success(response.data.message, {
          onClose: () => {
            setEditMode(null);
            setEditData({ name: '', category: '' });
            fetchList(); // Tải lại danh sách món ăn ngay lập tức
          }
        });
      } else {
        toast.error(response.data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      console.log("Response from server:", error.response);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 text-2xl text-center">Danh sách món ăn</p>
      <div className="flex flex-col gap-2">
        {/* Food list header */}
        <div className="md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Hình ảnh</b>
          <b>Tên món ăn</b>
          <b>Danh mục</b>
          <b className="text-center">Thao tác</b>
        </div>

        {/* Food items */}
        {list.map((item, index) => (
          <div key={index} className="md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-white text-sm">
            <img src={item.images[0]} className="w-20 h-20" alt={item.name} />
            {editMode === item._id ? (
              <>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border p-1"
                />
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="border p-1"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button onClick={() => updateFood(item._id)} className="text-center text-blue-700">Lưu</button>
                <button onClick={() => setEditMode(null)} className="text-center text-gray-500">Hủy</button>
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <button onClick={() => {
                  setEditMode(item._id); 
                  setEditData({ name: item.name, category: item.category }); // Thiết lập dữ liệu để chỉnh sửa
                }} className="text-center text-blue-700">Sửa</button>
                <button onClick={() => removeFood(item._id)} className="text-center text-red-700">Xóa</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
