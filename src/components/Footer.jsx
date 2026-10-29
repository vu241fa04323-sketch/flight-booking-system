// Footer component for SkyBook
import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, ShieldCheck, HeartHandshake, Clock, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-root">
      {/* Features Value Bar */}
      <div className="footer-features-bar">
        <div className="container features-grid">
          <div className="feature-item">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <div>
              <div className="feature-title">100% Verified Fares</div>
              <div className="feature-desc">Transparent pricing with no hidden surcharges</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Clock size={24} /></div>
            <div>
              <div className="feature-title">Instant E-Ticket</div>
              <div className="feature-desc">Download PDF boarding pass in seconds</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><HeartHandshake size={24} /></div>
            <div>
              <div className="feature-title">24/7 Travel Assistance</div>
              <div className="feature-desc">Round-the-clock customer care for bookings</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Award size={24} /></div>
            <div>
              <div className="feature-title">Best Price Guarantee</div>
              <div className="feature-desc">Top domestic & international airline deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-content-wrap">
        <div className="footer-columns">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="logo-icon-wrap-sm">
                <Plane size={18} />
              </div>
              <span className="brand-name">
                Sky<span className="brand-accent">Book</span>
              </span>
            </div>
            <p className="footer-about-text">
              SkyBook is a modern, intuitive flight booking platform designed to make air travel seamless, transparent, and enjoyable. Explore destinations, compare real-time fares, and manage your journeys with complete confidence.
            </p>
            <div className="contact-quick">
              <div className="contact-row"><Phone size={15} /> <span>1800-SKY-BOOK (+91 1800 759 2665)</span></div>
              <div className="contact-row"><Mail size={15} /> <span>support@skybook.com</span></div>
              <div className="contact-row"><MapPin size={15} /> <span>Aviation Hub, Aerocity, New Delhi, India</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/flights">Search Flights</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/contact">Contact Customer Care</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">Create New Account</Link></li>
            </ul>
          </div>

          {/* Popular Flight Routes */}
          <div className="footer-col">
            <h4 className="footer-heading">Top Flight Routes</h4>
            <ul className="footer-links-list">
              <li><Link to="/flights?from=Delhi&to=Mumbai">Delhi to Mumbai Flights</Link></li>
              <li><Link to="/flights?from=Bengaluru&to=Mumbai">Bengaluru to Mumbai Flights</Link></li>
              <li><Link to="/flights?from=Delhi&to=Bengaluru">Delhi to Bengaluru Flights</Link></li>
              <li><Link to="/flights?from=Mumbai&to=Goa">Mumbai to Goa Flights</Link></li>
              <li><Link to="/flights?from=Delhi&to=Dubai">Delhi to Dubai Flights</Link></li>
              <li><Link to="/flights?from=Delhi&to=London">Delhi to London Heathrow</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="footer-col">
            <h4 className="footer-heading">Help & Legal</h4>
            <ul className="footer-links-list">
              <li><Link to="/contact">Help & FAQ Center</Link></li>
              <li><Link to="/contact">Baggage Guidelines</Link></li>
              <li><Link to="/contact">Cancellation & Refund Policy</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
              <li><Link to="/contact">Terms & Conditions</Link></li>
              <li><Link to="/contact">Security Advisory</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="footer-bottom">
          <div className="demo-disclaimer-box">
            <strong>Demonstration Prototype Notice:</strong> SkyBook is a frontend web application developed for educational, portfolio, and demo purposes. It uses mock flight schedules and browser localStorage. No real airline seats are reserved and no real financial payments are processed.
          </div>
          <div className="bottom-meta">
            <p className="copyright-text">
              © {new Date().getFullYear()} SkyBook Airlines Booking Portal. All rights reserved.
            </p>
            <div className="bottom-links">
              <span>Privacy</span>
              <span>•</span>
              <span>Terms</span>
              <span>•</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #0b192c;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 48px;
        }
        .footer-features-bar {
          background-color: #112239;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 28px 0;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(2, 132, 199, 0.15);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-title {
          font-weight: 700;
          color: #f1f5f9;
          font-size: 0.95rem;
        }
        .feature-desc {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .footer-content-wrap {
          padding: 48px 20px 24px;
        }
        .footer-columns {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1.2fr 1fr;
          gap: 40px;
          margin-bottom: 36px;
        }
        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon-wrap-sm {
          width: 32px;
          height: 32px;
          background: var(--secondary);
          border-radius: var(--radius-sm);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
        }
        .brand-accent {
          color: var(--accent);
        }
        .footer-about-text {
          line-height: 1.6;
          font-size: 0.875rem;
          color: #94a3b8;
        }
        .contact-quick {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.825rem;
          margin-top: 6px;
        }
        .contact-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
        }
        .footer-heading {
          font-size: 1rem;
          color: #f8fafc;
          font-weight: 700;
          margin-bottom: 18px;
          position: relative;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 24px;
          height: 2px;
          background-color: var(--secondary);
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-list a {
          color: #94a3b8;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-links-list a:hover {
          color: #ffffff;
          padding-left: 4px;
        }
        .footer-bottom {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .demo-disclaimer-box {
          background-color: rgba(2, 132, 199, 0.08);
          border: 1px dashed rgba(56, 189, 248, 0.25);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
        }
        .demo-disclaimer-box strong {
          color: var(--accent);
        }
        .bottom-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.825rem;
          color: #64748b;
        }
        .bottom-links {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 960px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }
        @media (max-width: 600px) {
          .footer-columns {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .bottom-meta {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
