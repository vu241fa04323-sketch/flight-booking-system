// Booking page containing flight recap, passenger form, and booking summary
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import PassengerForm from '../components/PassengerForm';
import BookingSummary from '../components/BookingSummary';

export default function Booking() {
  const { selectedFlight } = useBooking();
  const navigate = useNavigate();

  // Handle case where user refreshed or accessed /booking without choosing a flight
  if (!selectedFlight) {
    return (
      <div className="container no-flight-container animate-fade-in">
        <div className="no-flight-card">
          <div className="no-flight-icon">
            <AlertCircle size={48} className="text-secondary" />
          </div>
          <h2>No Flight Selected</h2>
          <p>
            Please search for available flights and select a flight before entering passenger
            details.
          </p>
          <Link to="/flights" className="btn btn-primary">
            <Plane size={18} />
            <span>Search & Select Flights</span>
          </Link>
        </div>
        <style>{`
          .no-flight-container {
            padding: 80px 20px;
            display: flex;
            justify-content: center;
          }
          .no-flight-card {
            background-color: #ffffff;
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-light);
            padding: 50px 40px;
            text-align: center;
            max-width: 520px;
            box-shadow: var(--shadow-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .no-flight-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: var(--primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  const handleContinueToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="booking-page-root">
      <div className="container">
        {/* Back Link */}
        <div className="booking-header-nav">
          <Link to="/flights" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Flight Results</span>
          </Link>
        </div>

        {/* Stepper Progress */}
        <div className="booking-stepper">
          <div className="step-item completed">
            <div className="step-circle">✓</div>
            <span className="step-label">1. Select Flight</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item active">
            <div className="step-circle">2</div>
            <span className="step-label">2. Passenger Details</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">3</div>
            <span className="step-label">3. Payment</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">4</div>
            <span className="step-label">4. Confirmation</span>
          </div>
        </div>

        {/* 2-Column Booking Layout */}
        <div className="booking-content-grid">
          {/* Left Column: Passenger Form */}
          <div className="form-column">
            <PassengerForm onSubmit={handleContinueToPayment} />
          </div>

          {/* Right Column: Sticky Booking Summary */}
          <div className="summary-column">
            <BookingSummary flight={selectedFlight} />
          </div>
        </div>
      </div>

      <style>{`
        .booking-page-root {
          padding-bottom: 60px;
        }
        .booking-header-nav {
          padding: 16px 0 8px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: color var(--transition-fast);
        }
        .back-link:hover {
          color: var(--primary);
        }
        .booking-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .booking-content-grid {
            grid-template-columns: 1fr;
          }
          .summary-column {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
