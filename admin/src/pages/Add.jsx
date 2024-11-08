import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'


 const Add = ({token}) => {
  
  const [image1,setImage1] = useState(null) 

  const [name,setName] = useState("");
  const [category,setCategory] = useState("Món chính");



  //Hàm lưu dữ liệu thêm món vào database
  const onSubmitHandler = async(e) => {
    e.preventDefault();

    try {
      const formData = new FormData()
      formData.append("name",name)
      formData.append("category",category)

      image1 && formData.append("image1",image1)

      const response = await axios.post( "http://localhost:4000/api/food/add",formData,{headers:{token}})
      console.log(response.data)


      //Neu add thanh cong, hien thong bao
      if(response.data.success){
        toast.success(response.data.message)
        setName('')  //xoa ten mon an
        setImage1(false) //xoa hinh anh
      } else{ 
        toast.error(response.data.message)
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2 text-xl'>Tải ảnh</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='max-w-[800px] max-h-[200px] object-cover' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt=""/>
            <input onChange={(e) =>setImage1(e.target.files[0])} type="file" id="image1" hidden></input>
          </label>
          </div>
      </div>
      

     
      <div className='w-full'>
        <p className='mb-2 text-xl'>Tên món</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='nhập tên món..' required></input>
      </div>

      <div className='w-full'>
        <p className='mb-2 text-xl'>Danh mục</p>
        <select onChange={(e)=>setCategory(e.target.value)} className='w-full max-w-[500px] px-3 py-2' >
          <option value="Món chính">Món chính</option>
          <option value="Tráng miệng">Tráng miệng</option>
          <option value="Súp">Súp</option>
          <option value="Salads">Salads</option>
          <option value="Thức uống">Thức uống</option>

        </select>
      </div>
     
      <button className='w-28 py-3 mt-4 bg-blue-950 text-white' type="submit">THÊM</button>


      
    </form>
  )
}

export default Add
