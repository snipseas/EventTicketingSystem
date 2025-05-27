import React, { useEffect, useState } from 'react';
import { bookings } from '../services/api';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookings.getMyBookings();
      setBookingsList(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setBookingsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCanceling(bookingId);
    try {
      await bookings.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCanceling('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bookingsList.length) return <div>No bookings found.</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {bookingsList.map(booking => (
          <li key={booking._id}>
            <strong>{booking.event?.title}</strong> — {booking.ticketQuantity} ticket(s) — ${booking.totalPrice}
            <button
              onClick={() => handleCancel(booking._id)}
              disabled={canceling === booking._id}
            >
              {canceling === booking._id ? 'Canceling...' : 'Cancel'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;