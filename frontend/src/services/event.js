import axios from 'axios';

// Fetch all events
export const fetchAllEvents = () => {
  return axios.get('/api/v1/events');
};

// Fetch a single event by ID
export const fetchEventById = (eventId) => {
  return axios.get(`/api/v1/events/${eventId}`);
};