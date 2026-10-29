// Central React Context for SkyBook flight search, booking flow, and authentication
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFutureDate, generatePNR, generateSeatNumbers, calculateFare } from '../utils/bookingUtils';
import {
  saveBooking,
  getBookings,
  cancelBooking as cancelBookingInStorage,
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  loginUser as authLogin,
  registerUser as authRegister,
  getLastSearch,
  saveLastSearch
} from '../utils/storage';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // 1. Flight Search State
  const initialSearch = getLastSearch() || {
    from: 'Delhi',
    to: 'Mumbai',
    departureDate: getFutureDate(3),
    returnDate: getFutureDate(7),
    tripType: 'oneWay',
    passengers: 1,
    travelClass: 'economy'
  };

  const [searchParams, setSearchParams] = useState(initialSearch);

  // 2. Selected Flight(s) for booking
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

  // 3. Passenger Information
  const [passengersData, setPassengersData] = useState([
    { fullName: '', age: '', gender: 'Male', seat: '14A' }
  ]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    mobile: ''
  });

  // 4. Most Recent Confirmed Booking
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  // 5. User Authentication State
  const [currentUser, setCurrentUserState] = useState(null);

  // Synchronize initial user and saved search on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      setContactInfo((prev) => ({
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile
      }));
      setPassengersData((prev) => {
        if (prev.length > 0 && !prev[0].fullName && user.fullName) {
          const updated = [...prev];
          updated[0].fullName = user.fullName;
          return updated;
        }
        return prev;
      });
    }
  }, []);

  // Update search parameters
  const updateSearchParams = (newParams) => {
    const updated = { ...searchParams, ...newParams };
    setSearchParams(updated);
    saveLastSearch(updated);

    // If passenger count changed, adjust the passenger form slots
    const newCount = parseInt(updated.passengers, 10) || 1;
    setPassengersData((prev) => {
      const generatedSeats = generateSeatNumbers(newCount, updated.travelClass);
      const list = [];
      for (let i = 0; i < newCount; i++) {
        list.push({
          fullName: prev[i]?.fullName || (i === 0 && currentUser?.fullName ? currentUser.fullName : ''),
          age: prev[i]?.age || '',
          gender: prev[i]?.gender || 'Male',
          seat: generatedSeats[i] || `${14 + i}A`
        });
      }
      return list;
    });
  };

  // Select flight to book
  const chooseFlight = (flight) => {
    setSelectedFlight(flight);
  };

  // Complete booking and persist to localStorage
  const finalizeBooking = ({ paymentMethod, status = 'Confirmed', transactionId }) => {
    if (!selectedFlight) return null;

    const pnr = generatePNR();
    const fare = calculateFare({
      basePrice: selectedFlight.basePrice,
      passengers: searchParams.passengers,
      travelClass: searchParams.travelClass
    });

    const bookingRecord = {
      pnr,
      bookingDate: new Date().toISOString(),
      status,
      flight: selectedFlight,
      travelDate: searchParams.departureDate,
      tripType: searchParams.tripType,
      travelClass: searchParams.travelClass,
      travelClassName: fare.travelClassName,
      passengers: passengersData,
      contactInfo,
      fare,
      payment: {
        method: paymentMethod,
        transactionId: transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'Success',
        paidAt: new Date().toISOString()
      }
    };

    saveBooking(bookingRecord);
    setLastConfirmedBooking(bookingRecord);
    return bookingRecord;
  };

  // Cancel booking in storage
  const handleCancelBooking = (pnr) => {
    return cancelBookingInStorage(pnr);
  };

  // Demo Authentication actions
  const handleLogin = (credentials) => {
    const res = authLogin(credentials);
    if (res.success) {
      setCurrentUserState(res.user);
      setContactInfo((prev) => ({
        email: res.user.email,
        mobile: res.user.mobile
      }));
    }
    return res;
  };

  const handleRegister = (userData) => {
    const res = authRegister(userData);
    if (res.success) {
      setCurrentUserState(res.user);
      setContactInfo((prev) => ({
        email: res.user.email,
        mobile: res.user.mobile
      }));
    }
    return res;
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
  };

  // Reset booking state for fresh search
  const resetBookingFlow = () => {
    setSelectedFlight(null);
    setSelectedReturnFlight(null);
    setLastConfirmedBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        selectedFlight,
        chooseFlight,
        selectedReturnFlight,
        setSelectedReturnFlight,
        passengersData,
        setPassengersData,
        contactInfo,
        setContactInfo,
        lastConfirmedBooking,
        setLastConfirmedBooking,
        finalizeBooking,
        handleCancelBooking,
        currentUser,
        handleLogin,
        handleRegister,
        handleLogout,
        resetBookingFlow
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
