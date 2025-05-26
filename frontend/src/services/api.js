import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication Endpoints
export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.put('/forgetPassword', { email });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/logout');
    return response.data;
};

export default api;