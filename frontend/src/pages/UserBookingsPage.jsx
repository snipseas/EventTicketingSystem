import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    axios.get('/api/v1/bookings/my')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCanceling(bookingId);
    setError('');
    try {
      await axios.delete(`/api/v1/bookings/${bookingId}`);
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
    } finally {
      setCanceling('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bookings.length) return <div>No bookings found.</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {bookings.map(booking => (
          <li key={booking._id || booking.id}>
            <strong>{booking.event?.title || booking.eventName}</strong> — {booking.ticketsBooked || booking.tickets} ticket(s) — ${booking.totalPrice}
            <button
              onClick={() => handleCancel(booking._id || booking.id)}
              disabled={canceling === (booking._id || booking.id)}
            >
              {canceling === (booking._id || booking.id) ? 'Canceling...' : 'Cancel'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;