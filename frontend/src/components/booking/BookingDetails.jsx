import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingDetails = ({ bookingId, onClose }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/v1/bookings/${bookingId}`)
      .then(res => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="modal">
      <h3>Booking Details</h3>
      <p><strong>Event:</strong> {booking.event?.title || booking.eventName}</p>
      <p><strong>Quantity:</strong> {booking.ticketsBooked || booking.tickets}</p>
      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BookingDetails;