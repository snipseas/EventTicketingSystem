import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Box,
    Button
} from '@mui/material';
import { Event, LocationOn, CalendarToday } from '@mui/icons-material';
import { bookings } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/shared/Loader';

const MyBookingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [bookingsList, setBookingsList] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookings.getUserBookings();
            setBookingsList(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await bookings.cancelBooking(bookingId);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) return <Loader />;

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                My Bookings
            </Typography>
            <Grid container spacing={3}>
                {bookingsList.length > 0 ? (
                    bookingsList.map((booking) => (
                        <Grid item xs={12} md={6} key={booking._id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6">
                                            {booking.event.title}
                                        </Typography>
                                        <Chip
                                            label={booking.status.toUpperCase()}
                                            color={getStatusColor(booking.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Event sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationOn sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            {booking.event.location}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CalendarToday sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            {new Date(booking.event.date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    {booking.status !== 'cancelled' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleCancelBooking(booking._id)}
                                            fullWidth
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            No bookings found
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default MyBookingsPage; 