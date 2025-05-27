import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../services/api';
import { toast } from 'react-toastify';

const BookingHistory = () => {
    const [bookingsList, setBookingsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        bookings.getMyBookings()
            .then(res => {
                setBookingsList(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load bookings');
                setLoading(false);
            });
    }, []);

    const handleCancel = async (id) => {
        setCancelingId(id);
        try {
            await bookings.cancel(id);
            setBookingsList(prev =>
                prev.map(b => b._id === id ? { ...b, status: 'Canceled' } : b)
            );
            toast.success('Booking cancelled successfully');
        } catch (error) {
            toast.error('Failed to cancel booking');
        } finally {
            setCancelingId(null);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!bookingsList.length) return <div>No bookings found.</div>;

    return (
        <div className="booking-history-page">
            <h2>My Bookings</h2>
            <ul>
                {bookingsList.map(booking => (
                    <li key={booking._id} className="booking-item">
                        <div>
                            <strong>Event:</strong> {booking.event?.title} <br />
                            <strong>Date:</strong> {new Date(booking.event?.date).toLocaleDateString()} <br />
                            <strong>Quantity:</strong> {booking.ticketQuantity} <br />
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