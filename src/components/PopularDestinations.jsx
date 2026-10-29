// Popular flight destinations grid with high-res imagery, starting prices, and instant booking hooks
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Star, ArrowRight, MapPin } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/flightData';
import { formatCurrency, getFutureDate } from '../utils/bookingUtils';
import { useBooking } from '../context/BookingContext';

export default function PopularDestinations() {
  const { updateSearchParams } = useBooking();
  const navigate = useNavigate();

  const handleDestinationClick = (dest) => {
    // If the origin is the same as destination, pick another popular origin
    const defaultOrigin = dest.city === 'Delhi' ? 'Mumbai' : 'Delhi';
    
    updateSearchParams({
      from: defaultOrigin,
      to: dest.city,
      departureDate: getFutureDate(3),
      returnDate: getFutureDate(7),
      tripType: 'oneWay',
      passengers: 1,
      travelClass: 'economy'
    });

    navigate('/flights');
  };

  return (
    <section className="popular-dest-section">
      <div className="section-header-wrap">
        <div className="section-badge">
          <Plane size={14} />
          <span>Top Global & Domestic Routes</span>
        </div>
        <h2 className="section-main-heading">Popular Destinations</h2>
        <p className="section-subheading">
          Explore iconic cities, coastal escapes, and global capitals with exclusive low fares.
        </p>
      </div>

      <div className="destinations-grid">
        {POPULAR_DESTINATIONS.map((dest) => (
          <div
            key={dest.code}
            className="dest-card"
            onClick={() => handleDestinationClick(dest)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDestinationClick(dest)}
          >
            <div className="dest-image-wrap">
              <img
                src={dest.image}
                alt={`${dest.city}, ${dest.country}`}
                className="dest-image"
                loading="lazy"
              />
              <span className="dest-tag">{dest.tag}</span>
              <div className="dest-rating">
                <Star size={12} fill="#eab308" color="#eab308" />
                <span>{dest.rating}</span>
              </div>
            </div>

            <div className="dest-body">
              <div className="dest-title-row">
                <div>
                  <h3 className="dest-city">{dest.city}</h3>
                  <span className="dest-country">{dest.country}</span>
                </div>
                <span className="airport-pill">{dest.code}</span>
              </div>

              <p className="dest-description">{dest.description}</p>

              <div className="dest-footer">
                <div className="dest-price-box">
                  <span className="price-label">Fares starting from</span>
                  <span className="price-number">{formatCurrency(dest.price)}</span>
                </div>

                <div className="btn-explore-circle">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .popular-dest-section {
          padding: 40px 0;
        }
        .section-header-wrap {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 36px;
        }
        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .section-main-heading {
          font-size: 2.1rem;
          color: var(--navy-dark);
          margin-bottom: 8px;
        }
        .section-subheading {
          font-size: 1rem;
          color: var(--text-muted);
        }
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .dest-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        .dest-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 76, 129, 0.12);
          border-color: #cbd5e1;
        }
        .dest-card:hover .dest-image {
          transform: scale(1.06);
        }
        .dest-card:hover .btn-explore-circle {
          background-color: var(--primary);
          color: #ffffff;
          transform: translateX(4px);
        }
        .dest-image-wrap {
          height: 190px;
          position: relative;
          overflow: hidden;
          background-color: #e2e8f0;
        }
        .dest-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .dest-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.725rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .dest-rating {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          color: var(--navy-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: var(--shadow-sm);
        }
        .dest-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .dest-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .dest-city {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy-dark);
          line-height: 1.2;
        }
        .dest-country {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .airport-pill {
          background-color: var(--bg-muted);
          color: var(--secondary);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }
        .dest-description {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }
        .dest-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }
        .dest-price-box {
          display: flex;
          flex-direction: column;
        }
        .price-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .price-number {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }
        .btn-explore-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
      `}</style>
    </section>
  );
}
