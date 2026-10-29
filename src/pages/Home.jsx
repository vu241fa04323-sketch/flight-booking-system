// Homepage containing hero section, prominent flight search form, popular destinations, and 'Why Choose' features
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  ShieldCheck,
  Zap,
  Sparkles,
  CreditCard,
  Headphones,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Globe,
  Users
} from 'lucide-react';
import FlightSearchForm from '../components/FlightSearchForm';
import PopularDestinations from '../components/PopularDestinations';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-root">
      {/* 1. Aviation Themed Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container">
          <div className="hero-text-content">
            <div className="hero-pill-badge animate-fade-in">
              <Sparkles size={15} />
              <span>Fly Smarter, Explore Further</span>
            </div>
            <h1 className="hero-title animate-fade-in">Your Journey Begins Here</h1>
            <p className="hero-subtitle animate-fade-in">
              Discover destinations, compare competitive airfares across top airlines, and book your
              next flight with effortless ease.
            </p>
          </div>

          {/* Prominent Flight Search Form */}
          <div className="hero-search-wrap animate-fade-in">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="metrics-strip">
        <div className="container metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box"><Globe size={22} /></div>
            <div>
              <div className="metric-num">500+</div>
              <div className="metric-label">Global Routes Connected</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon-box"><Users size={22} /></div>
            <div>
              <div className="metric-num">2.4M+</div>
              <div className="metric-label">Happy Travelers Served</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon-box"><Award size={22} /></div>
            <div>
              <div className="metric-num">4.9 ★</div>
              <div className="metric-label">Top Customer Satisfaction</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon-box"><Zap size={22} /></div>
            <div>
              <div className="metric-num">10 Sec</div>
              <div className="metric-label">Instant PDF E-Ticket Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Destinations Section */}
      <div className="container">
        <PopularDestinations />
      </div>

      {/* 4. Special Promotional Banner */}
      <section className="container promo-banner-section">
        <div className="promo-banner-card">
          <div className="promo-content">
            <span className="promo-badge">Limited Time Travel Fest</span>
            <h3 className="promo-title">Save up to 25% on Domestic & International Getaways</h3>
            <p className="promo-desc">
              Book your early winter flights across Goa, Dubai, London, and Singapore with zero
              convenience charge for demo travelers.
            </p>
            <button onClick={() => navigate('/flights')} className="btn btn-primary promo-btn">
              <span>Explore Discounted Flights</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="promo-graphic">
            <div className="plane-illustration-card">
              <Plane size={72} className="plane-illu-icon" />
              <div className="deal-tag">Promo Code: <strong>SKYFLY</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose SkyBook Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header-center">
            <span className="badge badge-primary">The SkyBook Advantage</span>
            <h2 className="why-title">Why Choose SkyBook</h2>
            <p className="why-subtitle">
              We redefine flight booking by combining speed, clarity, and dependable reliability.
            </p>
          </div>

          <div className="features-quad-grid">
            {/* Feature 1 */}
            <div className="feature-quad-card">
              <div className="quad-icon-wrap bg-blue">
                <Zap size={26} />
              </div>
              <h4 className="quad-title">Easy & Rapid Booking</h4>
              <p className="quad-desc">
                Streamlined 3-step booking flow designed to get your tickets confirmed in under two
                minutes without unnecessary clutter.
              </p>
              <ul className="quad-checklist">
                <li><CheckCircle2 size={15} /> Instant flight comparison</li>
                <li><CheckCircle2 size={15} /> Clean passenger data entry</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="feature-quad-card">
              <div className="quad-icon-wrap bg-orange">
                <Plane size={26} />
              </div>
              <h4 className="quad-title">Multiple Flight Options</h4>
              <p className="quad-desc">
                Compare direct and connecting flights across leading carriers like IndiGo, Air
                India, Akasa Air, Emirates, and British Airways.
              </p>
              <ul className="quad-checklist">
                <li><CheckCircle2 size={15} /> Domestic & international network</li>
                <li><CheckCircle2 size={15} /> All cabin classes available</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="feature-quad-card">
              <div className="quad-icon-wrap bg-green">
                <TrendingDown size={26} />
              </div>
              <h4 className="quad-title">Transparent Pricing</h4>
              <p className="quad-desc">
                What you see is what you pay. Clear itemized breakdown of base airfares, government
                aviation taxes, and airport development fees.
              </p>
              <ul className="quad-checklist">
                <li><CheckCircle2 size={15} /> Zero hidden charges</li>
                <li><CheckCircle2 size={15} /> Detailed fare rules</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="feature-quad-card">
              <div className="quad-icon-wrap bg-purple">
                <ShieldCheck size={26} />
              </div>
              <h4 className="quad-title">Simple Booking Management</h4>
              <p className="quad-desc">
                Access your bookings anytime with your unique PNR reference. Download printable PDF
                e-tickets and simulate cancellations on demand.
              </p>
              <ul className="quad-checklist">
                <li><CheckCircle2 size={15} /> Download PDF boarding pass</li>
                <li><CheckCircle2 size={15} /> LocalStorage persistence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #092c4c 0%, #0f4c81 50%, #0284c7 100%);
          padding: 70px 0 90px;
          color: #ffffff;
          overflow: hidden;
        }
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
                            radial-gradient(circle at 80% 70%, rgba(2, 132, 199, 0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-container {
          position: relative;
          z-index: 10;
        }
        .hero-text-content {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 36px;
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          color: #e0f2fe;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -1px;
          margin-bottom: 16px;
          line-height: 1.15;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: #e0f2fe;
          line-height: 1.6;
          font-weight: 400;
        }
        .hero-search-wrap {
          margin-top: 10px;
        }
        .metrics-strip {
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-light);
          padding: 24px 0;
          box-shadow: var(--shadow-sm);
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }
        .metric-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .metric-icon-box {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .metric-num {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy-dark);
          line-height: 1.1;
        }
        .metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .promo-banner-section {
          margin: 30px auto;
        }
        .promo-banner-card {
          background: linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%);
          border-radius: var(--radius-xl);
          padding: 40px 48px;
          color: #ffffff;
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 32px;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(10, 37, 64, 0.16);
        }
        .promo-badge {
          background-color: #f59e0b;
          color: #78350f;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 12px;
        }
        .promo-title {
          font-size: 1.8rem;
          color: #ffffff;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 12px;
        }
        .promo-desc {
          font-size: 0.95rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .promo-btn {
          padding: 12px 24px;
        }
        .promo-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .plane-illustration-card {
          width: 180px;
          height: 180px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transform: rotate(-3deg);
          box-shadow: var(--shadow-lg);
        }
        .plane-illu-icon {
          color: var(--accent);
          transform: rotate(45deg);
        }
        .deal-tag {
          font-size: 0.75rem;
          color: #ffffff;
          background-color: rgba(2, 132, 199, 0.6);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }
        .why-choose-section {
          background-color: #ffffff;
          padding: 60px 0;
          border-top: 1px solid var(--border-light);
          margin-top: 30px;
        }
        .section-header-center {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 44px;
        }
        .why-title {
          font-size: 2.2rem;
          color: var(--navy-dark);
          margin-top: 10px;
          margin-bottom: 8px;
        }
        .why-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
        }
        .features-quad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }
        .feature-quad-card {
          background-color: #f8fafc;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          transition: all var(--transition-normal);
        }
        .feature-quad-card:hover {
          background-color: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 10px 25px rgba(15, 76, 129, 0.08);
          transform: translateY(-3px);
        }
        .quad-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .bg-blue {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .bg-orange {
          background-color: #ffedd5;
          color: #c2410c;
        }
        .bg-green {
          background-color: var(--success-light);
          color: var(--success);
        }
        .bg-purple {
          background-color: #f3e8ff;
          color: #7e22ce;
        }
        .quad-title {
          font-size: 1.15rem;
          color: var(--navy-dark);
          margin-bottom: 10px;
        }
        .quad-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .quad-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.825rem;
          color: var(--navy-dark);
          font-weight: 500;
        }
        .quad-checklist li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--navy-dark);
        }
        .quad-checklist li svg {
          color: var(--success);
          flex-shrink: 0;
        }
        @media (max-width: 900px) {
          .hero-title {
            font-size: 2.3rem;
          }
          .promo-banner-card {
            grid-template-columns: 1fr;
            padding: 30px 24px;
          }
          .promo-graphic {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
