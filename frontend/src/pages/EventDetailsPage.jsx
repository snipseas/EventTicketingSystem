import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookTicketForm from '../components/booking/BookTicketForm';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>{event.name}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
      <BookTicketForm event={event} />
    </div>
  );
};

export default EventDetailsPage;