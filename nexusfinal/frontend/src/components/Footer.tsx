import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F7AEF8" />
                      <stop offset="25%" stopColor="#B388EB" />
                      <stop offset="50%" stopColor="#8093F1" />
                      <stop offset="75%" stopColor="#72DDF7" />
                      <stop offset="100%" stopColor="#F7AEF8" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#footerLogoGradient)" opacity="0.9" />
                  <path d="M20 8 L26 16 L20 20 L14 16 Z" fill="#F4F4ED" />
                  <path d="M26 16 L32 20 L26 24 L20 20 Z" fill="#F4F4ED" opacity="0.9" />
                  <path d="M14 16 L20 20 L14 24 L8 20 Z" fill="#F4F4ED" opacity="0.9" />
                  <path d="M20 20 L26 24 L20 32 L14 24 Z" fill="#F4F4ED" opacity="0.8" />
                  <circle cx="20" cy="20" r="3" fill="url(#footerLogoGradient)" />
                </svg>
              </div>
              <span className="footer-logo-text">Nexus</span>
            </div>
            <p className="footer-description">
              Your gateway to campus life at FAST University Lahore. Connect, discover, and grow with Nexus.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/societies">Societies</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/announcements">Announcements</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><Link to="/login">Join Us</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact</h3>
            <p className="footer-contact">
              FAST University <br />
              Lahore Campus<br />
              Pakistan
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Nexus. All rights reserved.</p>
          <p className="footer-credits">
            Made by: Uma E Rubab · Ayesha Khalid · Dania Athar · Easha Javed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

