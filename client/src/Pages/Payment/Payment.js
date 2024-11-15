import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin số tiền thanh toán từ location state
  const { reservationId, amount } = location.state || {};
  
  // Kiểm tra sự tồn tại của reservationId và amount
  if (!reservationId || !amount) {
    toast.error('Không tìm thấy thông tin thanh toán');
    navigate('/'); // Quay về trang chủ nếu thiếu thông tin thanh toán
    return null;
  }

  const handlePayment = async () => {
    try {
      // Gửi yêu cầu thanh toán đến server để nhận liên kết MoMo
      const response = await axios.post("http://localhost:4000/api/payment", { 
        reservationId, 
        amount 
      });

      if (response.data && response.data.link) {
        // Mở cổng thanh toán MoMo
        window.location.href = response.data.link; // Chuyển hướng đến trang thanh toán MoMo
      } else {
        toast.error('Không thể tạo liên kết thanh toán');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Không thể tạo liên kết thanh toán');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    // Xử lý kết quả thanh toán từ MoMo
    try {
      const response = await axios.post("http://localhost:4000/api/payment/success", paymentData);

      if (response.data.success) {
        toast.success('Thanh toán thành công!');
        navigate('/confirmation', { state: { reservationId, amount } });
      } else {
        toast.error('Thanh toán không thành công');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Lỗi khi xử lý thanh toán');
    }
  };

  return (
    <div className="payment-container">
      <h2>Thông tin thanh toán</h2>
      <p>Số tiền cần thanh toán: {amount.toLocaleString()} VND</p>
      <button onClick={handlePayment}>
        Thanh toán
      </button>
    </div>
  );
};

export default PaymentPage;
