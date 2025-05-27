import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Chip,
    Divider,
    TextField
} from '@mui/material';
import { CalendarToday, LocationOn, LocalOffer, ConfirmationNumber } from '@mui/icons-material';
import { events, bookings } from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../shared/Loader';

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);

    useEffect(() => {
        if (!eventId) {
            toast.error('Invalid event ID');
            navigate('/events');
            return;
        }
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await events.getById(eventId);
            if (!response.data) {
                throw new Error('Event not found');
            }
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch event details';
            toast.error(errorMessage);
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }

        try {
            await bookings.create(eventId, ticketQuantity);
            toast.success('Booking successful!');
            fetchEventDetails(); // Refresh event details to update ticket count
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to book tickets');
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/event-placeholder.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${import.meta.env.VITE_API_URL}/uploads/events/${imageUrl}`;
    };

    if (loading) return <Loader />;
    if (!event) return null;

    const isAvailable = event.availableTickets > 0;
    const totalPrice = ticketQuantity * event.price;

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <img
                            src={getImageUrl(event.image)}
                            alt={event.title}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            {event.title}
                        </Typography>
                        {event.status && (
                            <Chip
                                label={event.status.toUpperCase()}
                                color={event.status === 'approved' ? 'success' : 'warning'}
                                sx={{ mb: 2 }}
                            />
                        )}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" paragraph>
                                {event.description}
                            </Typography>
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1 }} />
                                    <Typography>
                                        {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ mr: 1 }} />
                                    <Typography>{event.location}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocalOffer sx={{ mr: 1 }} />
                                    <Typography>${event.price}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ConfirmationNumber sx={{ mr: 1 }} />
                                    <Typography>
                                        {isAvailable 
                                            ? `${event.availableTickets} tickets available`
                                            : 'Sold Out'
                                        }
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        {user && user.role === 'user' && event.status === 'approved' && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Book Tickets
                                </Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            type="number"
                                            label="Quantity"
                                            value={ticketQuantity}
                                            onChange={(e) => setTicketQuantity(Math.max(1, Math.min(event.availableTickets, parseInt(e.target.value))))}
                                            InputProps={{ inputProps: { min: 1, max: event.availableTickets } }}
                                            disabled={!isAvailable}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="h6">
                                            Total: ${totalPrice}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleBooking}
                                            disabled={!isAvailable}
                                        >
                                            Book Now
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default EventDetails; 