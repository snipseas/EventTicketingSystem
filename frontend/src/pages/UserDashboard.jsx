import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [bookingCount, setBookingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get('/api/v1/users/me'),
            axios.get('/api/v1/bookings/my')
        ])
            .then(([userRes, bookingsRes]) => {
                setProfile(userRes.data);
                setBookingCount(bookingsRes.data.length);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load dashboard data.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="user-dashboard">
            <h2>Welcome, {profile?.name}!</h2>
            <p>You have <strong>{bookingCount}</strong> booking{bookingCount !== 1 ? 's' : ''}.</p>
            <div style={{ marginTop: 20 }}>
                <button onClick={() => navigate('/profile')}>View Profile</button>
                <button onClick={() => navigate('/bookings')} style={{ marginLeft: 10 }}>
                    My Bookings
                </button>
                <button onClick={() => navigate('/events')} style={{ marginLeft: 10 }}>
                    Browse Events
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;