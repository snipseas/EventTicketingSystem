import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../shared/Loader';

const LoginForm = () => {
    const { login } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        setLoading(true);

        try {
            const result = await login(formData);
            if (!result.success) {
                toast.error(result.error);
                setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, position: 'relative' }}>
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            zIndex: 1,
                        }}
                    >
                        <Loader />
                    </Box>
                )}
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ mt: 1 }}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                            <Typography color="primary" variant="body2">
                                Forgot password?
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm;