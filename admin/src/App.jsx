// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes,Route} from 'react-router-dom'
import  Add  from './pages/Add'
import List from './pages/List'
import Login from './components/Login'
import  TableManagement from './pages/Table'
import { ToastContainer } from 'react-toastify';
import Tables from './pages/Tables'
import 'react-toastify/dist/ReactToastify.css';
import ReservationList from './pages/ReservationList';
import AdminReviews from './pages/Review.jsx'
import UserList from './pages/Userlist.jsx'


export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

useEffect(()=>{
  localStorage.setItem('token',token)
},[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
      ? <Login setToken={setToken}/>
      :  <>
      <Navbar setToken={setToken}/>
      <hr />
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[70%] mx-auto ml[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/table' element={<TableManagement />} />
                <Route path='/reservations' element={<ReservationList />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/review' element={<AdminReviews />} />
                <Route path='/user' element={<UserList/>} />
                <Route path='/tables' element={<Tables/>} />
            <Route path='/list' element={<List token ={token}/>} />
          </Routes>
        </div>
      </div>
     </>
      }

 </div>
  )
}

export default App