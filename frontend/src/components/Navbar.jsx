import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuthContext();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1>Event Ticketing System</h1>
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                {!user ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <li><button onClick={logout}>Logout</button></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;