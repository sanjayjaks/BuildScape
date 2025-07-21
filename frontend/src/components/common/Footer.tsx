import React from 'react';
import './Footer.css'; // Create this CSS file

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Construction & Interior Design Services. All rights reserved.</p>
        <p>Designed by Sanjay Jakkani</p>
        {/* Add more links or info here if needed */}
      </div>
    </footer>
  );
};

export default Footer;