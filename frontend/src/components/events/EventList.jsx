import React, { useState, useEffect } from 'react';
import {
    Grid,
    Container,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from '@mui/material';
import { events } from '../../services/api';
import EventCard from './EventCard';
import Loader from '../shared/Loader';
import { toast } from 'react-toastify';

const EventList = ({ isOrganizer = false }) => {
    const [loading, setLoading] = useState(true);
    const [eventsList, setEventsList] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'date',
        order: 'asc'
    });

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await (isOrganizer ? events.getMyEvents() : events.getAll(filters));
            setEventsList(response.data);
        } catch (error) {
            toast.error('Failed to fetch events');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <Loader />;

    const filteredEvents = eventsList.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <Container>
            <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h4" gutterBottom>
                    {isOrganizer ? 'My Events' : 'Events'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search events"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                label="Sort By"
                            >
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                                <MenuItem value="title">Title</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Order</InputLabel>
                            <Select
                                name="order"
                                value={filters.order}
                                onChange={handleFilterChange}
                                label="Order"
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={3}>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <EventCard event={event} isOrganizer={isOrganizer} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            No events found
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default EventList;