import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/user';
import UserInfoCard from '../components/UserInfoCard';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      setUser(data);
      setForm({ name: data.name, email: data.email });
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const updated = await updateUserProfile(form);
      setUser(updated);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {editing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full"
          />
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>Save</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <UserInfoCard user={user} />
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
