import axios from 'axios';

export const getUserProfile = () =>
    axios.get('/api/v1/users/profile');

export const updateUserProfile = (profileData) =>
    axios.put('/api/v1/users/profile', profileData);

export const getAllUsers = () =>
    axios.get('/api/v1/users');

export const getUserById = (id) =>
    axios.get(`/api/v1/users/${id}`);

export const updateUserRole = (id, role) =>
    axios.put(`/api/v1/users/${id}`, { role });

export const deleteUser = (id) =>
    axios.delete(`/api/v1/users/${id}`);

export const getMyBookings = () =>
    axios.get('/api/v1/users/bookings');

export const getMyEvents = () =>
    axios.get('/api/v1/users/events');

export const getMyEventAnalytics = () =>
    axios.get('/api/v1/users/events/analytics');