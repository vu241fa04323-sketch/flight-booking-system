// Booking confirmation page with celebratory confetti, PNR, flight details, and PDF download
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Calendar,
  Plane,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  Home as HomeIcon,
  Luggage,
  Sparkles
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { generateTicketPDF } from '../utils/pdfUtils';
import { formatCurrency, formatDateReadable } from '../utils/bookingUtils';
import { getBookings } from '../utils/storage';

export default function BookingConfirmation() {
  const { lastConfirmedBooking } = useBooking();
  const [booking, setBooking] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    // Retrieve booking: either from context or most recent from localStorage
    if (lastConfirmedBooking) {
      setBooking(lastConfirmedBooking);
    } else {
      const allBookings = getBookings();
      if (allBookings && allBookings.length > 0) {
        setBooking(allBookings[0]);
      }
    }
  }, [lastConfirmedBooking]);

  const handleDownloadPDF = () => {
    if (!booking) return;
    const ok = generateTicketPDF(booking);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  if (!booking) {
    return (
      <div className="container confirmation-fallback">
        <p>No confirmed booking details found.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    );
  }

  const { flight, passengers, fare, contactInfo } = booking;

  return (
    <div className="confirmation-page-root animate-fade-in">
      <div className="container conf-container">
        {/* Success Header Banner */}
        <div className="success-banner-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={54} className="success-icon" />
          </div>
          <h1 className="success-title">Your Flight Has Been Booked!</h1>
          <p className="success-subtitle">
            Booking confirmation and E-Ticket receipt have been simulated and saved to your account.
          </p>

          <div className="pnr-highlight-badge">
            <span className="pnr-lbl">BOOKING REFERENCE (PNR)</span>
            <span className="pnr-val">{booking.pnr}</span>
          </div>
        </div>

        {/* Boarding Pass / E-Ticket Card Layout */}
        <div className="ticket-card-view">
          <div className="ticket-header-strip">
            <div className="ticket-airline-info">
              <Plane size={20} className="text-secondary" />
              <span className="airline-name-bold">{flight.airline}</span>
              <span className="flight-code-badge">{flight.flightNumber}</span>
              <span className="aircraft-text">{flight.aircraft}</span>
            </div>
            <div className="ticket-status-pill">
              <span className="dot-green"></span>
              <span>{booking.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="ticket-body-grid">
            {/* Route & Times */}
            <div className="ticket-route-block">
              <div className="route-point">
                <span className="pt-time">{flight.departureTime}</span>
                <span className="pt-code">{flight.fromCode}</span>
                <span className="pt-city">{flight.fromCity}</span>
                <span className="pt-airport">{flight.fromAirport}</span>
              </div>

              <div className="route-center-indicator">
                <span className="route-dur">{flight.duration}</span>
                <div className="route-arrow-track">
                  <span className="track-dot"></span>
                  <div className="track-bar"></div>
                  <Plane size={14} className="track-plane" />
                  <span className="track-dot"></span>
                </div>
                <span className="route-stop-text">
                  {flight.stops === 0 ? 'Direct Non-stop' : flight.stopDetails}
                </span>
              </div>

              <div className="route-point text-right">
                <span className="pt-time">{flight.arrivalTime}</span>
                <span className="pt-code">{flight.toCode}</span>
                <span className="pt-city">{flight.toCity}</span>
                <span className="pt-airport">{flight.toAirport}</span>
              </div>
            </div>

            {/* Travel Metadata */}
            <div className="ticket-meta-grid">
              <div className="t-meta-item">
                <span className="t-meta-lbl">Date of Travel</span>
                <span className="t-meta-val">{formatDateReadable(booking.travelDate)}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-meta-lbl">Cabin Class</span>
                <span className="t-meta-val">{booking.travelClassName || 'Economy'}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-meta-lbl">Passengers</span>
                <span className="t-meta-val">{passengers?.length || 1} Guest(s)</span>
              </div>
              <div className="t-meta-item">
                <span className="t-meta-lbl">Total Fare Paid</span>
                <span className="t-meta-val highlight-fare">
                  {formatCurrency(fare?.finalPayable || 0)}
                </span>
              </div>
            </div>

            {/* Passenger & Seats List */}
            <div className="ticket-passengers-block">
              <h4 className="pax-list-heading">Passenger & Assigned Seats</h4>
              <div className="pax-cards-list">
                {passengers?.map((pax, idx) => (
                  <div key={idx} className="pax-summary-chip">
                    <User size={16} className="text-secondary" />
                    <div className="pax-chip-info">
                      <span className="pax-chip-name">{pax.fullName}</span>
                      <span className="pax-chip-sub">
                        {pax.age} yrs • {pax.gender} • Seat: <strong>{pax.seat}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Payment Summary Bar */}
            <div className="ticket-payment-receipt">
              <div className="receipt-col">
                <span className="receipt-lbl">Simulated Payment Mode</span>
                <span className="receipt-val">{booking.payment?.method || 'Online'}</span>
              </div>
              <div className="receipt-col">
                <span className="receipt-lbl">Transaction Reference</span>
                <span className="receipt-val mono">{booking.payment?.transactionId}</span>
              </div>
              <div className="receipt-col">
                <span className="receipt-lbl">Contact Email</span>
                <span className="receipt-val">{contactInfo?.email}</span>
              </div>
            </div>
          </div>

          {/* Ticket Card Action Footer */}
          <div className="ticket-action-footer">
            <button onClick={handleDownloadPDF} className="btn btn-primary btn-download-ticket">
              <Download size={18} />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Ticket as PDF'}</span>
            </button>

            <Link to="/my-bookings" className="btn btn-outline">
              <Calendar size={18} />
              <span>View My Bookings</span>
            </Link>

            <Link to="/" className="btn btn-secondary">
              <HomeIcon size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Airport guidelines callout */}
        <div className="airport-guidelines-box">
          <ShieldCheck size={20} className="text-primary flex-shrink-0" />
          <div className="guideline-text">
            <strong>Traveler Advisory:</strong> Please arrive at the airport at least 2 hours before
            domestic departures and 3 hours before international flights. Carry a valid
            government-issued photo identification for verification.
          </div>
        </div>
      </div>

      <style>{`
        .confirmation-page-root {
          padding: 40px 0 70px;
        }
        .conf-container {
          max-width: 860px;
          margin: 0 auto;
        }
        .success-banner-card {
          text-align: center;
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          padding: 36px 24px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
        }
        .success-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: var(--success-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .success-icon {
          color: var(--success);
        }
        .success-title {
          font-size: 2.1rem;
          color: var(--navy-dark);
          margin-bottom: 8px;
        }
        .success-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 540px;
          margin: 0 auto 20px;
        }
        .pnr-highlight-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: var(--primary-light);
          border: 1.5px dashed var(--secondary);
          padding: 8px 24px;
          border-radius: var(--radius-lg);
        }
        .pnr-lbl {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.8px;
        }
        .pnr-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 1.5px;
        }
        .ticket-card-view {
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          box-shadow: 0 10px 30px rgba(15, 76, 129, 0.08);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .ticket-header-strip {
          background: linear-gradient(90deg, #0f4c81 0%, #0284c7 100%);
          color: #ffffff;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ticket-airline-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .airline-name-bold {
          font-size: 1.15rem;
          font-weight: 800;
        }
        .flight-code-badge {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .aircraft-text {
          font-size: 0.8rem;
          color: #e0f2fe;
        }
        .ticket-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(16, 185, 129, 0.2);
          border: 1px solid #10b981;
          color: #a7f3d0;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 800;
        }
        .dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
        }
        .ticket-body-grid {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .ticket-route-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
        }
        .route-point {
          display: flex;
          flex-direction: column;
          max-width: 240px;
        }
        .route-point.text-right {
          text-align: right;
        }
        .pt-time {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--navy-dark);
          line-height: 1.1;
        }
        .pt-code {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--secondary);
        }
        .pt-city {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--navy-dark);
        }
        .pt-airport {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .route-center-indicator {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .route-dur {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .route-arrow-track {
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }
        .track-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--secondary);
        }
        .track-bar {
          flex: 1;
          height: 2px;
          background: #cbd5e1;
        }
        .track-plane {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          color: var(--secondary);
          background-color: #ffffff;
          padding: 1px;
        }
        .route-stop-text {
          font-size: 0.75rem;
          color: var(--success);
          font-weight: 700;
        }
        .ticket-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 16px 20px;
          background-color: #f8fafc;
          border-radius: var(--radius-md);
        }
        .t-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .t-meta-lbl {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .t-meta-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .t-meta-val.highlight-fare {
          color: var(--primary);
          font-size: 1.15rem;
        }
        .ticket-passengers-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pax-list-heading {
          font-size: 0.95rem;
          color: var(--navy-dark);
          font-weight: 700;
        }
        .pax-cards-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .pax-summary-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #ffffff;
          border: 1px solid var(--border-light);
          padding: 8px 16px;
          border-radius: var(--radius-md);
        }
        .pax-chip-info {
          display: flex;
          flex-direction: column;
        }
        .pax-chip-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .pax-chip-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .ticket-payment-receipt {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 16px;
          border-top: 1px dashed var(--border-light);
        }
        .receipt-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .receipt-lbl {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .receipt-val {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--navy-dark);
        }
        .receipt-val.mono {
          font-family: monospace;
          color: var(--primary);
        }
        .ticket-action-footer {
          background-color: #f8fafc;
          border-top: 1px solid var(--border-light);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          flex-wrap: wrap;
        }
        .airport-guidelines-box {
          background-color: var(--primary-light);
          border: 1px solid #bfdbfe;
          color: #1e3a8a;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .ticket-route-block {
            flex-direction: column;
            text-align: center;
          }
          .route-point {
            max-width: 100%;
          }
          .route-point.text-right {
            text-align: center;
          }
          .ticket-meta-grid {
            grid-template-columns: 1fr 1fr;
          }
          .ticket-payment-receipt {
            grid-template-columns: 1fr;
          }
          .ticket-action-footer {
            flex-direction: column;
            width: 100%;
          }
          .ticket-action-footer .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
