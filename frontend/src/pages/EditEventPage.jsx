import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/event/EventForm';
import { updateEvent, getMyEvents } from '../services/eventOrganizer';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getMyEvents().then(events => {
      const found = events.find(ev => ev._id === eventId);
      setEvent(found);
    });
  }, [eventId]);

  const handleSubmit = async (data) => {
    await updateEvent(eventId, data);
    navigate('/my-events');
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Event</h2>
      <EventForm initialData={event} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditEventPage;