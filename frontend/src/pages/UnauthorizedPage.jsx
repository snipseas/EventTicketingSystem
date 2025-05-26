import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>403 - Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/">Go back to Home</Link>
    </div>
);

export default UnauthorizedPage;