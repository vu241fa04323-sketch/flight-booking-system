// LocalStorage management for SkyBook (Bookings, Demo Auth, Sessions)
import { getFutureDate } from './bookingUtils';

const STORAGE_KEYS = {
  BOOKINGS: 'skybook_demo_bookings',
  USERS: 'skybook_demo_users',
  CURRENT_USER: 'skybook_demo_current_user',
  LAST_SEARCH: 'skybook_last_search'
};

// Seed realistic demo bookings if storage is empty
const SEED_BOOKINGS = [
  {
    pnr: 'SB-883491',
    bookingDate: '2026-10-25T14:30:00Z',
    status: 'Confirmed',
    flight: {
      id: 'FL-DEL-BOM-01',
      flightNumber: '6E-2041',
      airline: 'IndiGo',
      airlineCode: '6E',
      fromCode: 'DEL',
      fromCity: 'Delhi',
      fromAirport: 'Indira Gandhi Int Airport (T3)',
      toCode: 'BOM',
      toCity: 'Mumbai',
      toAirport: 'Chhatrapati Shivaji Maharaj Int Airport (T2)',
      departureTime: '06:15',
      arrivalTime: '08:30',
      duration: '2h 15m',
      stops: 0,
      stopDetails: 'Non-stop',
      aircraft: 'Airbus A320neo'
    },
    travelDate: getFutureDate(5),
    travelClass: 'economy',
    travelClassName: 'Economy',
    passengers: [
      {
        fullName: 'Rahul Sharma',
        age: '29',
        gender: 'Male',
        seat: '14A'
      }
    ],
    contactInfo: {
      email: 'rahul.sharma@example.com',
      mobile: '9876543210'
    },
    fare: {
      perPaxBaseFare: 4299,
      totalBaseFare: 4299,
      taxesAndSurcharges: 516,
      airportFees: 380,
      convenienceFee: 249,
      promoDiscount: 0,
      finalPayable: 5444
    },
    payment: {
      method: 'UPI',
      transactionId: 'TXN-98428194',
      status: 'Success',
      paidAt: '2026-10-25T14:32:10Z'
    }
  }
];

/**
 * Retrieve all saved bookings from localStorage
 */
export function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading bookings from localStorage:', err);
    return SEED_BOOKINGS;
  }
}

/**
 * Save a new confirmed booking to localStorage
 */
export function saveBooking(booking) {
  try {
    const current = getBookings();
    const updated = [booking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return booking;
  } catch (err) {
    console.error('Error saving booking to localStorage:', err);
    return null;
  }
}

/**
 * Find a specific booking by PNR
 */
export function getBookingByPNR(pnr) {
  const bookings = getBookings();
  return bookings.find((b) => b.pnr.toUpperCase() === pnr.toUpperCase()) || null;
}

/**
 * Cancel a booking (Simulated frontend cancellation)
 */
export function cancelBooking(pnr) {
  try {
    const current = getBookings();
    const updated = current.map((b) => {
      if (b.pnr.toUpperCase() === pnr.toUpperCase()) {
        return {
          ...b,
          status: 'Cancelled',
          cancelledAt: new Date().toISOString(),
          refundStatus: 'Simulated Refund Initiated (3-5 Days)'
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return false;
  }
}

/**
 * Delete a booking completely from storage (optional management action)
 */
export function deleteBooking(pnr) {
  try {
    const current = getBookings();
    const updated = current.filter((b) => b.pnr.toUpperCase() !== pnr.toUpperCase());
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Error deleting booking:', err);
    return false;
  }
}

// ---------------- Demo User Authentication Management ----------------

// Default demo user account
const DEFAULT_DEMO_USER = {
  fullName: 'Arjun Mehta',
  email: 'arjun@skybook.com',
  mobile: '9898989898',
  password: 'Password123'
};

export function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

export function registerUser({ fullName, email, mobile, password }) {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const newUser = { fullName, email, mobile, password };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // Auto login upon registration
  setCurrentUser({ fullName, email, mobile });
  return { success: true, user: { fullName, email, mobile } };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) {
    return { success: false, message: 'Invalid email or password. Please check your credentials.' };
  }
  const sessionUser = { fullName: found.fullName, email: found.email, mobile: found.mobile };
  setCurrentUser(sessionUser);
  return { success: true, user: sessionUser };
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Error setting current user:', err);
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Error during logout:', err);
  }
}

// Search state persistence
export function saveLastSearch(searchData) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, JSON.stringify(searchData));
  } catch (err) {
    console.error('Error saving last search:', err);
  }
}

export function getLastSearch() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_SEARCH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
