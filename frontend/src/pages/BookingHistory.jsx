import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelingId, setCancelingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get('/api/v1/bookings/my')
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load bookings.');
                setLoading(false);
            });
    }, []);

    const handleCancel = (id) => {
        setCancelingId(id);
        axios.put(`/api/v1/bookings/${id}/cancel`)
            .then(() => {
                setBookings(prev =>
                    prev.map(b => b._id === id ? { ...b, status: 'Canceled' } : b)
                );
                setCancelingId(null);
            })
            .catch(() => {
                setError('Failed to cancel booking.');
                setCancelingId(null);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!bookings.length) return <div>No bookings found.</div>;

    return (
        <div className="booking-history-page">
            <h2>My Bookings</h2>
            <ul>
                {bookings.map(booking => (
                    <li key={booking._id} className="booking-item">
                        <div>
                            <strong>Event:</strong> {booking.event?.name} <br />
                            <strong>Date:</strong> {booking.event?.date} <br />
                            <strong>Quantity:</strong> {booking.quantity} <br />
                            <strong>Total Price:</strong> ${booking.totalPrice} <br />
                            <strong>Status:</strong> {booking.status}
                        </div>
                        <div>
                            <button onClick={() => navigate(`/bookings/${booking._id}`)}>
                                View Details
                            </button>
                            {booking.status === 'Confirmed' && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    disabled={cancelingId === booking._id}
                                >
                                    {cancelingId === booking._id ? 'Canceling...' : 'Cancel'}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingHistory;