import React, { useEffect, useState } from 'react';
import { getMyEvents } from '../services/eventOrganizer';
import EventAnalytics from '../components/event/EventAnalytics';

const EventAnalyticsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getMyEvents().then(setEvents);
  }, []);

  return (
    <div>
      <h2>My Events Analytics</h2>
      {events.map(ev => (
        <div key={ev._id} style={{ marginBottom: 40 }}>
          <h3>{ev.title}</h3>
          <EventAnalytics eventId={ev._id} />
        </div>
      ))}
    </div>
  );
};

export default EventAnalyticsPage;