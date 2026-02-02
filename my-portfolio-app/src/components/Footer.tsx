import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#f9e79f', padding: '1rem', textAlign: 'center' }}>
            <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
            <p>
                <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
            </p>
        </footer>
    );
};

export default Footer;