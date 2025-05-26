import React, { useState } from 'react';
import api from '../../services/api';

const roles = ['user', 'organizer', 'admin'];

const UpdateUserRoleModal = ({ user, onClose, onUpdated }) => {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/users/${user._id}`, { role });
      onUpdated();
      onClose();
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Update Role for {user.name}</h3>
      <select value={role} onChange={e => setRole(e.target.value)}>
        {roles.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      {error && <div style={{color:'red'}}>{error}</div>}
      <button onClick={handleUpdate} disabled={loading}>Update</button>
      <button onClick={onClose} disabled={loading}>Cancel</button>
    </div>
  );
};

export default UpdateUserRoleModal;