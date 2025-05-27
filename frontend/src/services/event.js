import api from './api';

export const getApprovedEvents = () =>
    api.get('/events');

export const getEventById = (id) =>
    api.get(`/events/${id}`);

export const createEvent = (eventData) =>
    api.post('/events', eventData);

export const updateEvent = (id, eventData) =>
    api.put(`/events/${id}`, eventData);

export const deleteEvent = (id) =>
    api.delete(`/events/${id}`);

export const updateEventStatus = (id, status) =>
    api.put(`/events/${id}/status`, { status });

export const getEventAnalytics = () =>
    api.get('/events/analytics');