import React from 'react';
import './Contact.css'; // Nếu bạn có file CSS riêng cho styling

const Contact = () => {
  return (
    <div className="content-box">
      <div className="title">
        <h1>Contact</h1>
      </div>

      <div className="main-content">
        <div className="contact-img">
          <img src="/assets/map.png" alt="Map" />
        </div>

        <div className="contacts">
          <div className="contact-info">
            <h2>THÔNG TIN LIÊN LẠC</h2>
            <p>EMAIL : TEWAISEUU@GMAIL.COM</p>
            <p>LIÊN HỆ : 0222555888</p>
            <p>ĐỊA CHỈ : HUFLIT HÓC MÔN</p>
          </div>

          <div className="contact-staytuned">
            <h2>GỬI EMAIL TẠI ĐÂY</h2>
            <input type="text" placeholder="nhập email..." />
          </div>

          <div className="contact-last">
            <div className="contact-social">
              <h2>MẠNG XÃ HỘI KHÁC</h2>
              <p>INSTAGRAM</p>
              <p>FACEBOOK</p>
              <p>TELEGRAM</p>
            </div>

            <div className="contact-work-hour">
              <h2>GIỜ LÀM VIỆC</h2>
              <p>THỨ BA ĐẾN CHỦ NHẬT</p>
              <p>9A.M - 23P.M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;