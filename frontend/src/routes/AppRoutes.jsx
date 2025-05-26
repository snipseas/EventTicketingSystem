import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Temporary placeholder component
const PlaceholderComponent = ({ name }) => (
    <div style={{ padding: '20px' }}>
        <h2>{name} Page</h2>
        <p>This is a placeholder for the {name} component.</p>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PlaceholderComponent name="Home" />} />
            <Route path="/login" element={<PlaceholderComponent name="Login" />} />
            <Route path="/register" element={<PlaceholderComponent name="Register" />} />
            <Route path="/forgot-password" element={<PlaceholderComponent name="Forgot Password" />} />
            
            {/* Temporary catch-all route */}
            <Route path="*" element={<PlaceholderComponent name="404 Not Found" />} />
        </Routes>
    );
};

export default AppRoutes;