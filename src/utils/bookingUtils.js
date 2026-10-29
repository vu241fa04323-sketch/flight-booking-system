// Utility functions for SkyBook booking calculations and formatting
import { TRAVEL_CLASSES } from '../data/flightData';

/**
 * Generate a realistic airline PNR (e.g. SB-849204 or SK7B9M)
 */
export function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SB-${randomStr}`;
}

/**
 * Generate realistic random seat numbers (e.g., 14A, 14B)
 */
export function generateSeatNumbers(count, travelClass = 'economy') {
  const seats = [];
  const rowStart = travelClass === 'business' || travelClass === 'firstClass' ? 2 : 12;
  const colLetters = travelClass === 'business' ? ['A', 'C', 'D', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  const row = Math.floor(rowStart + Math.random() * 15);
  for (let i = 0; i < count; i++) {
    const col = colLetters[i % colLetters.length];
    seats.push(`${row + Math.floor(i / colLetters.length)}${col}`);
  }
  return seats;
}

/**
 * Calculate fare breakdown
 */
export function calculateFare({ basePrice = 3500, passengers = 1, travelClass = 'economy', promoDiscount = 0 }) {
  const classObj = TRAVEL_CLASSES.find((c) => c.id === travelClass) || TRAVEL_CLASSES[0];
  const multiplier = classObj.multiplier || 1.0;

  const perPaxBaseFare = Math.round(basePrice * multiplier);
  const totalBaseFare = perPaxBaseFare * passengers;

  // Taxes and surcharges (approx 12% GST and airline fuel charges)
  const taxesAndSurcharges = Math.round(totalBaseFare * 0.12);

  // Aviation security & airport fee (flat ₹380 per pax)
  const airportFees = 380 * passengers;

  // Modest convenience fee
  const convenienceFee = 249;

  // Subtotal
  const grossTotal = totalBaseFare + taxesAndSurcharges + airportFees + convenienceFee;

  // Final total after promo code discount
  const finalPayable = Math.max(0, grossTotal - promoDiscount);

  return {
    perPaxBaseFare,
    totalBaseFare,
    taxesAndSurcharges,
    airportFees,
    convenienceFee,
    promoDiscount,
    finalPayable,
    travelClassName: classObj.name,
    baggageAllowance: classObj.baggage
  };
}

/**
 * Format Indian Rupee currency (e.g. ₹4,299)
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format date string (YYYY-MM-DD) into readable format: "Sat, 14 Nov 2026"
 */
export function formatDateReadable(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format today's or tomorrow's date for default date pickers (YYYY-MM-DD)
 */
export function getFutureDate(daysAhead = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
