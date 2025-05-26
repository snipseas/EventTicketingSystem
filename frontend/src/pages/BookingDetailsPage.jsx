import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/v1/bookings/${id}`)
            .then(res => {
                setBooking(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load booking details.');
                setLoading(false);
            });
    }, [id]);

    const handleCancel = () => {
        setCanceling(true);
        axios.put(`/api/v1/bookings/${id}/cancel`)
            .then(() => {
                setBooking(prev => ({ ...prev, status: 'Canceled' }));
                setCanceling(false);
            })
            .catch(() => {
                setError('Failed to cancel booking.');
                setCanceling(false);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!booking) return <div>No booking found.</div>;

    return (
        <div className="booking-details-page">
            <h2>Booking Details</h2>
            <p><strong>Event:</strong> {booking.event?.name}</p>
            <p><strong>Date:</strong> {booking.event?.date}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            {booking.status === 'Confirmed' && (
                <button onClick={handleCancel} disabled={canceling}>
                    {canceling ? 'Canceling...' : 'Cancel Booking'}
                </button>
            )}
            <button onClick={() => navigate('/bookings')}>Back to Bookings</button>
        </div>
    );
};

export default BookingDetailsPage;