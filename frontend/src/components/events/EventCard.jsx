import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { CalendarToday, LocationOn, LocalOffer } from '@mui/icons-material';

const EventCard = ({ event, showActions = true, isOrganizer = false }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'declined': return 'error';
            default: return 'default';
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/event-placeholder.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${import.meta.env.VITE_API_URL}/uploads/events/${imageUrl}`;
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
                component="img"
                height="200"
                image={getImageUrl(event.image)}
                alt={event.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {event.title}
                </Typography>
                {event.status && (
                    <Chip
                        label={event.status.toUpperCase()}
                        color={getStatusColor(event.status)}
                        size="small"
                        sx={{ mb: 1 }}
                    />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                        {new Date(event.date).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{event.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalOffer fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">${event.price}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description?.slice(0, 150)}...
                </Typography>
                {showActions && (
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/events/${event._id}`)}
                        >
                            View Details
                        </Button>
                        {isOrganizer && (
                            <Box>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/my-events/${event._id}/edit`)}
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => navigate(`/my-events/${event._id}/delete`)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default EventCard; 