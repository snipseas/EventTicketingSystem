import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuthContext();

    // If the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If the user's role is not in the allowedRoles, redirect to the unauthorized page
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If the user is authenticated and authorized, render the child components
    return <Outlet />;
};

export default ProtectedRoute;