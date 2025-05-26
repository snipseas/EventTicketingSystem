// frontend/src/services/admin.js
import axios from 'axios';

// Fetch all users
export const fetchAllUsers = () => axios.get('/api/v1/admin/users');

// Update user role
export const updateUserRole = (userId, role) =>
    axios.put(`/api/v1/admin/users/${userId}/role`, { role });

// Delete a user
export const deleteUser = (userId) =>
    axios.delete(`/api/v1/admin/users/${userId}`);

// Fetch all events (optionally with status filter)
export const fetchAllEvents = (status) =>
    axios.get('/api/v1/admin/events', { params: status ? { status } : {} });

// Approve an event
export const approveEvent = (eventId) =>
    axios.put(`/api/v1/admin/events/${eventId}/approve`);

// Reject an event
export const rejectEvent = (eventId) =>
    axios.put(`/api/v1/admin/events/${eventId}/reject`);

// Delete an event
export const deleteEvent = (eventId) =>
    axios.delete(`/api/v1/admin/events/${eventId}`);