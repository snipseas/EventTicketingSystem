import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { password: newPassword }),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// Events endpoints
export const events = {
    getAll: (filters) => api.get('/events', { params: filters }),
    getById: (id) => api.get(`/events/${id}`),
    create: (eventData) => api.post('/events', eventData),
    update: (id, eventData) => api.put(`/events/${id}`, eventData),
    delete: (id) => api.delete(`/events/${id}`),
    getMyEvents: () => api.get('/events/organizer'),
    getAnalytics: (eventId) => api.get(`/events/${eventId}/analytics`),
    updateStatus: (eventId, status) => api.patch(`/events/${eventId}/status`, { status })
};

// Bookings endpoints
export const bookings = {
    create: (eventId, quantity) => api.post(`/bookings`, { eventId, quantity }),
    getUserBookings: () => api.get('/bookings/user'),
    getBookingDetails: (id) => api.get(`/bookings/${id}`),
    cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
    getEventBookings: (eventId) => api.get(`/bookings/event/${eventId}`)
};

// Admin endpoints
export const admin = {
    getAllUsers: () => api.get('/admin/users'),
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getAllEvents: (status) => api.get('/admin/events', { params: { status } }),
    approveEvent: (eventId) => api.patch(`/admin/events/${eventId}/approve`),
    rejectEvent: (eventId) => api.patch(`/admin/events/${eventId}/reject`),
    getStats: () => api.get('/admin/stats')
};

export default api;