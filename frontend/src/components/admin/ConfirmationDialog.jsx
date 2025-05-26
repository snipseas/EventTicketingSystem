import React, { useState } from 'react';
import api from '../../services/api';

const ConfirmationDialog = ({ message, onConfirm, onCancel, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/users/${userId}`);
      onConfirm();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <p>{message}</p>
      {error && <div style={{color:'red'}}>{error}</div>}
      <button onClick={handleDelete} disabled={loading}>Yes, Delete</button>
      <button onClick={onCancel} disabled={loading}>Cancel</button>
    </div>
  );
};

export default ConfirmationDialog;