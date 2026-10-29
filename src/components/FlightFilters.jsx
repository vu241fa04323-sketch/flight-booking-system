// Flight filters sidebar with price range, stops, airlines, departure time, and reset options
import React from 'react';
import { Filter, RotateCcw, Clock, Plane, DollarSign, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '../utils/bookingUtils';

export default function FlightFilters({
  filters,
  setFilters,
  minPossiblePrice,
  maxPossiblePrice,
  availableAirlines = [],
  onReset
}) {
  // Toggle airline in filter list
  const handleAirlineToggle = (airlineName) => {
    const exists = filters.selectedAirlines.includes(airlineName);
    const updated = exists
      ? filters.selectedAirlines.filter((a) => a !== airlineName)
      : [...filters.selectedAirlines, airlineName];
    setFilters({ ...filters, selectedAirlines: updated });
  };

  // Toggle stop count
  const handleStopToggle = (stopVal) => {
    const exists = filters.selectedStops.includes(stopVal);
    const updated = exists
      ? filters.selectedStops.filter((s) => s !== stopVal)
      : [...filters.selectedStops, stopVal];
    setFilters({ ...filters, selectedStops: updated });
  };

  // Toggle departure time slot
  const handleTimeSlotToggle = (slotId) => {
    const exists = filters.selectedTimeSlots.includes(slotId);
    const updated = exists
      ? filters.selectedTimeSlots.filter((t) => t !== slotId)
      : [...filters.selectedTimeSlots, slotId];
    setFilters({ ...filters, selectedTimeSlots: updated });
  };

  const timeSlots = [
    { id: 'early', label: 'Early Morning', sub: 'Before 6:00 AM', icon: '🌅' },
    { id: 'morning', label: 'Morning', sub: '6:00 AM - 12:00 PM', icon: '☀️' },
    { id: 'afternoon', label: 'Afternoon', sub: '12:00 PM - 6:00 PM', icon: '🌤️' },
    { id: 'evening', label: 'Night / Evening', sub: 'After 6:00 PM', icon: '🌙' }
  ];

  return (
    <aside className="filters-sidebar">
      {/* Header & Reset */}
      <div className="filters-header">
        <div className="filters-title">
          <SlidersHorizontal size={18} className="text-secondary" />
          <span>Filter Results</span>
        </div>
        <button onClick={onReset} className="btn-reset-filters" title="Reset all filters">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Price Range Slider */}
      <div className="filter-section">
        <h4 className="section-title">Max Price per Passenger</h4>
        <div className="price-slider-box">
          <div className="price-display-row">
            <span>{formatCurrency(minPossiblePrice)}</span>
            <span className="current-max-price">{formatCurrency(filters.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={minPossiblePrice}
            max={maxPossiblePrice}
            step={200}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value, 10) })}
            className="filter-slider"
          />
        </div>
      </div>

      {/* 2. Number of Stops */}
      <div className="filter-section">
        <h4 className="section-title">Stops</h4>
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.selectedStops.includes(0)}
              onChange={() => handleStopToggle(0)}
            />
            <span className="checkbox-label">Non-stop Direct</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.selectedStops.includes(1)}
              onChange={() => handleStopToggle(1)}
            />
            <span className="checkbox-label">1 Stop</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.selectedStops.includes(2)}
              onChange={() => handleStopToggle(2)}
            />
            <span className="checkbox-label">2+ Stops</span>
          </label>
        </div>
      </div>

      {/* 3. Departure Time Slots */}
      <div className="filter-section">
        <h4 className="section-title">Departure Time</h4>
        <div className="time-slots-grid">
          {timeSlots.map((slot) => {
            const isSelected = filters.selectedTimeSlots.includes(slot.id);
            return (
              <button
                type="button"
                key={slot.id}
                onClick={() => handleTimeSlotToggle(slot.id)}
                className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
              >
                <span className="slot-emoji">{slot.icon}</span>
                <span className="slot-title">{slot.label}</span>
                <span className="slot-sub">{slot.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Preferred Airlines */}
      {availableAirlines.length > 0 && (
        <div className="filter-section">
          <h4 className="section-title">Airlines</h4>
          <div className="checkbox-list">
            {availableAirlines.map((airline) => {
              const isChecked = filters.selectedAirlines.includes(airline.name);
              return (
                <label key={airline.name} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAirlineToggle(airline.name)}
                  />
                  <span className="checkbox-label">
                    {airline.name} <span className="item-count">({airline.count})</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .filters-sidebar {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .filters-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy-dark);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-reset-filters {
          background: transparent;
          border: none;
          color: var(--secondary);
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast);
        }
        .btn-reset-filters:hover {
          background-color: var(--accent-light);
        }
        .filter-section {
          padding-bottom: 18px;
          margin-bottom: 18px;
          border-bottom: 1px solid var(--border-light);
        }
        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--navy-dark);
          margin-bottom: 12px;
        }
        .price-display-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .current-max-price {
          color: var(--primary);
          font-weight: 800;
          font-size: 0.95rem;
        }
        .filter-slider {
          width: 100%;
          accent-color: var(--secondary);
          cursor: pointer;
        }
        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--navy-dark);
          cursor: pointer;
        }
        .checkbox-item input[type='checkbox'] {
          width: 16px;
          height: 16px;
          accent-color: var(--secondary);
          cursor: pointer;
        }
        .item-count {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .time-slots-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .time-slot-btn {
          background-color: var(--bg-muted);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 8px 10px;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .time-slot-btn:hover {
          border-color: var(--secondary);
          background-color: #ffffff;
        }
        .time-slot-btn.selected {
          border-color: var(--secondary);
          background-color: var(--accent-light);
          box-shadow: 0 0 0 1px var(--secondary);
        }
        .slot-emoji {
          font-size: 1.1rem;
        }
        .slot-title {
          font-size: 0.785rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .slot-sub {
          font-size: 0.675rem;
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
}
