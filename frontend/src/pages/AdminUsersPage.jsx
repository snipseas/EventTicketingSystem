import React, { useEffect, useState } from 'react';
import api from '../services/api';
import UserRow from '../components/admin/UserRow';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [reload]);

  // For child components to trigger reload
  const refresh = () => setReload(r => !r);

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user._id} user={user} onAction={refresh} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;