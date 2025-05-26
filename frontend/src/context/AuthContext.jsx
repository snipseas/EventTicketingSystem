import React, { createContext, useContext, useState } from 'react';
import api from '../services/api'; // Axios instance
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            navigate('/');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        try {
            await api.post('/register', userData);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password function
    const forgotPassword = async (email) => {
        await api.put('/forgetPassword', { email });
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, forgotPassword, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);