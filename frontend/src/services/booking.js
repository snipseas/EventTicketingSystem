import api from './api';

export const createBooking = (bookingData) =>
    api.post('/bookings', bookingData);

export const getBookingById = (id) =>
    api.get(`/bookings/${id}`);

export const cancelBooking = (id) =>
    api.delete(`/bookings/${id}`);