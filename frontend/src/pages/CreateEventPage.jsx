import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/event/EventForm';
import { createEvent } from '../services/eventOrganizer';

const CreateEventPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createEvent(data);
    navigate('/my-events');
  };

  return (
    <div>
      <h2>Create Event</h2>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateEventPage;