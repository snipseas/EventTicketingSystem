import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import theme from './theme';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Event Pages
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import MyEventsPage from './pages/MyEventsPage';

// User Pages
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminEventsPage from './pages/admin/EventsPage';

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<EventListPage />} />
                            <Route path="/events" element={<EventListPage />} />
                            <Route path="/events/:id" element={<EventDetailsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                            {/* Protected User Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']} />}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/my-bookings" element={<MyBookingsPage />} />
                            </Route>

                            {/* Protected Organizer Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
                                <Route path="/my-events" element={<MyEventsPage />} />
                                <Route path="/my-events/new" element={<CreateEventPage />} />
                                <Route path="/my-events/:id/edit" element={<EditEventPage />} />
                            </Route>

                            {/* Protected Admin Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                <Route path="/admin" element={<AdminDashboardPage />} />
                                <Route path="/admin/users" element={<AdminUsersPage />} />
                                <Route path="/admin/events" element={<AdminEventsPage />} />
                            </Route>

                            {/* Fallback Route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </AuthProvider>
                <ToastContainer position="top-right" autoClose={3000} />
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;