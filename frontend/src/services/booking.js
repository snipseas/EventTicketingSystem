import axios from './api';

// Fetch bookings for current user
export const getUserBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

// Cancel booking by booking ID
export const cancelBooking = async (bookingId) => {
  const response = await api.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};
