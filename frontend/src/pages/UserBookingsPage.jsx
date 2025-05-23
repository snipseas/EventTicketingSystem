import React, { useEffect, useState } from 'react';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/bookings/my')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!bookings.length) return <div>No bookings found.</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            <strong>{booking.eventName}</strong> — {booking.quantity} ticket(s) — ${booking.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;