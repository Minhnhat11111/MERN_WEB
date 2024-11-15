// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context cho Auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user và token từ localStorage khi ứng dụng khởi động
    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && userData !== 'undefined') {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
            }
        }

        // Xóa token nếu không hợp lệ
        if (!token) {
            localStorage.removeItem('token');
        }
    }, []);

    // Hàm login để lưu thông tin người dùng và token vào localStorage
    const login = (userData, token) => {
        console.log('Login function called with:', userData, token);
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token); // Lưu token vào localStorage
            console.log('User and token saved:', { userData, token });
        }
    };

    // Hàm logout để xóa thông tin người dùng và token khỏi localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('User logged out, storage cleared');
    };

    // Hàm kiểm tra trạng thái đăng nhập
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    // Hàm để lấy token
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Hàm cập nhật thông tin user
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

// Hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
