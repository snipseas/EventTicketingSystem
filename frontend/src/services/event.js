  import axios from 'axios';

export const getApprovedEvents = () =>
    axios.get('/api/v1/events');

export const getEventById = (id) =>
    axios.get(`/api/v1/events/${id}`);

export const createEvent = (eventData) =>
    axios.post('/api/v1/events', eventData);

export const updateEvent = (id, eventData) =>
    axios.put(`/api/v1/events/${id}`, eventData);

export const deleteEvent = (id) =>
    axios.delete(`/api/v1/events/${id}`);

export const updateEventStatus = (id, status) =>
    axios.put(`/api/v1/events/${id}/status`, { status });

export const getEventAnalytics = () =>
    axios.get('/api/v1/events/analytics');