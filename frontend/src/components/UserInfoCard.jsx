import React from 'react';

const UserInfoCard = ({ user }) => (
  <div className="p-4 border rounded shadow-sm bg-white">
    <h2 className="text-xl font-semibold mb-2">User Info</h2>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Role:</strong> {user.role}</p>
  </div>
);

export default UserInfoCard;
