// Login page with password visibility toggling, input validation, and prototype disclaimer
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Plane, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Login() {
  const { handleLogin } = useBooking();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your account email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = handleLogin({ email, password });
      if (res.success) {
        navigate('/flights');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  // Instant demo login helper
  const handleQuickDemoLogin = () => {
    setEmail('arjun@skybook.com');
    setPassword('Password123');
    const res = handleLogin({ email: 'arjun@skybook.com', password: 'Password123' });
    if (res.success) {
      navigate('/flights');
    }
  };

  return (
    <div className="auth-page-root animate-fade-in">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Logo Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <Plane size={24} />
            </div>
            <h2 className="auth-title">Welcome to SkyBook</h2>
            <p className="auth-subtitle">Log in to manage bookings and speed up flight checkouts.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner animate-fade-in">
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <Mail size={14} /> Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} /> Password
              </label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className="btn btn-primary btn-auth-submit" disabled={isLoading}>
              <LogIn size={18} />
              <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
            </button>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn btn-outline btn-demo-quick"
            >
              <Sparkles size={16} className="text-secondary" />
              <span>Quick Demo Login (One-Click)</span>
            </button>
          </form>

          {/* Switch link */}
          <div className="auth-footer-link">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="highlight-link">
              Create an Account
            </Link>
          </div>

          {/* Prototype Security Disclaimer */}
          <div className="auth-disclaimer-box">
            <ShieldAlert size={16} className="text-muted flex-shrink-0" />
            <div className="disclaimer-text">
              <strong>Frontend Prototype Notice:</strong> Authentication is handled via browser
              localStorage for demonstration purposes only. Production systems require secure
              backend password hashing (e.g., bcrypt), JWT/session tokens, and OAuth2.
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
          max-width: 460px;
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
          gap: 16px;
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
          margin-top: 4px;
        }
        .btn-demo-quick {
          width: 100%;
          border-style: dashed;
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
