import React, { useState } from 'react';
import './Login.css'; 
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  import { useAuth } from '../../context/AuthContext';

const Login = () => {


  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/login', {
        email,
        password
      });

      console.log('Response from server:', response.data);

      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại!');
      console.error(error);
    }
};

  return (
    

    <div className="login-container">
    <h2 className="login-title">Đăng nhập</h2>
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        
        <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder='email...' required />
      </div>
      <div className="form-group">
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder='mật khẩu...' required />
      </div>
      <button type="submit" className="submit-btn">Đăng nhập</button>

      <div className="google-login">
        <button className="btn-google-btn">
        Đăng Nhập với Google
          <i className="fa-brands fa-google"></i> {/* Đảm bảo bạn đã cài đặt Font Awesome */}
        </button>
      </div>
    </form>
    <p className="register-prompt">
      Bạn chưa có tài khoản? <Link to="/sign-up" className="register-link">Đăng ký ngay</Link>
    </p>
      
  </div>
  );
};

export default Login;




