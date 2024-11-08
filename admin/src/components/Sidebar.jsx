// eslint-disable-next-line no-unused-vars
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Slidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
       <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
          
          <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/add">
             <img className='w-5 h-5' src={assets.add_icon} alt=''/>
             <p className='hidden md:block'>Thêm món </p>
           </NavLink>
           
           <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/table">
             <img className='w-5 h-5' src={assets.add_icon} alt=''/>
             <p className='hidden md:block'>Thêm bàn </p>
          </NavLink>
        

          <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
             <img className='w-5 h-5' src={assets.order_icon} alt=''/>
             <p className='hidden md:block'>Menu</p>
          </NavLink>


          <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/reservation">
             <img className='w-5 h-5' src={assets.order_icon} alt=''/>
             <p className='hidden md:block'>Đặt bàn </p>
           </NavLink>
           

       </div>
    </div>
  )
}

export default Slidebar