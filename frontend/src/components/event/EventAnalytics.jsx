import React, { useEffect, useState } from 'react';
import { getEventAnalytics } from '../../services/eventOrganizer';
import { Bar } from 'react-chartjs-2';

const EventAnalytics = ({ eventId }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getEventAnalytics(eventId).then(data => {
      if (Array.isArray(data)) {
        const eventData = data.find(ev => ev.eventId === eventId);
        setAnalytics(eventData);
      } else {
        setAnalytics(data);
      }
    });
  }, [eventId]);

  if (!analytics) return <div>Loading analytics...</div>;

  const data = {
    labels: ['Sold Tickets', 'Available Tickets'],
    datasets: [
      {
        label: analytics.name || 'Tickets',
        data: [analytics.soldTickets, analytics.availableTickets],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(192,75,75,0.6)'],
      },
    ],
  };

  return (
    <div>
      <h3>Event Analytics</h3>
      <Bar data={data} />
    </div>
  );
};

export default EventAnalytics;