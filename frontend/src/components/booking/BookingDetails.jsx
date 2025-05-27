import React, { useEffect, useState } from 'react';
import { bookings } from '../../services/api';
import { toast } from 'react-toastify';

const BookingDetails = ({ bookingId, onClose }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookings.getById(bookingId)
      .then(res => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load booking details');
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="modal">
      <h3>Booking Details</h3>
      <p><strong>Event:</strong> {booking.event?.title}</p>
      <p><strong>Quantity:</strong> {booking.ticketQuantity}</p>
      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BookingDetails;