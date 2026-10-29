// Registration page with validation, password confirmation, and demo prototype storage
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Plane, ShieldAlert } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Register() {
  const { handleRegister } = useBooking();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      setError('Please enter your full name (at least 3 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneClean = (formData.mobile || '').replace(/\D/g, '');
    if (!formData.mobile || phoneClean.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = handleRegister({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });

      if (res.success) {
        navigate('/flights');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  return (
    <div className="auth-page-root animate-fade-in">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <Plane size={24} />
            </div>
            <h2 className="auth-title">Create SkyBook Account</h2>
            <p className="auth-subtitle">Sign up to access exclusive airline discounts and manage trips.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner animate-fade-in">
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                <User size={14} /> Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <Mail size={14} /> Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="priya@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mobile">
                <Phone size={14} /> Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} /> Password (Min. 6 chars)
              </label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-eye"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                <Lock size={14} /> Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-auth-submit" disabled={isLoading}>
              <UserPlus size={18} />
              <span>{isLoading ? 'Creating Account...' : 'Sign Up & Continue'}</span>
            </button>
          </form>

          {/* Switch link */}
          <div className="auth-footer-link">
            <span>Already registered? </span>
            <Link to="/login" className="highlight-link">
              Sign In Instead
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="auth-disclaimer-box">
            <ShieldAlert size={16} className="text-muted flex-shrink-0" />
            <div className="disclaimer-text">
              <strong>Local Prototype Notice:</strong> Account information is saved in browser
              localStorage for prototype simulation only. Never enter real sensitive passwords.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-root {
          padding: 60px 20px 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-container {
          max-width: 480px;
          margin: 0 auto;
        }
        .auth-card {
          background-color: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          padding: 36px 32px;
          box-shadow: 0 12px 36px rgba(15, 76, 129, 0.1);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-logo-badge {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        .auth-title {
          font-size: 1.5rem;
          color: var(--navy-dark);
          margin-bottom: 6px;
        }
        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-error-banner {
          background-color: var(--danger-light);
          border: 1px solid #fecaca;
          color: var(--danger);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 18px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .password-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-input-wrap .form-input {
          padding-right: 42px;
        }
        .btn-toggle-eye {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-auth-submit {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          margin-top: 6px;
        }
        .auth-footer-link {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
        .highlight-link {
          color: var(--secondary);
          font-weight: 700;
        }
        .auth-disclaimer-box {
          margin-top: 20px;
          background-color: var(--bg-muted);
          border: 1px solid var(--border-light);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
