import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import MyEventsPage from './pages/MyEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventAnalyticsPage from './pages/EventAnalyticsPage';
import UserBookingsPage from './pages/UserBookingsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<EventListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                <Route path="/my-events" element={<MyEventsPage />} />
                <Route path="/my-events/new" element={<CreateEventPage />} />
                <Route path="/my-events/:eventId/edit" element={<EditEventPage />} />
                <Route path="/my-events/analytics" element={<EventAnalyticsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route path="/bookings" element={<UserBookingsPage />} />
            </Route>

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
    );
};

export default AppRoutes;