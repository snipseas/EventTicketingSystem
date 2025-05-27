import React, { useState } from 'react';
import { bookings } from '../../services/api';
import { toast } from 'react-toastify';

const BookTicketForm = ({ event }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const maxTickets = event.availableTickets;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await bookings.create(event._id, quantity);
            toast.success('Booking successful!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
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
            <div>Total Price: ${quantity * event.price}</div>
            <button type="submit" disabled={loading || quantity > maxTickets}>
                {loading ? 'Booking...' : 'Book'}
            </button>
        </form>
    );
};

export default BookTicketForm;