import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data));
  }, []);

  const handleStatus = async (eventId, status) => {
    await api.put(`/events/${eventId}/status`, { status });
    setEvents(events =>
      events.map(ev =>
        ev._id === eventId ? { ...ev, status } : ev
      )
    );
  };

  const filtered = filter === 'all' ? events : events.filter(ev => ev.status === filter);

  return (
    <div>
      <h2>All Events (Admin)</h2>
      <label>
        Filter:
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </label>
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
          {filtered.map(ev => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.date}</td>
              <td>{ev.status}</td>
              <td>
                {ev.status !== 'approved' && (
                  <button onClick={() => handleStatus(ev._id, 'approved')}>Approve</button>
                )}
                {ev.status !== 'declined' && (
                  <button onClick={() => handleStatus(ev._id, 'declined')}>Decline</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventsPage;