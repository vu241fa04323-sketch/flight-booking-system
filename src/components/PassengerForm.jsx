// Passenger form with dynamic multi-passenger cards, validation, and contact details
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function PassengerForm({ onSubmit, isSubmitting = false }) {
  const { passengersData, setPassengersData, contactInfo, setContactInfo } = useBooking();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  // Update a single passenger's detail field
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengersData];
    updated[index] = { ...updated[index], [field]: value };
    setPassengersData(updated);

    // Clear error for this field
    if (errors[`pax_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`pax_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  // Update contact information
  const handleContactChange = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Form validation before proceeding
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate each passenger
    passengersData.forEach((pax, i) => {
      if (!pax.fullName || pax.fullName.trim().length < 3) {
        newErrors[`pax_${i}_fullName`] = 'Full name must be at least 3 characters.';
      }
      const ageNum = parseInt(pax.age, 10);
      if (!pax.age || isNaN(ageNum) || ageNum < 1 || ageNum > 110) {
        newErrors[`pax_${i}_age`] = 'Please enter a valid age between 1 and 110.';
      }
      if (!pax.gender) {
        newErrors[`pax_${i}_gender`] = 'Please select gender.';
      }
    });

    // Validate Contact Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactInfo.email || !emailRegex.test(contactInfo.email)) {
      newErrors.email = 'Please provide a valid email address for your E-Ticket.';
    }

    // Validate 10-digit mobile number
    const phoneClean = (contactInfo.mobile || '').replace(/\D/g, '');
    if (!contactInfo.mobile || phoneClean.length < 10) {
      newErrors.mobile = 'Please enter a valid 10-digit contact mobile number.';
    }

    // Validate Terms checkbox
    if (!agreedTerms) {
      newErrors.terms = 'You must review and agree to the booking terms & conditions.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(firstKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="passenger-form-root" noValidate>
      {/* 1. Passenger Information Cards */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="header-title-box">
            <User className="text-secondary" size={20} />
            <h3 className="section-card-title">Passenger Information</h3>
          </div>
          <span className="pax-badge">
            {passengersData.length} {passengersData.length === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        <p className="section-note">
          Please ensure names match exactly with government-issued photo ID (Passport / Aadhaar).
        </p>

        <div className="passengers-list">
          {passengersData.map((pax, index) => {
            const nameErr = errors[`pax_${index}_fullName`];
            const ageErr = errors[`pax_${index}_age`];
            const genderErr = errors[`pax_${index}_gender`];

            return (
              <div key={index} className="passenger-entry-box">
                <div className="entry-header">
                  <span className="entry-title">Passenger {index + 1}</span>
                  <span className="seat-assigned-pill">Seat: {pax.seat || `${14 + index}A`}</span>
                </div>

                <div className="entry-grid">
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor={`pax_${index}_fullName`}>
                      Full Name *
                    </label>
                    <input
                      id={`pax_${index}_fullName`}
                      type="text"
                      className={`form-input ${nameErr ? 'error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={pax.fullName}
                      onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                    />
                    {nameErr && <span className="error-text">{nameErr}</span>}
                  </div>

                  {/* Age */}
                  <div className="form-group">
                    <label className="form-label" htmlFor={`pax_${index}_age`}>
                      Age (Years) *
                    </label>
                    <input
                      id={`pax_${index}_age`}
                      type="number"
                      min="1"
                      max="110"
                      className={`form-input ${ageErr ? 'error' : ''}`}
                      placeholder="e.g. 28"
                      value={pax.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    />
                    {ageErr && <span className="error-text">{ageErr}</span>}
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label" htmlFor={`pax_${index}_gender`}>
                      Gender *
                    </label>
                    <select
                      id={`pax_${index}_gender`}
                      className={`form-select ${genderErr ? 'error' : ''}`}
                      value={pax.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {genderErr && <span className="error-text">{genderErr}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Primary Contact Details */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="header-title-box">
            <Mail className="text-secondary" size={20} />
            <h3 className="section-card-title">Contact & Communication Details</h3>
          </div>
        </div>
        <p className="section-note">
          Booking confirmation, flight status alerts, and E-Ticket PDF will be sent to these details.
        </p>

        <div className="contact-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <Mail size={14} /> Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="e.g. yourname@example.com"
              value={contactInfo.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mobile">
              <Phone size={14} /> Mobile Phone Number *
            </label>
            <input
              id="mobile"
              type="tel"
              className={`form-input ${errors.mobile ? 'error' : ''}`}
              placeholder="e.g. 9876543210"
              value={contactInfo.mobile}
              onChange={(e) => handleContactChange('mobile', e.target.value)}
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>
        </div>
      </div>

      {/* 3. Terms & Conditions Acceptance */}
      <div className="terms-card">
        <label className="terms-checkbox-wrap">
          <input
            type="checkbox"
            id="terms"
            checked={agreedTerms}
            onChange={(e) => {
              setAgreedTerms(e.target.checked);
              if (errors.terms) {
                const newErr = { ...errors };
                delete newErr.terms;
                setErrors(newErr);
              }
            }}
          />
          <span className="terms-text">
            I confirm that the passenger names match government ID cards, and I agree to the{' '}
            <strong>SkyBook Airline Booking Terms</strong>, Fare Rules, and Cancellation Policy.
          </span>
        </label>
        {errors.terms && <div className="error-text terms-err">{errors.terms}</div>}
      </div>

      {/* Submit Button */}
      <div className="form-actions-wrap">
        <button
          type="submit"
          className="btn btn-primary btn-lg btn-continue-payment"
          disabled={isSubmitting}
        >
          <span>Continue to Payment</span>
        </button>
      </div>

      <style>{`
        .passenger-form-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .section-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .header-title-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-card-title {
          font-size: 1.15rem;
          color: var(--navy-dark);
          font-weight: 700;
        }
        .pax-badge {
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }
        .section-note {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .passengers-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .passenger-entry-box {
          background-color: #f8fafc;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px 20px;
        }
        .entry-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--border-light);
        }
        .entry-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-dark);
        }
        .seat-assigned-pill {
          background-color: #ffffff;
          border: 1px solid var(--border-light);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
        }
        .entry-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .terms-card {
          background-color: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          padding: 18px 20px;
        }
        .terms-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .terms-checkbox-wrap input[type='checkbox'] {
          width: 18px;
          height: 18px;
          accent-color: var(--secondary);
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .terms-text {
          font-size: 0.875rem;
          color: var(--navy-dark);
          line-height: 1.5;
        }
        .terms-err {
          margin-top: 8px;
          padding-left: 30px;
        }
        .form-actions-wrap {
          display: flex;
          justify-content: flex-end;
        }
        .btn-continue-payment {
          width: 100%;
          max-width: 260px;
        }
        @media (max-width: 768px) {
          .entry-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .btn-continue-payment {
            max-width: 100%;
          }
        }
      `}</style>
    </form>
  );
}
