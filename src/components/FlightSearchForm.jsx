// Flight search form with trip type, airport selection, date pickers, passenger counter, and validation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { AIRPORTS, TRAVEL_CLASSES } from '../data/flightData';
import { useBooking } from '../context/BookingContext';
import { getFutureDate } from '../utils/bookingUtils';

export default function FlightSearchForm({ className = '', onSearchSubmitted }) {
  const { searchParams, updateSearchParams } = useBooking();
  const navigate = useNavigate();

  // Local state for the form inputs
  const [tripType, setTripType] = useState(searchParams.tripType || 'oneWay');
  const [fromCity, setFromCity] = useState(searchParams.from || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.to || 'Mumbai');
  const [departureDate, setDepartureDate] = useState(searchParams.departureDate || getFutureDate(3));
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || getFutureDate(7));
  const [passengers, setPassengers] = useState(searchParams.passengers || 1);
  const [travelClass, setTravelClass] = useState(searchParams.travelClass || 'economy');

  const [errorMessage, setErrorMessage] = useState('');

  const today = getFutureDate(0);

  // Swap From & To cities
  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    setErrorMessage('');
  };

  // Form submission & validation
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fromCity || !toCity) {
      setErrorMessage('Please choose both departure and destination airports.');
      return;
    }

    if (fromCity.toLowerCase().trim() === toCity.toLowerCase().trim()) {
      setErrorMessage('Departure and destination cities cannot be the same.');
      return;
    }

    if (!departureDate) {
      setErrorMessage('Please select a valid departure date.');
      return;
    }

    if (departureDate < today) {
      setErrorMessage('Departure date cannot be in the past.');
      return;
    }

    if (tripType === 'roundTrip') {
      if (!returnDate) {
        setErrorMessage('Please select a return date for your round trip.');
        return;
      }
      if (returnDate < departureDate) {
        setErrorMessage('Return date cannot be earlier than departure date.');
        return;
      }
    }

    const paxNum = parseInt(passengers, 10);
    if (isNaN(paxNum) || paxNum < 1 || paxNum > 9) {
      setErrorMessage('Please select between 1 and 9 passengers.');
      return;
    }

    // Save search params to Context
    updateSearchParams({
      from: fromCity,
      to: toCity,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : '',
      tripType,
      passengers: paxNum,
      travelClass
    });

    if (onSearchSubmitted) {
      onSearchSubmitted();
    } else {
      navigate('/flights');
    }
  };

  return (
    <div className={`flight-search-card ${className}`}>
      {/* Trip Type Selector & Class Badges */}
      <div className="search-top-bar">
        <div className="trip-type-radios">
          <label className={`trip-type-btn ${tripType === 'oneWay' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
            />
            <span>One-way</span>
          </label>
          <label className={`trip-type-btn ${tripType === 'roundTrip' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
            />
            <span>Round-trip</span>
          </label>
        </div>

        <div className="class-pills">
          <span className="class-label">
            <Briefcase size={14} /> Class:
          </span>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="class-select"
          >
            {TRAVEL_CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Error Alert */}
      {errorMessage && (
        <div className="search-error-alert animate-fade-in">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Fields Grid */}
      <form onSubmit={handleSubmit} className="search-fields-grid">
        {/* Origin / From Field */}
        <div className="search-field-box">
          <label className="field-label">
            <PlaneTakeoff size={16} className="label-icon text-secondary" />
            <span>From (Origin)</span>
          </label>
          <div className="field-input-wrap">
            <select
              value={fromCity}
              onChange={(e) => {
                setFromCity(e.target.value);
                setErrorMessage('');
              }}
              className="airport-select"
            >
              {AIRPORTS.map((ap) => (
                <option key={`from-${ap.code}`} value={ap.city}>
                  {ap.city} ({ap.code}) - {ap.airport}
                </option>
              ))}
            </select>
          </div>
          <div className="airport-subtext">
            {AIRPORTS.find((a) => a.city === fromCity)?.code || ''} •{' '}
            {AIRPORTS.find((a) => a.city === fromCity)?.country || ''}
          </div>
        </div>

        {/* Swap Button */}
        <div className="swap-btn-wrap">
          <button
            type="button"
            className="btn-swap-cities"
            onClick={handleSwapCities}
            title="Swap departure and destination"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Destination / To Field */}
        <div className="search-field-box">
          <label className="field-label">
            <PlaneLanding size={16} className="label-icon text-secondary" />
            <span>To (Destination)</span>
          </label>
          <div className="field-input-wrap">
            <select
              value={toCity}
              onChange={(e) => {
                setToCity(e.target.value);
                setErrorMessage('');
              }}
              className="airport-select"
            >
              {AIRPORTS.map((ap) => (
                <option key={`to-${ap.code}`} value={ap.city}>
                  {ap.city} ({ap.code}) - {ap.airport}
                </option>
              ))}
            </select>
          </div>
          <div className="airport-subtext">
            {AIRPORTS.find((a) => a.city === toCity)?.code || ''} •{' '}
            {AIRPORTS.find((a) => a.city === toCity)?.country || ''}
          </div>
        </div>

        {/* Departure Date */}
        <div className="search-field-box">
          <label className="field-label">
            <Calendar size={16} className="label-icon text-secondary" />
            <span>Departure Date</span>
          </label>
          <input
            type="date"
            min={today}
            value={departureDate}
            onChange={(e) => {
              setDepartureDate(e.target.value);
              setErrorMessage('');
            }}
            className="date-input"
            required
          />
        </div>

        {/* Return Date (Enabled on Round-trip) */}
        <div className={`search-field-box ${tripType === 'oneWay' ? 'field-disabled' : ''}`}>
          <label className="field-label">
            <Calendar size={16} className="label-icon text-secondary" />
            <span>Return Date</span>
          </label>
          <input
            type="date"
            min={departureDate || today}
            value={returnDate}
            onChange={(e) => {
              setReturnDate(e.target.value);
              setErrorMessage('');
            }}
            disabled={tripType === 'oneWay'}
            className="date-input"
            required={tripType === 'roundTrip'}
          />
          {tripType === 'oneWay' && (
            <span className="disabled-note">Select round-trip to enable</span>
          )}
        </div>

        {/* Passengers Count */}
        <div className="search-field-box pax-box">
          <label className="field-label">
            <Users size={16} className="label-icon text-secondary" />
            <span>Passengers</span>
          </label>
          <div className="pax-counter-wrap">
            <select
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
              className="pax-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="search-action-wrap">
          <button type="submit" className="btn btn-primary btn-search-flights">
            <Search size={20} />
            <span>Search Flights</span>
          </button>
        </div>
      </form>

      <style>{`
        .flight-search-card {
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          padding: 24px 28px;
          box-shadow: 0 12px 32px rgba(15, 76, 129, 0.12);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          z-index: 20;
        }
        .search-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }
        .trip-type-radios {
          display: flex;
          background-color: var(--bg-muted);
          padding: 4px;
          border-radius: var(--radius-full);
          gap: 4px;
        }
        .trip-type-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .trip-type-btn input {
          display: none;
        }
        .trip-type-btn.selected {
          background-color: #ffffff;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        .class-pills {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .class-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .class-select {
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border-light);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--navy-dark);
          background-color: #ffffff;
          cursor: pointer;
          outline: none;
        }
        .class-select:focus {
          border-color: var(--secondary);
        }
        .search-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--danger-light);
          color: var(--danger);
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 16px;
          border: 1px solid #fecaca;
        }
        .search-fields-grid {
          display: grid;
          grid-template-columns: 2fr auto 2fr 1.3fr 1.3fr 1.2fr auto;
          gap: 12px;
          align-items: center;
        }
        .search-field-box {
          background-color: #f8fafc;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all var(--transition-fast);
          min-width: 0;
        }
        .search-field-box:focus-within {
          border-color: var(--secondary);
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
        }
        .field-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .label-icon {
          color: var(--secondary);
        }
        .airport-select, .pax-select {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
          outline: none;
          cursor: pointer;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .airport-subtext {
          font-size: 0.75rem;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .swap-btn-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-swap-cities {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1.5px solid var(--border-light);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        .btn-swap-cities:hover {
          background-color: var(--primary-light);
          border-color: var(--secondary);
          transform: rotate(180deg);
        }
        .date-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
          outline: none;
          cursor: pointer;
        }
        .field-disabled {
          opacity: 0.55;
          background-color: #f1f5f9;
        }
        .disabled-note {
          font-size: 0.7rem;
          color: var(--text-light);
        }
        .search-action-wrap {
          display: flex;
          align-items: stretch;
        }
        .btn-search-flights {
          height: 100%;
          min-height: 64px;
          padding: 0 24px;
          border-radius: var(--radius-lg);
          font-size: 1.05rem;
        }
        @media (max-width: 1100px) {
          .search-fields-grid {
            grid-template-columns: 1fr 1fr;
          }
          .swap-btn-wrap {
            display: none;
          }
          .search-action-wrap {
            grid-column: span 2;
          }
        }
        @media (max-width: 680px) {
          .flight-search-card {
            padding: 18px 16px;
          }
          .search-fields-grid {
            grid-template-columns: 1fr;
          }
          .search-action-wrap {
            grid-column: span 1;
          }
          .btn-search-flights {
            min-height: 52px;
          }
        }
      `}</style>
    </div>
  );
}
