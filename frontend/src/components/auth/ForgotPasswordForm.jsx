import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../context/AuthContext.jsx';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword(email);
            toast.success('Password reset link sent to your email!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
    );
};

export default ForgotPasswordForm;