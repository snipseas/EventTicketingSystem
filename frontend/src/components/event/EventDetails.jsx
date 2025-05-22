import React from 'react';

const EventDetails = ({ event }) => {
  if (!event) return null;
  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
      <p><strong>Location:</strong> {event.location}</p>
  
    </div>
  );
};

export default EventDetails;