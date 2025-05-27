import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, isOrganizer }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/events/${event._id}`);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.title}
                </Typography>
                <Typography color="text.secondary">
                    {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                    {event.location}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleViewDetails}>
                    View Details
                </Button>
                {isOrganizer && (
                    <Button size="small" onClick={() => navigate(`/my-events/${event._id}/edit`)}>
                        Edit Event
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default EventCard;