import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment
} from '@mui/material';
import { events } from '../../services/api';
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const EventForm = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date(),
        location: '',
        price: '',
        ticketCount: '',
        image: null
    });

    useEffect(() => {
        if (isEdit && id) {
            fetchEventDetails();
        }
    }, [isEdit, id]);

    const fetchEventDetails = async () => {
        try {
            const response = await events.getById(id);
            const event = response.data;
            setFormData({
                ...event,
                date: new Date(event.date)
            });
        } catch (error) {
            toast.error('Failed to fetch event details');
            navigate('/my-events');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (newDate) => {
        setFormData(prev => ({
            ...prev,
            date: newDate
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (isEdit) {
                await events.update(id, formDataToSend);
                toast.success('Event updated successfully');
            } else {
                await events.create(formDataToSend);
                toast.success('Event created successfully');
            }
            navigate('/my-events');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEdit ? 'Edit Event' : 'Create New Event'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Event Date & Time"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    slotProps={{ textField: { fullWidth: true, required: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Price</InputLabel>
                                <OutlinedInput
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Price"
                                    required
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Available Tickets"
                                name="ticketCount"
                                value={formData.ticketCount}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload">
                                <Button variant="outlined" component="span" fullWidth>
                                    {formData.image ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </label>
                            {formData.image && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Selected: {typeof formData.image === 'string' ? formData.image : formData.image.name}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/my-events')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EventForm;