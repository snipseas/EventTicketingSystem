import React from 'react';
import { 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Typography, 
    Box,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarToday, LocationOn, LocalOffer } from '@mui/icons-material';

const EventCard = ({ event, isOrganizer }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/events/${event._id}`);
    };

    const handleBookNow = () => {
        navigate(`/events/${event._id}`);
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/event-placeholder.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${import.meta.env.VITE_API_URL}/uploads/events/${imageUrl}`;
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <img
                src={getImageUrl(event.image)}
                alt={event.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                    {event.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {event.description?.substring(0, 100)}...
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">
                        {new Date(event.date).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">
                        {event.location}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalOffer sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2">
                        ${event.price}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Chip 
                        label={event.status.toUpperCase()} 
                        color={event.status === 'approved' ? 'success' : 'warning'}
                        size="small"
                    />
                </Box>
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={handleViewDetails}
                    fullWidth
                >
                    View Details
                </Button>
                {!isOrganizer && event.status === 'approved' && (
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        onClick={handleBookNow}
                        fullWidth
                    >
                        Book Now
                    </Button>
                )}
                {isOrganizer && (
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="secondary"
                        onClick={() => navigate(`/my-events/${event._id}/edit`)}
                        fullWidth
                    >
                        Edit Event
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default EventCard;