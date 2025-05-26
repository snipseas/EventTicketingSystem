import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await auth.getProfile();
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await auth.login(credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return user;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await auth.register(userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return user;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setError(null);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await auth.updateProfile(data);
            setUser(response.data);
            setError(null);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Profile update failed');
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            await auth.forgotPassword(email);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset request failed');
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await auth.resetPassword(token, newPassword);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset failed');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword
    };

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 