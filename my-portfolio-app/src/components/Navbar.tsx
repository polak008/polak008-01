import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming you will create a CSS file for Navbar styles

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Me</Link></li>
                <li><Link to="/skills">Skills</Link></li>
                <li><Link to="/education">Education</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;