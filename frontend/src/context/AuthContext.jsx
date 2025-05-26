import React, { createContext, useContext, useState } from 'react';
import { auth } from '../services/api'; // Use the auth object from api.js
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Login function
    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await auth.login({ email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        try {
            await auth.register(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password function
    const forgotPassword = async (email) => {
        setLoading(true);
        try {
            await auth.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to send reset instructions' };
        } finally {
            setLoading(false);
        }
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