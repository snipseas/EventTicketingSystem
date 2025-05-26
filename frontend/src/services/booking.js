import axios from 'axios';

export const createBooking = (bookingData) =>
    axios.post('/api/v1/bookings', bookingData);

export const getBookingById = (id) =>
    axios.get(`/api/v1/bookings/${id}`);

export const cancelBooking = (id) =>
    axios.delete(`/api/v1/bookings/${id}`);