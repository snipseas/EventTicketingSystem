import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get('/api/v1/users/me')
            .then(res => {
                setProfile(res.data);
                setForm({ name: res.data.name, email: res.data.email });
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load profile.');
                setLoading(false);
            });
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = e => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        axios.put('/api/v1/users/me', form)
            .then(res => {
                setProfile(res.data);
                setEditMode(false);
                setSuccess('Profile updated successfully.');
                setSaving(false);
            })
            .catch(() => {
                setError('Failed to update profile.');
                setSaving(false);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!profile) return <div>No profile data.</div>;

    return (
        <div className="profile-page">
            <h2>My Profile</h2>
            {success && <div style={{ color: 'green' }}>{success}</div>}
            {!editMode ? (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <div>
                        <label>Name: </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditMode(false)} disabled={saving}>
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;