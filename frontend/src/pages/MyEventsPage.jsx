import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';

const MyEventsPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/my-events/new')}
                >
                    Create New Event
                </Button>
            </Box>
            <EventList isOrganizer={true} />
        </>
    );
};

export default MyEventsPage;