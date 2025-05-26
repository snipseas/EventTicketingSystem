import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../shared/Loader';

const ForgotPasswordForm = () => {
    const { forgotPassword } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSubmitted(true);
                toast.success('Password reset instructions have been sent to your email');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Forgot Password
                </Typography>
                {!submitted ? (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enter your email address and we'll send you instructions to reset your password.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Check your email for further instructions.
                        </Typography>
                    </Box>
                )}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Typography color="primary" variant="body2">
                            Back to Login
                        </Typography>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotPasswordForm;