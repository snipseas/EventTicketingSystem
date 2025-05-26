import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', minWidth: '200px' }}>
          <h2>Event Management</h2>
          <p>View, approve, or decline all events.</p>
          <button onClick={() => navigate('/admin/events')}>Manage Events</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', minWidth: '200px' }}>
          <h2>User Management</h2>
          <p>View, update roles, or delete users.</p>
          <button onClick={() => navigate('/admin/users')}>Manage Users</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;