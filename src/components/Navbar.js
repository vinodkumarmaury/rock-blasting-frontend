// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/input-guide">Input Guide</Link>
            <Link to="/prediction">Prediction</Link>
            <Link to="/analysis">Analysis</Link>
        </nav>
    );
}

export default Navbar;
