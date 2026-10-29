// Sticky booking summary sidebar card showing flight details and transparent fare breakdown
import React from 'react';
import { Plane, Calendar, Clock, Luggage, ShieldCheck, Tag } from 'lucide-react';
import { formatCurrency, formatDateReadable, calculateFare } from '../utils/bookingUtils';
import { useBooking } from '../context/BookingContext';

export default function BookingSummary({ flight }) {
  const { searchParams } = useBooking();

  if (!flight) return null;

  const paxCount = parseInt(searchParams.passengers, 10) || 1;
  const fare = calculateFare({
    basePrice: flight.basePrice,
    passengers: paxCount,
    travelClass: searchParams.travelClass
  });

  return (
    <div className="booking-summary-card">
      <div className="summary-header">
        <h3 className="summary-title">Booking Summary</h3>
        <span className="summary-pax-tag">{paxCount} {paxCount === 1 ? 'Passenger' : 'Passengers'}</span>
      </div>

      {/* Flight Overview */}
      <div className="flight-brief-box">
        <div className="brief-airline-row">
          <div className="airline-icon-tag">
            <Plane size={16} />
            <span>{flight.airline}</span>
          </div>
          <span className="brief-flight-num">{flight.flightNumber}</span>
        </div>

        <div className="brief-route-row">
          <div className="brief-city">
            <span className="brief-code">{flight.fromCode}</span>
            <span className="brief-time">{flight.departureTime}</span>
            <span className="brief-name">{flight.fromCity}</span>
          </div>

          <div className="brief-arrow-box">
            <span className="brief-dur">{flight.duration}</span>
            <div className="arrow-line"></div>
            <span className="brief-stops">{flight.stops === 0 ? 'Non-stop' : '1 Stop'}</span>
          </div>

          <div className="brief-city text-right">
            <span className="brief-code">{flight.toCode}</span>
            <span className="brief-time">{flight.arrivalTime}</span>
            <span className="brief-name">{flight.toCity}</span>
          </div>
        </div>

        <div className="brief-meta-list">
          <div className="meta-row">
            <Calendar size={13} />
            <span>Travel Date: <strong>{formatDateReadable(searchParams.departureDate)}</strong></span>
          </div>
          <div className="meta-row">
            <Luggage size={13} />
            <span>Class: <strong>{fare.travelClassName}</strong> ({fare.baggageAllowance.split(',')[0]})</span>
          </div>
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="fare-breakdown-box">
        <h4 className="fare-breakdown-title">Fare Details</h4>

        <div className="fare-line">
          <span>Base Fare ({paxCount} × {formatCurrency(fare.perPaxBaseFare)})</span>
          <span>{formatCurrency(fare.totalBaseFare)}</span>
        </div>

        <div className="fare-line">
          <span>Taxes & Airline GST (12%)</span>
          <span>{formatCurrency(fare.taxesAndSurcharges)}</span>
        </div>

        <div className="fare-line">
          <span>Airport Security & User Fees</span>
          <span>{formatCurrency(fare.airportFees)}</span>
        </div>

        <div className="fare-line">
          <span>Convenience Fee</span>
          <span>{formatCurrency(fare.convenienceFee)}</span>
        </div>

        <div className="fare-divider"></div>

        <div className="fare-total-line">
          <div className="total-label-box">
            <span className="total-title">Total Payable</span>
            <span className="all-taxes-incl">All taxes included</span>
          </div>
          <span className="total-amount-val">{formatCurrency(fare.finalPayable)}</span>
        </div>
      </div>

      {/* Trust reassurance */}
      <div className="summary-trust-badge">
        <ShieldCheck size={16} className="text-success" />
        <span>100% Safe & Instant Booking Simulation</span>
      </div>

      <style>{`
        .booking-summary-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 90px;
        }
        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 16px;
        }
        .summary-title {
          font-size: 1.15rem;
          color: var(--navy-dark);
          font-weight: 700;
        }
        .summary-pax-tag {
          font-size: 0.785rem;
          font-weight: 600;
          color: var(--secondary);
          background-color: var(--primary-light);
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .flight-brief-box {
          background-color: #f8fafc;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 20px;
        }
        .brief-airline-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .airline-icon-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .brief-flight-num {
          font-size: 0.785rem;
          color: var(--text-muted);
          background-color: #ffffff;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }
        .brief-route-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .brief-city {
          display: flex;
          flex-direction: column;
        }
        .brief-city.text-right {
          text-align: right;
        }
        .brief-code {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }
        .brief-time {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .brief-name {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .brief-arrow-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 0 10px;
        }
        .brief-dur {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .arrow-line {
          width: 100%;
          height: 1.5px;
          background: #cbd5e1;
          margin: 3px 0;
        }
        .brief-stops {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 600;
        }
        .brief-meta-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 10px;
          border-top: 1px dashed var(--border-light);
          font-size: 0.8rem;
          color: var(--navy-dark);
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
        }
        .meta-row strong {
          color: var(--navy-dark);
        }
        .fare-breakdown-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .fare-breakdown-title {
          font-size: 0.95rem;
          color: var(--navy-dark);
          font-weight: 700;
          margin-bottom: 4px;
        }
        .fare-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .fare-divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 6px 0;
        }
        .fare-total-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
        }
        .total-label-box {
          display: flex;
          flex-direction: column;
        }
        .total-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--navy-dark);
        }
        .all-taxes-incl {
          font-size: 0.725rem;
          color: var(--text-light);
        }
        .total-amount-val {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }
        .summary-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding: 10px 14px;
          background-color: var(--success-light);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
          color: #065f46;
        }
      `}</style>
    </div>
  );
}
