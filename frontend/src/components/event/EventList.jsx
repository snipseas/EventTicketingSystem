import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events }) => {
  // Filter only approved events
  const approvedEvents = events.filter(event => event.status === 'approved');

  return (
    <div className="event-list">
      {approvedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;