import React, { useState } from 'react';
import axios from 'axios';

const BookTicketForm = ({ event }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const maxTickets = event.availableTickets;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/v1/bookings', {
        eventId: event._id || event.id,
        tickets: quantity,
      });
      setSuccess('Booking successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Quantity:
        <input
          type="number"
          min={1}
          max={maxTickets}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
        />
      </label>
      <div>Total Price: ${quantity * (event.price || event.ticketPrice)}</div>
      {error && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
      <button type="submit" disabled={loading || quantity > maxTickets}>
        {loading ? 'Booking...' : 'Book'}
      </button>
    </form>
  );
};

export default BookTicketForm;