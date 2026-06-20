import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
<Link to="/about-us">About Us</Link>

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F7AEF8" />
                  <stop offset="25%" stopColor="#B388EB" />
                  <stop offset="50%" stopColor="#8093F1" />
                  <stop offset="75%" stopColor="#72DDF7" />
                  <stop offset="100%" stopColor="#F7AEF8" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.9" />
              <path d="M20 8 L26 16 L20 20 L14 16 Z" fill="#F4F4ED" />
              <path d="M26 16 L32 20 L26 24 L20 20 Z" fill="#F4F4ED" opacity="0.9" />
              <path d="M14 16 L20 20 L14 24 L8 20 Z" fill="#F4F4ED" opacity="0.9" />
              <path d="M20 20 L26 24 L20 32 L14 24 Z" fill="#F4F4ED" opacity="0.8" />
              <circle cx="20" cy="20" r="3" fill="url(#logoGradient)" />
            </svg>
          </div>
          <span className="logo-text">Nexus</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/societies" 
              className={`navbar-link ${location.pathname === '/societies' ? 'active' : ''}`}
            >
              Societies
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/events" 
              className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}
            >
              Events
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/announcements" 
              className={`navbar-link ${location.pathname === '/announcements' ? 'active' : ''}`}
            >
              Announcements
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/login" 
              className={`navbar-link ${location.pathname === '/join-us' ? 'active' : ''}`}
            >
              Join us
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/about-us" 
              className={`navbar-link ${location.pathname === '/about-us' ? 'active' : ''}`}
            >
              About us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

