import axios from 'axios';

export const register = (userData) =>
    axios.post('/api/v1/auth/register', userData);

export const login = (credentials) =>
    axios.post('/api/v1/auth/login', credentials);

export const forgotPassword = (email) =>
    axios.put('/api/v1/auth/forgetPassword', { email });