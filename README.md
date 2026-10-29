# ✈️ SkyBook - Modern Flight Ticket Booking System

A modern, responsive, and user-friendly Flight Ticket Booking System built with **React.js**, **Vite**, and **CSS3**. The application allows travelers to search for domestic and international flights, compare fares and durations, filter by stops and airlines, enter passenger details, simulate multi-mode payment, generate unique PNRs, and download official PDF E-Tickets.

The user experience is inspired by popular flight booking engines such as *MakeMyTrip*, *Skyscanner*, and *Google Flights*, featuring an aviation blue-and-white theme, clean typography, smooth transitions, and comprehensive localStorage persistence.

---

## 🌟 Key Features

### 1. 🛫 Homepage & Hero Section
- **Aviation Hero Banner:** Eye-catching gradient hero with travel badges and headline: *"Your Journey Begins Here"*.
- **Integrated Flight Search Form:**
  - One-way and Round-trip flight search toggles.
  - Source and destination airport selection with quick **Swap Button**.
  - Departure and return date pickers with past date restrictions.
  - Passenger stepper (1 to 9 passengers) and travel class selection (*Economy, Premium Economy, Business, First Class*).
- **Popular Destinations Showcase:** High-resolution cards for Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Goa, Dubai, London, and Singapore with starting fares and one-click search links.
- **Why Choose SkyBook:** 4 feature cards highlighting rapid booking, airline choices, zero hidden costs, and simple itinerary management.
- **Full Navigation & Footer:** Quick links, popular flight routes, helpline, FAQ links, and legal disclaimers.

### 2. 🔍 Flight Search Results Page
- **Dynamic Search Summary Bar:** Displays current route, date, passengers, and class, with an expandable *"Modify Search"* drawer.
- **Rich Mock Flights Data:** Curated realistic schedules across major carriers:
  - *IndiGo* (6E)
  - *Air India* (AI)
  - *Akasa Air* (QP)
  - *Emirates* (EK)
  - *Qatar Airways* (QR)
  - *British Airways* (BA)
- **Intelligent Fallback Engine:** Dynamically generates realistic schedules for any custom origin-destination pair so the user never gets an empty broken screen.
- **Interactive Multi-Level Filtering:**
  - Max price range slider with dynamic boundaries.
  - Number of stops filter (*Non-stop direct, 1 stop, 2+ stops*).
  - Departure time slots (*Early Morning, Morning, Afternoon, Evening/Night*).
  - Preferred airline checkboxes with flight counts.
  - One-click **Reset All Filters** button.
- **Multi-Criteria Sorting:**
  - Cheapest first
  - Fastest journey (shortest duration)
  - Earliest departure
  - Top rated
- **Flight Card Details:** Airline badge, aircraft type, departure/arrival times, duration visual line, baggage limits, food inclusion, seat availability, and expandable full flight itinerary.

### 3. 📋 Passenger Details & Booking
- **Step Progress Bar:** 4-stage booking stepper (*1. Select Flight ➔ 2. Passenger Details ➔ 3. Payment ➔ 4. Confirmation*).
- **Dynamic Multi-Passenger Form:** Automatically provisions passenger cards based on passenger count (*Full Name, Age, Gender, Assigned Seat*).
- **Primary Contact Details:** Email address and 10-digit mobile number validation.
- **Sticky Booking Summary Card:** Itemized fare breakdown including Base Airfare, Taxes & Airline GST (12%), Airport Development Fees, and Convenience Fee.
- **Mandatory Terms Checkbox:** Ensures travelers review baggage and travel guidelines before proceeding.

### 4. 💳 Simulated Payment Gateway
- **Multi-Method Gateway Interface:**
  - **Credit / Debit Card:** Realistic virtual card preview with mock card number, expiry, and CVV.
  - **UPI / QR Code:** Interactive QR code scan box with GPay, PhonePe, Paytm, and BHIM badges, plus custom VPA input.
  - **Net Banking:** Popular banks (*HDFC, SBI, ICICI, Axis, Kotak, PNB*).
  - **Digital Wallets:** PhonePe, Paytm, and Amazon Pay balances.
- **Simulation Control Bar:**
  - **"Simulate Successful Payment"** button: Triggers realistic loading indicator, saves confirmed booking to localStorage, and generates PNR.
  - **"Test Failed Scenario"** button: Demonstrates payment decline handling with clear retry instructions.
- **Clear Demo Disclaimers:** Zero real financial charges or storage of sensitive payment credentials.

### 5. 🎟️ Booking Confirmation & PDF E-Ticket
- **Celebration Confetti:** Animated burst upon successful ticket issuance.
- **Unique Airline PNR:** Automatically generated 6-character reference (e.g. `SB-849204`).
- **Comprehensive E-Ticket View:** Passenger list, seat allocations, aircraft model, flight timing, and fare paid.
- **Printable PDF Ticket Generation (`jsPDF`):**
  - Generates a styled A4 airline E-Ticket / Boarding Pass.
  - Includes SkyBook logo, PNR badge, itinerary details, passenger table, fare breakdown, and airport travel advisory.
  - Downloads directly to the user's computer as `SkyBook_Ticket_<PNR>.pdf`.

### 6. 📂 My Bookings Page
- **Saved Bookings Retrieval:** Fetches all confirmed and cancelled bookings from browser `localStorage`.
- **Search & Filter:** Search past or upcoming trips by PNR, city name, airline, or passenger name.
- **Three Core Actions:**
  1. **View Ticket:** Modal popup presenting the full digital boarding pass.
  2. **Download Ticket:** Re-download the official PDF E-Ticket anytime.
  3. **Cancel Booking:** Interactive cancellation confirmation dialog updating booking status to *"Cancelled"* with simulated refund processing.
- **Empty State:** Friendly call-to-action leading back to flight search.

### 7. 🔐 Demo Authentication (Login & Sign Up)
- **Login:** Email and password fields with password visibility toggle (*Eye / EyeOff*).
- **Registration:** Full name, email, mobile, password, and confirm password fields.
- **Quick Demo Login:** One-click instant login button for demonstration convenience.
- **Session State in Navbar:** Displays user avatar, greeting, and sign-out button.
- **Security Notice:** Explains frontend prototype scope and production requirements (*bcrypt, JWT, OAuth*).

### 8. 📞 Contact Us & Customer Support
- **Support Channels:** 24/7 toll-free helpline (`1800-SKY-BOOK`), support email, and Aerocity office address.
- **Interactive FAQ Accordion:** Answers common traveler questions about baggage, airport reporting, refunds, and ticket downloads.
- **Contact Message Form:** Validated form with submission feedback explaining frontend demo behavior.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Library** | React 19 (Hooks: `useState`, `useEffect`, `useContext`, `useMemo`) |
| **Build Tool & Dev Server** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |
| **PDF Generation** | jsPDF |
| **Celebration Effects** | Canvas Confetti |
| **Storage** | Browser `localStorage` |
| **Styling** | Custom CSS3 Design System (Responsive Grid & Flexbox, Aviation Theme) |
| **Typography** | Plus Jakarta Sans & Inter (Google Fonts) |

---

## 📁 Project Component Structure

```text
flight-booking-system/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BookingSummary.jsx        # Sticky fare breakdown & flight summary
│   │   ├── FlightCard.jsx            # Flight card with schedule & details
│   │   ├── FlightFilters.jsx         # Price slider, stops, airline filters
│   │   ├── FlightSearchForm.jsx      # Origin, dest, dates, pax, class inputs
│   │   ├── Footer.jsx                # Full brand footer & disclaimers
│   │   ├── Navbar.jsx                # Brand navigation & user session pill
│   │   ├── PassengerForm.jsx         # Dynamic passenger cards & validation
│   │   └── PopularDestinations.jsx   # Top destinations cards with starting fares
│   ├── context/
│   │   └── BookingContext.jsx        # Global search, flight selection, auth state
│   ├── data/
│   │   └── flightData.js             # Realistic flight schedules, airports, airlines
│   ├── pages/
│   │   ├── Home.jsx                  # Hero, search form, popular routes, features
│   │   ├── FlightResults.jsx         # Results list, sorting tabs, filter sidebar
│   │   ├── Booking.jsx               # Stepper, passenger details, booking summary
│   │   ├── Payment.jsx               # Simulated card/UPI/netbanking/wallets
│   │   ├── BookingConfirmation.jsx   # Success banner, PNR, PDF download
│   │   ├── MyBookings.jsx            # Saved bookings, view, download, cancel
│   │   ├── Login.jsx                 # Demo user login & quick demo access
│   │   ├── Register.jsx              # Demo account registration
│   │   └── Contact.jsx               # Support channels, contact form, FAQs
│   ├── utils/
│   │   ├── bookingUtils.js           # PNR generator, fare calculator, formatters
│   │   ├── pdfUtils.js               # jsPDF airline boarding pass generator
│   │   └── storage.js                # LocalStorage management for bookings & auth
│   ├── App.jsx                       # Routes configuration & scroll restoration
│   ├── index.css                     # Global CSS design system & variables
│   └── main.jsx                      # React entrypoint
├── index.html                        # HTML template with Google Fonts
├── package.json                      # Project dependencies & scripts
├── vite.config.js                    # Vite configuration
└── README.md                         # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
1. Clone the repository or navigate to the project root:
   ```bash
   cd flight-booking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

### Building for Production
To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📸 Screenshots & Workflow

### 1. Homepage & Flight Search
> Aviation hero banner with departure/destination airport selectors, date pickers, passenger counter, and popular flight destinations.

### 2. Flight Results & Filtering
> Interactive filter sidebar (price range, stops, airlines, departure slots) and sorting options (cheapest, fastest, earliest departure).

### 3. Passenger Details & Fare Summary
> Multi-passenger cards with real-time validation, seat allocation, and itemized fare breakdown.

### 4. Simulated Multi-Mode Payment
> Simulated Credit Card, UPI / QR Code, Net Banking, and Wallets with options to test both successful and declined payment flows.

### 5. E-Ticket Confirmation & PDF Download
> Confetti celebration, unique PNR code generation, and high-fidelity PDF boarding pass download.

### 6. My Bookings & Cancellation
> Historical and upcoming trips overview with one-click PDF download and simulated booking cancellation.

---

## 🔒 Scope & Security Disclaimer

This project is a **frontend demonstration application**:
- **Flight Data:** Uses realistic mock flight data and simulated route generators. It does not connect to live airline GDS (Global Distribution System) APIs.
- **Payment Processing:** Payment flows are completely simulated for demonstration. No real financial transactions take place, and no real card data is collected or stored.
- **Authentication:** Authentication uses browser `localStorage` for local session prototyping. A production deployment requires a secure backend with HTTPS, password hashing (e.g. Argon2/bcrypt), signed session tokens (JWT), and CSRF protection.
- **Ticket Cancellations:** Ticket cancellation is simulated in local storage and does not impact real airline reservations.

---

## 🐙 Git Version Control Setup & Commits

This project follows structured, meaningful Git commits:

1. `Initialize React project with Vite`
2. `Create responsive homepage and navigation`
3. `Implement flight search and results`
4. `Add booking and passenger forms`
5. `Implement demo payment flow`
6. `Add booking management and PDF ticket`
7. `Improve validation and responsive design`
8. `Update project documentation`

### Uploading to GitHub:
```bash
# Initialize git if not already initialized
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: complete flight ticket booking system with React, Vite, and jsPDF"

# Create a new repository on GitHub and link remote
git branch -M main
git remote add origin https://github.com/<your-username>/flight-booking-system.git

# Push code to GitHub
git push -u origin main
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
