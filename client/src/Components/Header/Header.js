import React from 'react';
import { Helmet } from 'react-helmet';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  console.log('Current user in Header:', user);
  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <div className="header">
        <div className="logo-info" style={{ cursor: 'none' }}>
          <div className="logo">
            Tewaiseuu
          </div>
          <div className="logo-name">
            TAIWAN FOOD RESTAURANT
          </div>
        </div>

        <div className="bar">
          <i className="fa-solid fa-list fa-2xl"></i>
          <i className="fa-solid fa-x fa-2xl"></i>
        </div>

        <div className="nav-bar">
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/reservation"><button className='book-btn'>Đặt bàn</button></Link></li>
            {user ? (
                <li>
                  <div className="user-menu">
                    <span>Chào, {user.name}</span>
                    <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                  </div>
                </li>
              ) : (
                <li><Link to="/login" className="login-btn">Đăng nhập</Link></li>
              )}
          </ul>
        </div>
      </div>
    </header>
  );
};
 
  
export default Header;
