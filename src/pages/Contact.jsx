// Contact Us page with customer support information, contact form, and FAQ accordion
import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!formData.subject || formData.subject.trim().length < 3) {
      setError('Please provide a subject for your enquiry.');
      return;
    }

    if (!formData.message || formData.message.trim().length < 10) {
      setError('Please enter a message containing at least 10 characters.');
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      q: 'How do I download my flight ticket PDF?',
      a: 'After completing your booking on SkyBook, you will be redirected to the Confirmation page where you can click "Download Ticket as PDF". You can also navigate to "My Bookings" at any time and click "Download PDF" beside any confirmed booking.'
    },
    {
      q: 'Can I cancel my booking and get a refund?',
      a: 'Yes. In this simulated booking portal, you can visit "My Bookings", click "Cancel Booking", and confirm the action. The application will simulate the cancellation workflow and record your refund status.'
    },
    {
      q: 'What are standard baggage allowances?',
      a: 'Standard domestic Economy flights include 7 kg of cabin hand baggage and 15 kg of check-in baggage. Business and First Class tickets include up to 30 kg to 40 kg check-in luggage.'
    },
    {
      q: 'When should I report at the airport?',
      a: 'For domestic flights within India, please arrive at least 2 hours before scheduled departure. For international flights (e.g. Dubai, London, Singapore), arrive at least 3 hours prior.'
    }
  ];

  return (
    <div className="contact-page-root animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="contact-header-wrap">
          <span className="badge badge-primary">Customer Care & Support</span>
          <h1 className="contact-main-heading">Get in Touch With Us</h1>
          <p className="contact-subheading">
            Have questions about your booking, airline policies, or flight schedules? Our dedicated
            team is here to assist 24/7.
          </p>
        </div>

        {/* 2-Column Grid: Channels + Contact Form */}
        <div className="contact-grid-layout">
          {/* Left Column: Channels & Office Info */}
          <div className="contact-info-column">
            <div className="support-channels-card">
              <h3>Support Channels</h3>
              <p className="channels-desc">Reach out via any of our round-the-clock contact points:</p>

              <div className="channel-rows-list">
                <div className="channel-item">
                  <div className="channel-icon-wrap bg-blue">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="channel-title">Toll-Free Helpline</div>
                    <div className="channel-detail">1800-SKY-BOOK (+91 1800 759 2665)</div>
                    <div className="channel-sub">Available 24 hours a day, 7 days a week</div>
                  </div>
                </div>

                <div className="channel-item">
                  <div className="channel-icon-wrap bg-green">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="channel-title">Official Support Email</div>
                    <div className="channel-detail">support@skybook.com</div>
                    <div className="channel-sub">Average response time: within 2 hours</div>
                  </div>
                </div>

                <div className="channel-item">
                  <div className="channel-icon-wrap bg-purple">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="channel-title">Headquarters Office</div>
                    <div className="channel-detail">SkyBook Aviation Towers, Aerocity</div>
                    <div className="channel-sub">New Delhi, 110037, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel FAQs Accordion */}
            <div className="faq-accordion-card">
              <div className="faq-header">
                <HelpCircle size={20} className="text-secondary" />
                <h3>Frequently Asked Questions</h3>
              </div>

              <div className="faq-items-list">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="faq-item">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="faq-question-btn"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {isOpen && <div className="faq-answer-pane">{faq.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              <div className="form-card-header">
                <MessageSquare size={22} className="text-secondary" />
                <div>
                  <h3 className="form-card-title">Send Us a Message</h3>
                  <p className="form-card-sub">We will respond promptly to your request.</p>
                </div>
              </div>

              {submitted ? (
                <div className="form-success-alert animate-fade-in">
                  <CheckCircle2 size={36} className="text-success" />
                  <h4>Message Recorded Successfully!</h4>
                  <p>
                    Thank you for reaching out to SkyBook. In this demonstration prototype, your
                    inquiry has been recorded locally. For actual flight bookings, visit the Search
                    Flights page.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-body" noValidate>
                  {error && (
                    <div className="contact-error-box animate-fade-in">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Your Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">
                      Subject / Topic *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Baggage allowance query"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="form-input textarea-field"
                      placeholder="Please describe how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-send-message">
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>

                  <div className="simulation-note">
                    * Note: This contact form is part of a frontend prototype. No emails are sent to
                    external servers.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page-root {
          padding: 40px 0 70px;
        }
        .contact-header-wrap {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 40px;
        }
        .contact-main-heading {
          font-size: 2.2rem;
          color: var(--navy-dark);
          margin-top: 10px;
          margin-bottom: 8px;
        }
        .contact-subheading {
          font-size: 1rem;
          color: var(--text-muted);
        }
        .contact-grid-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 36px;
          align-items: start;
        }
        .support-channels-card, .faq-accordion-card, .contact-form-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }
        .channels-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 6px;
          margin-bottom: 20px;
        }
        .channel-rows-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .channel-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .channel-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .channel-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .channel-detail {
          font-size: 1rem;
          font-weight: 700;
          color: var(--navy-dark);
          margin: 2px 0;
        }
        .channel-sub {
          font-size: 0.785rem;
          color: var(--text-light);
        }
        .faq-accordion-card {
          margin-top: 24px;
        }
        .faq-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .faq-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-item {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .faq-question-btn {
          width: 100%;
          background: #f8fafc;
          border: none;
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--navy-dark);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .faq-answer-pane {
          padding: 14px 16px;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          background: #ffffff;
          border-top: 1px solid var(--border-light);
        }
        .form-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .form-card-title {
          font-size: 1.25rem;
          color: var(--navy-dark);
        }
        .form-card-sub {
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        .contact-error-box {
          background-color: var(--danger-light);
          border: 1px solid #fecaca;
          color: var(--danger);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .textarea-field {
          resize: vertical;
        }
        .btn-send-message {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
        }
        .simulation-note {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-top: 12px;
          text-align: center;
          font-style: italic;
        }
        .form-success-alert {
          text-align: center;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .form-success-alert h4 {
          font-size: 1.25rem;
          color: var(--navy-dark);
        }
        .form-success-alert p {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 400px;
        }
        @media (max-width: 900px) {
          .contact-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
