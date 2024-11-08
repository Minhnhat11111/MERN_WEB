// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    }, []);
  
    const login = (userData, token) => {
      console.log('Login function called with:', userData);
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token); // Lưu token vào localStorage
        console.log('User and token saved:', { userData, token });
      }
    };
  
    const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('User logged out, storage cleared');
    };

    // Thêm hàm để kiểm tra trạng thái đăng nhập
    const isAuthenticated = () => {
      return !!user && !!localStorage.getItem('token');
    };

    // Thêm hàm để lấy token
    const getToken = () => {
      return localStorage.getItem('token');
    };

    // Thêm hàm để cập nhật thông tin user
    const updateUser = (newUserData) => {
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
    };
  
    return (
      <AuthContext.Provider value={{ 
        user, 
        login, 
        logout,
        isAuthenticated,
        getToken,
        updateUser
      }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};