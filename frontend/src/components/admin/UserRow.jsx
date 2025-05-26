import React, { useState } from 'react';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';

const UserRow = ({ user, onAction }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={() => setShowRoleModal(true)}>Update Role</button>
        <button onClick={() => setShowDelete(true)}>Delete</button>
        {showRoleModal && (
          <UpdateUserRoleModal
            user={user}
            onClose={() => setShowRoleModal(false)}
            onUpdated={onAction}
          />
        )}
        {showDelete && (
          <ConfirmationDialog
            message={`Delete user ${user.name}?`}
            onConfirm={() => { setShowDelete(false); onAction(); }}
            onCancel={() => setShowDelete(false)}
            userId={user._id}
          />
        )}
      </td>
    </tr>
  );
};

export default UserRow;