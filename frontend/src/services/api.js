import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.put('/auth/forgetPassword', { email }),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/users/profile')
};

// User endpoints
export const users = {
    getAllUsers: () => api.get('/users'), // Admin only
    getUserById: (id) => api.get(`/users/${id}`), // Admin only
    updateUserRole: (id, role) => api.put(`/users/${id}`, { role }), // Admin only
    deleteUser: (id) => api.delete(`/users/${id}`), // Admin only
    getMyBookings: () => api.get('/users/bookings'), // Standard User
    getMyEvents: () => api.get('/users/events'), // Event Organizer
    getEventAnalytics: () => api.get('/users/events/analytics'), // Event Organizer
};

// Events endpoints
export const events = {
    getAll: (filters) => api.get('/events', { params: filters }),
    getById: (id) => api.get(`/events/${id}`),
    create: (eventData) => api.post('/events', eventData),
    update: (id, eventData) => api.put(`/events/${id}`, eventData),
    delete: (id) => api.delete(`/events/${id}`),
    getMyEvents: () => api.get('/events/my-events'),
    updateStatus: (id, status) => api.patch(`/events/${id}/status`, { status })
};

// Bookings endpoints
export const bookings = {
    create: (eventId, ticketQuantity) => api.post('/bookings', { 
        eventId, 
        ticketQuantity: parseInt(ticketQuantity) 
    }),
    getMyBookings: () => api.get('/bookings/my-bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.delete(`/bookings/${id}`)
};

// Admin endpoints
export const admin = {
    getAllUsers: () => api.get('/admin/users'),
    updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getAllEvents: (status) => api.get('/admin/events', { params: status ? { status } : {} }),
    getAnalytics: () => api.get('/admin/analytics')
};

export default api;