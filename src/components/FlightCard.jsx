// Flight card component displaying airline branding, schedule, stops, duration, pricing, and details
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Clock,
  Luggage,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Check,
  Utensils,
  Wifi,
  Tv,
  Star
} from 'lucide-react';
import { AIRLINES, TRAVEL_CLASSES } from '../data/flightData';
import { formatCurrency, calculateFare } from '../utils/bookingUtils';
import { useBooking } from '../context/BookingContext';

export default function FlightCard({ flight }) {
  const { searchParams, chooseFlight } = useBooking();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Match airline branding
  const airlineMeta =
    AIRLINES.find((a) => a.name.toLowerCase() === flight.airline.toLowerCase()) || {
      color: '#0284c7',
      bg: '#e0f2fe',
      code: flight.airlineCode || 'SB'
    };

  // Pricing calculation
  const paxCount = parseInt(searchParams.passengers, 10) || 1;
  const fare = calculateFare({
    basePrice: flight.basePrice,
    passengers: paxCount,
    travelClass: searchParams.travelClass
  });

  const handleSelect = () => {
    chooseFlight(flight);
    navigate('/booking');
  };

  return (
    <div className="flight-card animate-fade-in">
      {/* Top Banner (Optional for best rating or fastest) */}
      {flight.rating >= 4.8 && (
        <div className="card-top-tag">
          <Star size={12} fill="#ffffff" />
          <span>Top Rated Flight ({flight.rating}★)</span>
        </div>
      )}

      <div className="card-main-body">
        {/* 1. Airline Column */}
        <div className="airline-col">
          <div
            className="airline-logo-box"
            style={{ backgroundColor: airlineMeta.bg, color: airlineMeta.color }}
          >
            <Plane size={20} />
            <span className="airline-badge-code">{airlineMeta.code}</span>
          </div>
          <div className="airline-text">
            <h4 className="airline-name">{flight.airline}</h4>
            <span className="flight-number-tag">
              {flight.flightNumber} • {flight.aircraft || 'A320neo'}
            </span>
          </div>
        </div>

        {/* 2. Schedule & Route Center Column */}
        <div className="schedule-col">
          {/* Departure */}
          <div className="time-point departure">
            <span className="time-val">{flight.departureTime}</span>
            <span className="airport-code-val">{flight.fromCode}</span>
            <span className="city-name-val">{flight.fromCity}</span>
          </div>

          {/* Route path line with duration */}
          <div className="route-path-wrap">
            <span className="duration-label">{flight.duration}</span>
            <div className="flight-path-line">
              <span className="path-dot start"></span>
              <div className="path-line"></div>
              <Plane size={14} className="path-plane-icon" />
              <span className="path-dot end"></span>
            </div>
            <span className={`stops-label ${flight.stops === 0 ? 'non-stop' : 'has-stops'}`}>
              {flight.stopDetails || (flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`)}
            </span>
          </div>

          {/* Arrival */}
          <div className="time-point arrival">
            <span className="time-val">{flight.arrivalTime}</span>
            <span className="airport-code-val">{flight.toCode}</span>
            <span className="city-name-val">{flight.toCity}</span>
          </div>
        </div>

        {/* 3. Amenities / Baggage Quick Indicators */}
        <div className="amenities-col">
          <div className="baggage-badge">
            <Luggage size={14} />
            <span>{fare.baggageAllowance.split(',')[0]}</span>
          </div>
          {flight.mealIncluded ? (
            <div className="meal-badge included">
              <Utensils size={13} />
              <span>Free Meal</span>
            </div>
          ) : (
            <div className="meal-badge">
              <Utensils size={13} />
              <span>Paid Meals</span>
            </div>
          )}
          <span className="seats-left-text">
            {flight.availableSeats <= 8
              ? `Only ${flight.availableSeats} seats left!`
              : `${flight.availableSeats} seats left`}
          </span>
        </div>

        {/* 4. Price & Action Column */}
        <div className="price-action-col">
          <div className="price-box">
            <div className="price-per-pax">
              <span className="currency-val">{formatCurrency(fare.perPaxBaseFare)}</span>
              <span className="per-pax-label">/ passenger</span>
            </div>
            {paxCount > 1 && (
              <div className="total-pax-price">
                Total: <strong>{formatCurrency(fare.finalPayable)}</strong> for {paxCount} pax
              </div>
            )}
          </div>

          <button onClick={handleSelect} className="btn btn-primary btn-select-flight">
            <span>Select Flight</span>
          </button>
        </div>
      </div>

      {/* Card Footer Toggles */}
      <div className="card-footer-strip">
        <div className="cancellation-badge">
          {flight.refundable ? (
            <span className="text-success flex-center">
              <Check size={14} /> Partially Refundable
            </span>
          ) : (
            <span className="text-muted">Standard Cancellation Fees Apply</span>
          )}
        </div>

        <button
          type="button"
          className="btn-view-details"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? 'Hide Details' : 'View Flight Details'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Flight Details Panel */}
      {expanded && (
        <div className="expanded-details-pane animate-fade-in">
          <div className="details-grid">
            <div className="detail-section">
              <h5>Flight & Terminal Information</h5>
              <p>
                <strong>Departure:</strong> {flight.fromAirport} ({flight.fromCode}) at{' '}
                {flight.departureTime}
              </p>
              <p>
                <strong>Arrival:</strong> {flight.toAirport} ({flight.toCode}) at{' '}
                {flight.arrivalTime}
              </p>
              <p>
                <strong>Operating Carrier:</strong> {flight.airline} ({flight.flightNumber})
              </p>
              <p>
                <strong>Aircraft Type:</strong> {flight.aircraft}
              </p>
            </div>

            <div className="detail-section">
              <h5>Baggage Allowance ({fare.travelClassName})</h5>
              <p>
                <strong>Check-in Baggage:</strong> {fare.baggageAllowance.split(',')[0]}
              </p>
              <p>
                <strong>Cabin Hand Luggage:</strong> 7 kg per passenger (1 piece + laptop bag)
              </p>
              <p className="subtle-note">Excess baggage can be purchased at airport or online check-in.</p>
            </div>

            <div className="detail-section">
              <h5>In-flight Amenities</h5>
              <div className="amenities-tags-list">
                {flight.amenities?.map((amenity, idx) => (
                  <span key={idx} className="amenity-chip">
                    <Check size={12} className="text-success" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
              <p className="fare-rule-note">
                Fare includes all mandatory government aviation fees and passenger security taxes.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .flight-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          margin-bottom: 16px;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }
        .flight-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(15, 76, 129, 0.08);
          transform: translateY(-2px);
        }
        .card-top-tag {
          background: linear-gradient(90deg, #0284c7 0%, #0f4c81 100%);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-bottom-right-radius: var(--radius-md);
        }
        .card-main-body {
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 1.8fr 3fr 1.6fr 2fr;
          gap: 20px;
          align-items: center;
        }
        .airline-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .airline-logo-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .airline-badge-code {
          font-size: 0.65rem;
          line-height: 1;
          margin-top: 2px;
        }
        .airline-text {
          display: flex;
          flex-direction: column;
        }
        .airline-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .flight-number-tag {
          font-size: 0.785rem;
          color: var(--text-muted);
        }
        .schedule-col {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .time-point {
          display: flex;
          flex-direction: column;
        }
        .time-point.departure {
          text-align: left;
        }
        .time-point.arrival {
          text-align: right;
        }
        .time-val {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--navy-dark);
          line-height: 1.1;
        }
        .airport-code-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--secondary);
        }
        .city-name-val {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .route-path-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0 8px;
        }
        .duration-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .flight-path-line {
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }
        .path-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--secondary);
          flex-shrink: 0;
        }
        .path-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #93c5fd 0%, #0284c7 50%, #93c5fd 100%);
        }
        .path-plane-icon {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          color: var(--secondary);
          background-color: #ffffff;
          padding: 1px;
        }
        .stops-label {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .stops-label.non-stop {
          color: var(--success);
          background-color: var(--success-light);
        }
        .stops-label.has-stops {
          color: #d97706;
          background-color: #fef3c7;
        }
        .amenities-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .baggage-badge, .meal-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .meal-badge.included {
          color: var(--success);
          font-weight: 500;
        }
        .seats-left-text {
          font-size: 0.725rem;
          color: #e11d48;
          font-weight: 600;
        }
        .price-action-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .price-box {
          text-align: right;
        }
        .currency-val {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--primary);
        }
        .per-pax-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 4px;
        }
        .total-pax-price {
          font-size: 0.785rem;
          color: var(--text-muted);
        }
        .btn-select-flight {
          width: 100%;
          max-width: 150px;
          padding: 10px 16px;
          border-radius: var(--radius-md);
        }
        .card-footer-strip {
          background-color: #f8fafc;
          border-top: 1px solid var(--border-light);
          padding: 8px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .cancellation-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .flex-center {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .text-success {
          color: var(--success);
        }
        .btn-view-details {
          background: transparent;
          border: none;
          color: var(--secondary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .btn-view-details:hover {
          text-decoration: underline;
        }
        .expanded-details-pane {
          background-color: #ffffff;
          border-top: 1px dashed var(--border-light);
          padding: 20px 24px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 20px;
        }
        .detail-section h5 {
          font-size: 0.875rem;
          color: var(--navy-dark);
          margin-bottom: 8px;
        }
        .detail-section p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .subtle-note, .fare-rule-note {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-top: 6px;
          font-style: italic;
        }
        .amenities-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }
        .amenity-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: var(--bg-muted);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-main);
        }
        @media (max-width: 900px) {
          .card-main-body {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .airline-col {
            grid-column: span 1;
          }
          .price-action-col {
            grid-column: span 1;
            align-items: flex-start;
          }
          .schedule-col {
            grid-column: span 2;
          }
          .amenities-col {
            grid-column: span 2;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 14px;
          }
          .details-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
