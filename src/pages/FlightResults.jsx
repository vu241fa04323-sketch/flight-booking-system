// Flight search results page with sorting, filter sidebar, modifier bar, and empty states
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Filter,
  SlidersHorizontal,
  Search,
  Plane,
  Calendar,
  Users,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { searchFlights, findAirport } from '../data/flightData';
import { formatDateReadable, formatCurrency } from '../utils/bookingUtils';
import FlightCard from '../components/FlightCard';
import FlightFilters from '../components/FlightFilters';
import FlightSearchForm from '../components/FlightSearchForm';

export default function FlightResults() {
  const { searchParams } = useBooking();
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [sortBy, setSortBy] = useState('cheapest'); // 'cheapest', 'fastest', 'earliest', 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // 1. Fetch raw flights for current search criteria
  const rawFlights = useMemo(() => {
    return searchFlights({
      from: searchParams.from,
      to: searchParams.to,
      departureDate: searchParams.departureDate,
      travelClass: searchParams.travelClass
    });
  }, [searchParams.from, searchParams.to, searchParams.departureDate, searchParams.travelClass]);

  // Derive min and max price across raw flights for the slider bounds
  const { minPossiblePrice, maxPossiblePrice, availableAirlines } = useMemo(() => {
    if (!rawFlights || rawFlights.length === 0) {
      return { minPossiblePrice: 2000, maxPossiblePrice: 50000, availableAirlines: [] };
    }

    let min = Infinity;
    let max = -Infinity;
    const airlineMap = {};

    rawFlights.forEach((f) => {
      if (f.basePrice < min) min = f.basePrice;
      if (f.basePrice > max) max = f.basePrice;
      airlineMap[f.airline] = (airlineMap[f.airline] || 0) + 1;
    });

    const airlines = Object.keys(airlineMap).map((name) => ({
      name,
      count: airlineMap[name]
    }));

    return {
      minPossiblePrice: min,
      maxPossiblePrice: Math.ceil(max / 500) * 500,
      availableAirlines: airlines
    };
  }, [rawFlights]);

  // 2. Filter states
  const [filters, setFilters] = useState({
    maxPrice: maxPossiblePrice || 50000,
    selectedStops: [], // empty = all
    selectedAirlines: [], // empty = all
    selectedTimeSlots: [] // empty = all
  });

  // Keep maxPrice in sync if raw flights change
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: maxPossiblePrice
    }));
  }, [maxPossiblePrice]);

  const handleResetFilters = () => {
    setFilters({
      maxPrice: maxPossiblePrice,
      selectedStops: [],
      selectedAirlines: [],
      selectedTimeSlots: []
    });
  };

  // 3. Filter the flights
  const filteredFlights = useMemo(() => {
    return rawFlights.filter((flight) => {
      // Price filter
      if (flight.basePrice > filters.maxPrice) return false;

      // Stops filter
      if (filters.selectedStops.length > 0) {
        if (!filters.selectedStops.includes(flight.stops)) return false;
      }

      // Airline filter
      if (filters.selectedAirlines.length > 0) {
        if (!filters.selectedAirlines.includes(flight.airline)) return false;
      }

      // Time slot filter (Departure time based)
      if (filters.selectedTimeSlots.length > 0) {
        const [hourStr] = flight.departureTime.split(':');
        const hour = parseInt(hourStr, 10);

        let matchesTime = false;
        if (filters.selectedTimeSlots.includes('early') && hour < 6) matchesTime = true;
        if (filters.selectedTimeSlots.includes('morning') && hour >= 6 && hour < 12) matchesTime = true;
        if (filters.selectedTimeSlots.includes('afternoon') && hour >= 12 && hour < 18) matchesTime = true;
        if (filters.selectedTimeSlots.includes('evening') && hour >= 18) matchesTime = true;

        if (!matchesTime) return false;
      }

      return true;
    });
  }, [rawFlights, filters]);

  // 4. Sort the filtered flights
  const sortedFlights = useMemo(() => {
    const list = [...filteredFlights];
    if (sortBy === 'cheapest') {
      return list.sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sortBy === 'fastest') {
      return list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }
    if (sortBy === 'earliest') {
      return list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [filteredFlights, sortBy]);

  const fromAp = findAirport(searchParams.from);
  const toAp = findAirport(searchParams.to);

  return (
    <div className="results-page-root">
      {/* Search Header Summary Bar */}
      <div className="search-summary-bar">
        <div className="container summary-inner">
          <div className="route-brief">
            <div className="route-tags">
              <span className="route-city-tag">
                {fromAp?.city || searchParams.from} ({fromAp?.code || 'ORIGIN'})
              </span>
              <span className="route-arrow">✈</span>
              <span className="route-city-tag">
                {toAp?.city || searchParams.to} ({toAp?.code || 'DEST'})
              </span>
            </div>

            <div className="route-meta-pills">
              <span className="meta-pill">
                <Calendar size={14} /> {formatDateReadable(searchParams.departureDate)}
              </span>
              {searchParams.tripType === 'roundTrip' && searchParams.returnDate && (
                <span className="meta-pill">
                  <Calendar size={14} /> Return: {formatDateReadable(searchParams.returnDate)}
                </span>
              )}
              <span className="meta-pill">
                <Users size={14} /> {searchParams.passengers} Guest(s)
              </span>
              <span className="meta-pill class-pill">
                {searchParams.travelClass.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowEditSearch(!showEditSearch)}
            className="btn btn-outline btn-sm btn-edit-search"
          >
            <span>{showEditSearch ? 'Close Search' : 'Modify Search'}</span>
            {showEditSearch ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Search Modification Form */}
      {showEditSearch && (
        <div className="container edit-search-container animate-fade-in">
          <FlightSearchForm
            className="edit-search-card"
            onSearchSubmitted={() => setShowEditSearch(false)}
          />
        </div>
      )}

      {/* Main Results Layout */}
      <div className="container results-layout-container">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-outline btn-sm"
          >
            <Filter size={15} />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Flights'}</span>
          </button>
          <span className="results-count-text">
            <strong>{sortedFlights.length}</strong> flights found
          </span>
        </div>

        <div className="results-grid-layout">
          {/* Left Column: Filter Sidebar */}
          <div className={`filters-col ${mobileFilterOpen ? 'mobile-visible' : ''}`}>
            <FlightFilters
              filters={filters}
              setFilters={setFilters}
              minPossiblePrice={minPossiblePrice}
              maxPossiblePrice={maxPossiblePrice}
              availableAirlines={availableAirlines}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Column: Sorting Bar and Flight Cards */}
          <main className="flights-list-col">
            {/* Sorting Tab Bar */}
            <div className="sorting-tabs-card">
              <div className="sorting-label">
                <ArrowUpDown size={16} className="text-secondary" />
                <span>Sort By:</span>
              </div>
              <div className="sorting-buttons-wrap">
                <button
                  type="button"
                  className={`sort-tab-btn ${sortBy === 'cheapest' ? 'active' : ''}`}
                  onClick={() => setSortBy('cheapest')}
                >
                  Cheapest
                </button>
                <button
                  type="button"
                  className={`sort-tab-btn ${sortBy === 'fastest' ? 'active' : ''}`}
                  onClick={() => setSortBy('fastest')}
                >
                  Fastest
                </button>
                <button
                  type="button"
                  className={`sort-tab-btn ${sortBy === 'earliest' ? 'active' : ''}`}
                  onClick={() => setSortBy('earliest')}
                >
                  Earliest Departure
                </button>
                <button
                  type="button"
                  className={`sort-tab-btn ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </button>
              </div>
            </div>

            {/* Flight Cards List */}
            {sortedFlights.length > 0 ? (
              <div className="flights-cards-stack">
                {sortedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="empty-results-card animate-fade-in">
                <div className="empty-icon-box">
                  <Plane size={44} className="text-muted" />
                </div>
                <h3 className="empty-title">No Flights Found</h3>
                <p className="empty-desc">
                  No flights match your current active filters. Try loosening your price limit,
                  selecting different departure times, or clearing applied filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .results-page-root {
          padding-bottom: 50px;
        }
        .search-summary-bar {
          background: #ffffff;
          border-bottom: 1px solid var(--border-light);
          padding: 16px 0;
          box-shadow: var(--shadow-sm);
        }
        .summary-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .route-brief {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .route-tags {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .route-city-tag {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy-dark);
        }
        .route-arrow {
          color: var(--secondary);
          font-size: 1.1rem;
        }
        .route-meta-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-muted);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.785rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .meta-pill.class-pill {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
        }
        .edit-search-container {
          margin-top: 20px;
          margin-bottom: 24px;
        }
        .results-layout-container {
          margin-top: 28px;
        }
        .mobile-filter-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .results-count-text {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .results-grid-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 28px;
          align-items: start;
        }
        .sorting-tabs-card {
          background-color: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
        }
        .sorting-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .sorting-buttons-wrap {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sort-tab-btn {
          background-color: var(--bg-muted);
          border: 1px solid transparent;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .sort-tab-btn:hover {
          color: var(--navy-dark);
          background-color: #e2e8f0;
        }
        .sort-tab-btn.active {
          background-color: var(--secondary);
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(2, 132, 199, 0.25);
        }
        .empty-results-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1.5px dashed var(--border-light);
          padding: 50px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .empty-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: var(--bg-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-title {
          font-size: 1.4rem;
          color: var(--navy-dark);
        }
        .empty-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 480px;
          line-height: 1.6;
        }
        @media (max-width: 960px) {
          .results-grid-layout {
            grid-template-columns: 1fr;
          }
          .filters-col {
            display: none;
          }
          .filters-col.mobile-visible {
            display: block;
          }
          .mobile-filter-bar {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
