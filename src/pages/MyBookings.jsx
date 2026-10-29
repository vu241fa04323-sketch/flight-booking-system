// My Bookings page retrieving saved demo bookings, with View Ticket, Download PDF, and Cancel Booking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plane,
  Download,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { getBookings, cancelBooking, deleteBooking } from '../utils/storage';
import { generateTicketPDF } from '../utils/pdfUtils';
import { formatCurrency, formatDateReadable } from '../utils/bookingUtils';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Load bookings from storage
  const loadBookings = () => {
    const list = getBookings();
    setBookings(list || []);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Handle PDF Download
  const handleDownload = (booking) => {
    generateTicketPDF(booking);
  };

  // Confirm and execute cancellation
  const handleConfirmCancellation = () => {
    if (!cancelModalBooking) return;

    const ok = cancelBooking(cancelModalBooking.pnr);
    if (ok) {
      loadBookings();
      setFeedbackMessage(`Booking ${cancelModalBooking.pnr} has been successfully cancelled.`);
      setCancelModalBooking(null);
      setTimeout(() => setFeedbackMessage(''), 4000);
    }
  };

  // Filter bookings by search term (PNR or city or passenger name)
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase().trim();
    const matchPnr = b.pnr?.toLowerCase().includes(term);
    const matchFrom = b.flight?.fromCity?.toLowerCase().includes(term);
    const matchTo = b.flight?.toCity?.toLowerCase().includes(term);
    const matchAirline = b.flight?.airline?.toLowerCase().includes(term);
    const matchPax = b.passengers?.some((p) => p.fullName?.toLowerCase().includes(term));
    return matchPnr || matchFrom || matchTo || matchAirline || matchPax;
  });

  return (
    <div className="my-bookings-page-root animate-fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="my-bookings-header">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Manage your upcoming trips, download PDF tickets, or review past itineraries.
            </p>
          </div>

          <Link to="/flights" className="btn btn-primary">
            <Plane size={18} />
            <span>Book New Flight</span>
          </Link>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className="feedback-banner animate-fade-in">
            <CheckCircle2 size={18} className="text-success" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Search / Filter Bar */}
        {bookings.length > 0 && (
          <div className="bookings-search-bar">
            <div className="search-input-box">
              <Search size={18} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search by PNR, City, Airline, or Passenger Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="booking-search-input"
              />
            </div>
            <span className="booking-count-badge">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
            </span>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="bookings-list-stack">
            {filteredBookings.map((b) => {
              const isCancelled = b.status === 'Cancelled';
              return (
                <div key={b.pnr} className={`booking-item-card ${isCancelled ? 'cancelled-card' : ''}`}>
                  {/* Item Header */}
                  <div className="item-header-strip">
                    <div className="header-left">
                      <div className="pnr-tag">
                        <span className="pnr-label">PNR:</span>
                        <strong className="pnr-val-str">{b.pnr}</strong>
                      </div>
                      <span className="airline-chip">
                        {b.flight?.airline} ({b.flight?.flightNumber})
                      </span>
                    </div>

                    <div className="header-right">
                      <span className={`status-pill ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                        {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                      </span>
                    </div>
                  </div>

                  {/* Route & Schedule Body */}
                  <div className="item-body-grid">
                    {/* Departure */}
                    <div className="route-terminal">
                      <span className="route-time">{b.flight?.departureTime}</span>
                      <span className="route-city">{b.flight?.fromCity}</span>
                      <span className="route-code">({b.flight?.fromCode})</span>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="route-arrow-box">
                      <span className="arrow-dur">{b.flight?.duration}</span>
                      <div className="arrow-line-graphic">
                        <Plane size={14} className="arrow-plane-icon" />
                      </div>
                      <span className="arrow-stops">
                        {b.flight?.stops === 0 ? 'Non-stop' : b.flight?.stopDetails}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="route-terminal text-right">
                      <span className="route-time">{b.flight?.arrivalTime}</span>
                      <span className="route-city">{b.flight?.toCity}</span>
                      <span className="route-code">({b.flight?.toCode})</span>
                    </div>
                  </div>

                  {/* Booking Details Strip */}
                  <div className="item-details-strip">
                    <div className="detail-item">
                      <Calendar size={15} className="text-secondary" />
                      <span>Date: <strong>{formatDateReadable(b.travelDate)}</strong></span>
                    </div>

                    <div className="detail-item">
                      <User size={15} className="text-secondary" />
                      <span>
                        Guests: <strong>{b.passengers?.map((p) => p.fullName).join(', ')}</strong>
                      </span>
                    </div>

                    <div className="detail-item">
                      <span>Total Paid: <strong>{formatCurrency(b.fare?.finalPayable || 0)}</strong></span>
                    </div>
                  </div>

                  {/* Cancellation Note if cancelled */}
                  {isCancelled && (
                    <div className="cancelled-note-bar">
                      <AlertTriangle size={15} className="text-danger" />
                      <span>
                        Simulated Booking Cancellation: Refund processing initiated to your payment
                        source.
                      </span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="item-actions-footer">
                    <button
                      onClick={() => setSelectedBookingForModal(b)}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye size={15} />
                      <span>View Ticket</span>
                    </button>

                    <button
                      onClick={() => handleDownload(b)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={15} />
                      <span>Download PDF</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle size={15} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="empty-bookings-box animate-fade-in">
            <div className="empty-plane-circle">
              <Plane size={48} className="text-secondary" />
            </div>
            <h3 className="empty-title">
              {searchQuery ? 'No Matching Bookings Found' : 'No Flight Bookings Yet'}
            </h3>
            <p className="empty-sub">
              {searchQuery
                ? `No bookings match "${searchQuery}". Please check your search term or clear the filter.`
                : 'Your booked flight tickets will appear here with your PNR and downloadable PDF receipts.'}
            </p>
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="btn btn-outline">
                Clear Search
              </button>
            ) : (
              <Link to="/flights" className="btn btn-primary">
                <Plane size={18} />
                <span>Search and Book Flights</span>
              </Link>
            )}
          </div>
        )}

        {/* View Ticket Modal */}
        {selectedBookingForModal && (
          <div className="modal-backdrop animate-fade-in">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Flight Ticket Details (PNR: {selectedBookingForModal.pnr})</h3>
                <button
                  onClick={() => setSelectedBookingForModal(null)}
                  className="modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-route-recap">
                  <div>
                    <div className="recap-time">{selectedBookingForModal.flight?.departureTime}</div>
                    <div className="recap-city">{selectedBookingForModal.flight?.fromCity} ({selectedBookingForModal.flight?.fromCode})</div>
                    <div className="recap-airport">{selectedBookingForModal.flight?.fromAirport}</div>
                  </div>
                  <div className="recap-divider">
                    <span>{selectedBookingForModal.flight?.duration}</span>
                    <div className="line"></div>
                    <span>{selectedBookingForModal.flight?.stops === 0 ? 'Non-stop' : '1 Stop'}</span>
                  </div>
                  <div className="text-right">
                    <div className="recap-time">{selectedBookingForModal.flight?.arrivalTime}</div>
                    <div className="recap-city">{selectedBookingForModal.flight?.toCity} ({selectedBookingForModal.flight?.toCode})</div>
                    <div className="recap-airport">{selectedBookingForModal.flight?.toAirport}</div>
                  </div>
                </div>

                <div className="modal-info-grid">
                  <div className="m-info-box">
                    <span className="lbl">Carrier</span>
                    <span className="val">{selectedBookingForModal.flight?.airline} ({selectedBookingForModal.flight?.flightNumber})</span>
                  </div>
                  <div className="m-info-box">
                    <span className="lbl">Travel Date</span>
                    <span className="val">{formatDateReadable(selectedBookingForModal.travelDate)}</span>
                  </div>
                  <div className="m-info-box">
                    <span className="lbl">Cabin Class</span>
                    <span className="val">{selectedBookingForModal.travelClassName || 'Economy'}</span>
                  </div>
                  <div className="m-info-box">
                    <span className="lbl">Status</span>
                    <span className="val">{selectedBookingForModal.status}</span>
                  </div>
                </div>

                <div className="modal-pax-list">
                  <h4>Passengers</h4>
                  {selectedBookingForModal.passengers?.map((p, idx) => (
                    <div key={idx} className="m-pax-row">
                      <span><strong>{p.fullName}</strong> ({p.age} yrs, {p.gender})</span>
                      <span className="seat-badge">Seat: {p.seat}</span>
                    </div>
                  ))}
                </div>

                <div className="modal-fare-row">
                  <span>Total Amount:</span>
                  <strong>{formatCurrency(selectedBookingForModal.fare?.finalPayable || 0)}</strong>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => {
                    handleDownload(selectedBookingForModal);
                  }}
                  className="btn btn-primary"
                >
                  <Download size={16} />
                  <span>Download PDF Ticket</span>
                </button>
                <button
                  onClick={() => setSelectedBookingForModal(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalBooking && (
          <div className="modal-backdrop animate-fade-in">
            <div className="modal-card cancel-modal">
              <div className="cancel-icon-circle">
                <AlertTriangle size={36} className="text-danger" />
              </div>
              <h3>Cancel Flight Booking?</h3>
              <p className="cancel-prompt-text">
                Are you sure you want to cancel booking <strong>{cancelModalBooking.pnr}</strong> (
                {cancelModalBooking.flight?.airline} from {cancelModalBooking.flight?.fromCity} to{' '}
                {cancelModalBooking.flight?.toCity})?
              </p>

              <div className="cancel-sim-notice">
                <ShieldCheck size={18} />
                <span>
                  <strong>Frontend Demo Action:</strong> This will update the local booking status
                  to Cancelled and simulate a full refund to your mock payment source.
                </span>
              </div>

              <div className="cancel-modal-actions">
                <button onClick={handleConfirmCancellation} className="btn btn-danger">
                  Yes, Cancel Booking
                </button>
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="btn btn-secondary"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .my-bookings-page-root {
          padding: 40px 0 70px;
        }
        .my-bookings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        .page-title {
          font-size: 2.2rem;
          color: var(--navy-dark);
        }
        .page-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .feedback-banner {
          background-color: var(--success-light);
          border: 1px solid #a7f3d0;
          color: #065f46;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .bookings-search-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          border: 1px solid var(--border-light);
          padding: 10px 16px;
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          gap: 16px;
        }
        .search-input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .search-box-icon {
          color: var(--text-muted);
        }
        .booking-search-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: var(--navy-dark);
        }
        .booking-count-badge {
          background-color: var(--bg-muted);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }
        .bookings-list-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .booking-item-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: all var(--transition-normal);
        }
        .booking-item-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(15, 76, 129, 0.08);
        }
        .cancelled-card {
          opacity: 0.85;
          border-left: 4px solid var(--danger);
        }
        .item-header-strip {
          background-color: #f8fafc;
          border-bottom: 1px solid var(--border-light);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pnr-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
        }
        .pnr-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .pnr-val-str {
          color: var(--primary);
          font-size: 1rem;
          letter-spacing: 0.5px;
        }
        .airline-chip {
          background-color: #ffffff;
          border: 1px solid var(--border-light);
          font-size: 0.785rem;
          font-weight: 600;
          color: var(--navy-dark);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        .status-pill {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .status-pill.confirmed {
          background-color: var(--success-light);
          color: var(--success);
        }
        .status-pill.cancelled {
          background-color: var(--danger-light);
          color: var(--danger);
        }
        .item-body-grid {
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 20px;
          align-items: center;
        }
        .route-terminal {
          display: flex;
          flex-direction: column;
        }
        .route-terminal.text-right {
          text-align: right;
        }
        .route-time {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy-dark);
        }
        .route-city {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .route-code {
          font-size: 0.8rem;
          color: var(--secondary);
          font-weight: 600;
        }
        .route-arrow-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .arrow-dur {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .arrow-line-graphic {
          width: 100%;
          height: 2px;
          background: #cbd5e1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .arrow-plane-icon {
          position: absolute;
          color: var(--secondary);
          background: #ffffff;
          padding: 0 4px;
          transform: rotate(90deg);
        }
        .arrow-stops {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 600;
        }
        .item-details-strip {
          padding: 12px 24px;
          background-color: #fafbfc;
          border-top: 1px dashed var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .detail-item strong {
          color: var(--navy-dark);
        }
        .cancelled-note-bar {
          background-color: #fff1f2;
          color: #be123c;
          padding: 8px 24px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .item-actions-footer {
          padding: 12px 24px;
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }
        .empty-bookings-box {
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          border: 1.5px dashed var(--border-light);
          padding: 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .empty-plane-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-title {
          font-size: 1.4rem;
          color: var(--navy-dark);
        }
        .empty-sub {
          font-size: 0.925rem;
          color: var(--text-muted);
          max-width: 480px;
          line-height: 1.6;
        }
        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-card {
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          max-width: 600px;
          width: 100%;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }
        .cancel-modal {
          max-width: 460px;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .cancel-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: var(--danger-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cancel-prompt-text {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .cancel-sim-notice {
          background-color: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }
        .cancel-modal-actions {
          display: flex;
          gap: 12px;
          width: 100%;
          margin-top: 8px;
        }
        .cancel-modal-actions .btn {
          flex: 1;
        }
        .modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h3 {
          font-size: 1.15rem;
          color: var(--navy-dark);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .modal-route-recap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8fafc;
          padding: 16px;
          border-radius: var(--radius-md);
        }
        .recap-time {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--navy-dark);
        }
        .recap-city {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .recap-airport {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .recap-divider {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex: 1;
          padding: 0 12px;
        }
        .recap-divider .line {
          height: 1px;
          background: #cbd5e1;
          margin: 4px 0;
        }
        .modal-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .m-info-box {
          display: flex;
          flex-direction: column;
        }
        .m-info-box .lbl {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .m-info-box .val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .modal-pax-list h4 {
          font-size: 0.9rem;
          margin-bottom: 8px;
        }
        .m-pax-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          padding: 6px 0;
          border-bottom: 1px dashed var(--border-light);
        }
        .seat-badge {
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .modal-fare-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
        }
        .modal-fare-row strong {
          color: var(--primary);
        }
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        @media (max-width: 768px) {
          .item-body-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .route-terminal.text-right {
            text-align: center;
          }
          .item-details-strip {
            flex-direction: column;
            align-items: flex-start;
          }
          .item-actions-footer {
            flex-direction: column;
          }
          .item-actions-footer .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
