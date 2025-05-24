import axios from 'axios';

const API_URL = '/api/v1/users/events';

export const getMyEvents = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await axios.post(API_URL, eventData);
  return res.data;
};

export const updateEvent = async (eventId, eventData) => {
  const res = await axios.put(`${API_URL}/${eventId}`, eventData);
  return res.data;
};

export const getEventAnalytics = async (eventId) => {
  const res = await axios.get(`${API_URL}/${eventId}/analytics`);
  return res.data;
};