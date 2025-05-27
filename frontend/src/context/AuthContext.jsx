import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api'; // Use the auth object from api.js
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for existing session
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await auth.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('Profile fetch error:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Get default route based on user role
    const getDefaultRoute = (userRole) => {
        switch (userRole) {
            case 'admin':
                return '/admin';
            case 'organizer':
                return '/my-events';
            case 'user':
                return '/my-bookings';
            default:
                return '/';
        }
    };

    // Login function
    const login = async (credentials) => {
        try {
            const response = await auth.login(credentials);
            
            if (!response.data || !response.data.token) {
                throw new Error('Invalid response from server');
            }

            const { token, ...userData } = response.data;
            
            // Set auth data
            localStorage.setItem('token', token);
            setUser(userData);

            // Get redirect path from location state or use role-based default
            const from = location.state?.from?.pathname || getDefaultRoute(userData.role);
            navigate(from, { replace: true });

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            setUser(null);
            
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login', { replace: true });
    };

    // Register function
    const register = async (userData) => {
        try {
            await auth.register(userData);
            navigate('/login', { replace: true });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed'
            };
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

    const value = {
        user,
        login,
        logout,
        register,
        forgotPassword,
        loading
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);