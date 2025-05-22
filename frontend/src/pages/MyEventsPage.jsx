import React, { useEffect, useState } from 'react';
import { getMyEvents } from '../services/eventOrganizer';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  approved: 'green',
  pending: 'orange',
  declined: 'red',
};

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents().then(setEvents);
  }, []);

  return (
    <div>
      <h2>My Events</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.date}</td>
              <td>
                <span style={{ color: statusColors[ev.status] || 'gray' }}>
                  {ev.status}
                </span>
              </td>
              <td>
                <button onClick={() => navigate(`/edit-event/${ev._id}`)}>Edit</button>
                <button onClick={() => navigate(`/analytics`)}>Analytics</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyEventsPage;