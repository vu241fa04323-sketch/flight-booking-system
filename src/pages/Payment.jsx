// Simulated payment gateway page with Credit/Debit, UPI, Net Banking, and Wallets
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, calculateFare } from '../utils/bookingUtils';
import BookingSummary from '../components/BookingSummary';

export default function Payment() {
  const { selectedFlight, searchParams, passengersData, finalizeBooking } = useBooking();
  const navigate = useNavigate();

  // Payment method tab: 'card', 'upi', 'netbanking', 'wallet'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateOutcome, setSimulateOutcome] = useState('success'); // 'success' or 'failure'
  const [errorMessage, setErrorMessage] = useState('');

  // Dummy form states for realism
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8892',
    name: passengersData[0]?.fullName || 'Demo Traveler',
    expiry: '12/28',
    cvv: '•••'
  });

  const [upiId, setUpiId] = useState('demo.traveler@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('phonepe');

  if (!selectedFlight) {
    navigate('/flights');
    return null;
  }

  const paxCount = parseInt(searchParams.passengers, 10) || 1;
  const fare = calculateFare({
    basePrice: selectedFlight.basePrice,
    passengers: paxCount,
    travelClass: searchParams.travelClass
  });

  // Execute payment simulation
  const handleProcessPayment = (forceFailure = false) => {
    setIsProcessing(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsProcessing(false);
      const shouldFail = forceFailure || simulateOutcome === 'failure';

      if (shouldFail) {
        setErrorMessage(
          'Simulated Payment Declined: Your bank declined the transaction due to mock authorization limits. You can retry with "Simulate Success".'
        );
      } else {
        // Success: finalize booking and save to localStorage
        const methodNames = {
          card: 'Credit / Debit Card',
          upi: 'UPI Transfer',
          netbanking: `Net Banking (${selectedBank})`,
          wallet: `Digital Wallet (${selectedWallet.toUpperCase()})`
        };

        const booking = finalizeBooking({
          paymentMethod: methodNames[paymentMethod] || 'Online Payment',
          status: 'Confirmed'
        });

        if (booking) {
          navigate('/confirmation');
        }
      }
    }, 1800);
  };

  return (
    <div className="payment-page-root">
      <div className="container">
        {/* Back Link */}
        <div className="payment-header-nav">
          <Link to="/booking" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Passenger Details</span>
          </Link>
        </div>

        {/* Stepper Progress */}
        <div className="booking-stepper">
          <div className="step-item completed">
            <div className="step-circle">✓</div>
            <span className="step-label">1. Flight Selected</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item completed">
            <div className="step-circle">✓</div>
            <span className="step-label">2. Passenger Details</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item active">
            <div className="step-circle">3</div>
            <span className="step-label">3. Payment</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">4</div>
            <span className="step-label">4. Confirmation</span>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="demo-gateway-alert">
          <ShieldCheck size={20} className="text-secondary" />
          <div className="alert-text">
            <strong>SIMULATED DEMO PAYMENT GATEWAY:</strong> No real money will be charged and no
            financial card information is processed or stored. You can test both successful and
            failed payment scenarios below.
          </div>
        </div>

        {/* Error message on failed payment */}
        {errorMessage && (
          <div className="payment-error-banner animate-fade-in">
            <XCircle size={22} className="text-danger flex-shrink-0" />
            <div className="error-content">
              <strong>Transaction Unsuccessful</strong>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Payment Grid */}
        <div className="payment-content-grid">
          {/* Payment Method Selector */}
          <div className="payment-main-col">
            <div className="payment-card">
              <h3 className="payment-title">Select Payment Method</h3>

              {/* Tabs */}
              <div className="payment-tabs-bar">
                <button
                  type="button"
                  className={`pay-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  className={`pay-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode size={18} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  className={`pay-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building2 size={18} />
                  <span>Net Banking</span>
                </button>
                <button
                  type="button"
                  className={`pay-tab-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <Wallet size={18} />
                  <span>Wallets</span>
                </button>
              </div>

              {/* Tab 1: Credit / Debit Card */}
              {paymentMethod === 'card' && (
                <div className="tab-pane animate-fade-in">
                  <div className="virtual-card-preview">
                    <div className="card-top">
                      <span className="card-chip"></span>
                      <span className="card-brand">SkyBank VISA</span>
                    </div>
                    <div className="card-number-val">•••• •••• •••• 8892</div>
                    <div className="card-bottom">
                      <div>
                        <div className="card-lbl">CARD HOLDER</div>
                        <div className="card-holder-name">{passengersData[0]?.fullName || 'DEMO TRAVELER'}</div>
                      </div>
                      <div>
                        <div className="card-lbl">EXPIRES</div>
                        <div className="card-exp">12/28</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-form-grid">
                    <div className="form-group full-span">
                      <label className="form-label">Card Number (Mock)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength="3"
                        className="form-input"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: UPI */}
              {paymentMethod === 'upi' && (
                <div className="tab-pane animate-fade-in">
                  <div className="upi-options-wrap">
                    <div className="upi-qr-card">
                      <div className="dummy-qr-box">
                        <QrCode size={110} className="qr-icon" />
                        <span className="scan-pill">Scan with any UPI App</span>
                      </div>
                      <div className="supported-upi-apps">
                        <span className="app-badge">GPay</span>
                        <span className="app-badge">PhonePe</span>
                        <span className="app-badge">Paytm</span>
                        <span className="app-badge">BHIM</span>
                      </div>
                    </div>

                    <div className="upi-vpa-box">
                      <label className="form-label">Or enter UPI Virtual ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                      />
                      <span className="input-hint">A mock payment notification will be simulated.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="tab-pane animate-fade-in">
                  <div className="bank-selection-grid">
                    {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Punjab National Bank'].map(
                      (bank) => (
                        <label
                          key={bank}
                          className={`bank-card-option ${selectedBank === bank ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="bank"
                            value={bank}
                            checked={selectedBank === bank}
                            onChange={() => setSelectedBank(bank)}
                          />
                          <Building2 size={20} className="bank-icon" />
                          <span className="bank-name">{bank} Bank</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Wallets */}
              {paymentMethod === 'wallet' && (
                <div className="tab-pane animate-fade-in">
                  <div className="wallet-list">
                    {[
                      { id: 'phonepe', name: 'PhonePe Wallet', balance: '₹4,500' },
                      { id: 'paytm', name: 'Paytm Wallet', balance: '₹8,200' },
                      { id: 'amazon', name: 'Amazon Pay Balance', balance: '₹12,000' }
                    ].map((w) => (
                      <label
                        key={w.id}
                        className={`wallet-row-item ${selectedWallet === w.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="wallet"
                          value={w.id}
                          checked={selectedWallet === w.id}
                          onChange={() => setSelectedWallet(w.id)}
                        />
                        <div className="wallet-info">
                          <span className="wallet-name">{w.name}</span>
                          <span className="wallet-bal">Mock Balance: {w.balance}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation Testing Control Bar */}
              <div className="simulation-tester-box">
                <span className="tester-label">
                  <Lock size={14} /> Demo Flow Control:
                </span>
                <div className="tester-buttons">
                  <button
                    type="button"
                    onClick={() => handleProcessPayment(false)}
                    disabled={isProcessing}
                    className="btn btn-primary btn-pay-now"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="spinner-icon" />
                        <span>Simulating Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Simulate Successful Payment ({formatCurrency(fare.finalPayable)})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProcessPayment(true)}
                    disabled={isProcessing}
                    className="btn btn-danger btn-fail-test"
                  >
                    <XCircle size={16} />
                    <span>Test Failed Scenario</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="payment-summary-col">
            <BookingSummary flight={selectedFlight} />
          </div>
        </div>
      </div>

      <style>{`
        .payment-page-root {
          padding-bottom: 60px;
        }
        .payment-header-nav {
          padding: 16px 0 8px;
        }
        .demo-gateway-alert {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 0.875rem;
        }
        .alert-text strong {
          color: #15803d;
        }
        .payment-error-banner {
          background-color: var(--danger-light);
          border: 1px solid #fecaca;
          color: var(--danger);
          padding: 14px 18px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
        }
        .error-content strong {
          font-size: 0.95rem;
        }
        .error-content p {
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .payment-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        .payment-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }
        .payment-title {
          font-size: 1.25rem;
          color: var(--navy-dark);
          margin-bottom: 20px;
        }
        .payment-tabs-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
          background-color: var(--bg-muted);
          padding: 4px;
          border-radius: var(--radius-lg);
        }
        .pay-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 10px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .pay-tab-btn.active {
          background-color: #ffffff;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        .tab-pane {
          padding-bottom: 20px;
        }
        .virtual-card-preview {
          background: linear-gradient(135deg, #0a2540 0%, #1e40af 100%);
          color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 10px 20px rgba(10, 37, 64, 0.2);
          max-width: 400px;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        .card-chip {
          width: 36px;
          height: 26px;
          background: #fbbf24;
          border-radius: 4px;
          display: inline-block;
        }
        .card-brand {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .card-number-val {
          font-family: monospace;
          font-size: 1.35rem;
          letter-spacing: 2px;
          margin-bottom: 24px;
        }
        .card-bottom {
          display: flex;
          justify-content: space-between;
        }
        .card-lbl {
          font-size: 0.65rem;
          color: #93c5fd;
          letter-spacing: 0.5px;
        }
        .card-holder-name, .card-exp {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .card-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .full-span {
          grid-column: span 2;
        }
        .upi-options-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: center;
        }
        .upi-qr-card {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background-color: #f8fafc;
        }
        .dummy-qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .qr-icon {
          color: var(--navy-dark);
        }
        .scan-pill {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
        }
        .supported-upi-apps {
          display: flex;
          gap: 6px;
        }
        .app-badge {
          background-color: #ffffff;
          border: 1px solid var(--border-light);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .input-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }
        .bank-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .bank-card-option {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .bank-card-option input {
          display: none;
        }
        .bank-card-option.selected {
          border-color: var(--secondary);
          background-color: var(--accent-light);
        }
        .bank-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--navy-dark);
        }
        .wallet-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wallet-row-item {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          cursor: pointer;
        }
        .wallet-row-item.selected {
          border-color: var(--secondary);
          background-color: var(--accent-light);
        }
        .wallet-info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
        }
        .wallet-name {
          font-weight: 600;
          color: var(--navy-dark);
        }
        .wallet-bal {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .simulation-tester-box {
          border-top: 1px solid var(--border-light);
          padding-top: 24px;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tester-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tester-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-pay-now {
          flex: 1;
          min-width: 220px;
        }
        .spinner-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 960px) {
          .payment-content-grid {
            grid-template-columns: 1fr;
          }
          .payment-summary-col {
            order: -1;
          }
          .upi-options-wrap {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
