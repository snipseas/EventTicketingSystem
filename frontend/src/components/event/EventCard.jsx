import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>{event.location}</p>
      <button onClick={handleViewDetails}>View Details</button>
    </div>
  );
};

export default EventCard;