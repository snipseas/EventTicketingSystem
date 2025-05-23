import React, { useEffect, useState } from 'react';
import EventList from '../components/event/EventList';
import axios from 'axios';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/events')
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    setFiltered(
      events.filter(ev =>
        ev.name?.toLowerCase().includes(search.toLowerCase()) ||
        ev.description?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, events]);

  return (
    <div>
      <h2>Browse Events</h2>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <EventList events={filtered.length ? filtered : events} />
    </div>
  );
};

export default EventListPage;