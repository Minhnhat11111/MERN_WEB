import React, { useState } from 'react';
import './Signup.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Signup = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/register', formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Đăng ký thành công!');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Đăng ký thất bại!');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Đăng ký</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            name="name"  // Thêm thuộc tính name
            value={formData.name} 
            onChange={handleChange} 
            className="form-input" 
            placeholder='Tên...' 
            required 
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="phone"  // Thêm thuộc tính name
            value={formData.phone}
            onChange={handleChange} 
            className="form-input" 
            placeholder='Số điện thoại...' 
            required 
          />
        </div>

        <div className="form-group">
          <input 
            type="email" 
            name="email"  // Thêm thuộc tính name
            value={formData.email}
            onChange={handleChange} 
            className="form-input" 
            placeholder='Email...' 
            required 
          />
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="password"  // Thêm thuộc tính name
            value={formData.password}
            onChange={handleChange} 
            className="form-input" 
            placeholder='Mật khẩu...' 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Đăng ký</button>
      </form>
      <p className="login-prompt">
        Bạn đã có tài khoản? <Link to="/login" className="register-link">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default Signup;