import React from "react";
import './Footer.css';



const Footer = () => {
  return (
    <footer>
      <div className="footer-line"><hr /></div>

      <div className="footer-container">
        <div className="footer-info">

          <div className="footer-logo">
            <div className="logo">
              Tewaiseuu
            </div>

            <div className="logo-name">
              TAIWAN FOOD RESTAURANT
            </div>
          </div>

          <div className="footer-nav">
            <h2>Tewaiseuu</h2>
            <ul>
              <li>Trang chủ</li>
              <li>Menu</li>
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
              <li>Đặt bàn</li>
              <li>Đánh giá</li>
            </ul>
          </div>

          <div className="footer-contact">
            <h2>Contact</h2>
            <ul>
              <li>Email: Tewaiseuu@gmail.com</li>
              <li>Liên hệ: 0332-225-552</li>
              <li>Địa chỉ: Huflit Hóc Môn</li>
            </ul>
            <br />
            <h2>Đăng ký</h2>
            <p style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>nhập email...</p>
          </div>

          <div className="footer-media">
              <h2>Mạng xã hội</h2>
              <div className="social-media-icons">
               <i className="fa-brands fa-facebook"></i>
               <i className="fa-brands fa-instagram"></i>
               <i className="fa-brands fa-telegram"></i>
              </div>
          </div>
        </div>

        <div className="footer-year">
          <hr />
          <p>Copyright &copy; 2024 by HaNaTi Team</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
