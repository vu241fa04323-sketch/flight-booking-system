// Navigation bar component with brand logo, links, auth status, and mobile menu
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, Menu, X, Calendar, Compass, PhoneCall } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const { currentUser, handleLogout } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon-wrap">
            <Plane className="logo-icon" size={22} />
          </div>
          <span className="brand-text">
            Sky<span className="brand-highlight">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/flights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Search Flights
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            My Bookings
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact Us
          </NavLink>
        </nav>

        {/* User Auth Section (Desktop) */}
        <div className="nav-auth-desktop">
          {currentUser ? (
            <div className="user-profile-menu">
              <div className="user-badge">
                <div className="avatar-circle">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-greeting">Welcome,</span>
                  <span className="user-name">{currentUser.fullName.split(' ')[0]}</span>
                </div>
              </div>
              <button onClick={onLogout} className="btn-logout" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <nav className="mobile-nav-links">
            <NavLink to="/" className="mobile-nav-item" onClick={closeMenu} end>
              <Compass size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/flights" className="mobile-nav-item" onClick={closeMenu}>
              <Plane size={18} />
              <span>Search Flights</span>
            </NavLink>
            <NavLink to="/my-bookings" className="mobile-nav-item" onClick={closeMenu}>
              <Calendar size={18} />
              <span>My Bookings</span>
            </NavLink>
            <NavLink to="/contact" className="mobile-nav-item" onClick={closeMenu}>
              <PhoneCall size={18} />
              <span>Contact Us</span>
            </NavLink>
          </nav>

          <div className="mobile-auth-section">
            {currentUser ? (
              <div className="mobile-user-box">
                <div className="user-badge">
                  <div className="avatar-circle">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{currentUser.fullName}</div>
                    <div className="user-email">{currentUser.email}</div>
                  </div>
                </div>
                <button onClick={onLogout} className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: '12px' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-outline" onClick={closeMenu} style={{ width: '100%' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu} style={{ width: '100%' }}>
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon-wrap {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
        }
        .brand-text {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--navy-dark);
          letter-spacing: -0.5px;
        }
        .brand-highlight {
          color: var(--secondary);
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
          padding: 8px 4px;
          position: relative;
          transition: color var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .nav-link.active {
          color: var(--primary);
          font-weight: 600;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2.5px;
          background-color: var(--secondary);
          border-radius: 2px;
        }
        .nav-auth-desktop {
          display: flex;
          align-items: center;
        }
        .auth-btn-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          border: 1.5px solid var(--border-light);
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .user-greeting {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--navy-dark);
        }
        .user-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border-light);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-logout:hover {
          background-color: var(--danger-light);
          border-color: #fca5a5;
          color: var(--danger);
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--navy-dark);
          cursor: pointer;
          padding: 6px;
        }
        .mobile-drawer {
          display: none;
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-light);
          padding: 16px 20px 24px;
          box-shadow: var(--shadow-lg);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          color: var(--navy-dark);
          font-weight: 500;
          font-size: 1rem;
          text-decoration: none;
        }
        .mobile-nav-item.active {
          background-color: var(--accent-light);
          color: var(--secondary);
          font-weight: 600;
        }
        .mobile-auth-section {
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
        .mobile-auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (max-width: 860px) {
          .nav-links-desktop,
          .nav-auth-desktop {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-drawer {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
