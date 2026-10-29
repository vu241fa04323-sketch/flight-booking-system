// Generate high quality airline E-Ticket PDF using jsPDF
import { jsPDF } from 'jspdf';
import { formatDateReadable, formatCurrency } from './bookingUtils';

export function generateTicketPDF(booking) {
  if (!booking) {
    console.error('No booking data provided for PDF generation');
    return false;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = [15, 76, 129]; // #0f4c81
  const secondaryColor = [2, 132, 199]; // #0284c7
  const darkTextColor = [30, 41, 59]; // #1e293b
  const lightTextColor = [100, 116, 139]; // #64748b
  const borderColor = [226, 232, 240]; // #e2e8f0

  // 1. Top Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // SkyBook Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('SkyBook', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 225, 255);
  doc.text('ELECTRONIC TICKET / BOARDING PASS', 60, 17);

  // Status Badge on top right
  const isCancelled = booking.status === 'Cancelled';
  if (isCancelled) {
    doc.setFillColor(239, 68, 68); // Red
  } else {
    doc.setFillColor(16, 185, 129); // Green
  }
  doc.roundedRect(pageWidth - 45, 9, 32, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(isCancelled ? 'CANCELLED' : 'CONFIRMED', pageWidth - 29, 15.5, { align: 'center' });

  // 2. Booking Reference Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(15, 34, pageWidth - 30, 22, 3, 3, 'FD');

  // PNR Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text('BOOKING REFERENCE (PNR)', 22, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(booking.pnr || 'SB-DEMO', 22, 51);

  // Flight Number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text('FLIGHT NO.', 85, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.flight?.flightNumber || 'SB-101', 85, 51);

  // Travel Class
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text('CABIN CLASS', 135, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.travelClassName || 'Economy', 135, 51);

  // Date of Issue
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text('DATE OF TRAVEL', 175, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  doc.text(formatDateReadable(booking.travelDate) || 'Upcoming', 175, 50);

  // 3. Flight Itinerary Section
  let currentY = 64;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('FLIGHT ITINERARY', 15, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(15, currentY, pageWidth - 30, 48, 3, 3, 'FD');

  // Airline & Aircraft Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...secondaryColor);
  doc.text(`${booking.flight?.airline} (${booking.flight?.airlineCode})`, 22, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text(`Aircraft: ${booking.flight?.aircraft || 'Airbus A320neo'}  |  ${booking.flight?.stopDetails || 'Non-stop'}`, 22, currentY + 16);

  // Departure Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.flight?.departureTime || '00:00', 22, currentY + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(booking.flight?.fromCode || 'DEP', 22, currentY + 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.flight?.fromCity || '', 22, currentY + 40);
  doc.setFontSize(8);
  doc.setTextColor(...lightTextColor);
  doc.text(booking.flight?.fromAirport || '', 22, currentY + 44);

  // Flight Route Line
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.8);
  doc.line(80, currentY + 28, 125, currentY + 28);
  doc.circle(80, currentY + 28, 1.2, 'FD');
  doc.circle(125, currentY + 28, 1.2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...lightTextColor);
  doc.text(`Duration: ${booking.flight?.duration || '2h 15m'}`, 102.5, currentY + 25, { align: 'center' });
  doc.text(booking.flight?.stops === 0 ? 'Direct Non-stop' : '1 Stop', 102.5, currentY + 34, { align: 'center' });

  // Arrival Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.flight?.arrivalTime || '00:00', 140, currentY + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(booking.flight?.toCode || 'ARR', 140, currentY + 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(booking.flight?.toCity || '', 140, currentY + 40);
  doc.setFontSize(8);
  doc.setTextColor(...lightTextColor);
  doc.text(booking.flight?.toAirport || '', 140, currentY + 44);

  // 4. Passenger Details Section
  currentY += 58;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('PASSENGER & SEAT DETAILS', 15, currentY);

  currentY += 4;
  // Passenger Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('#', 20, currentY + 5.5);
  doc.text('PASSENGER NAME', 32, currentY + 5.5);
  doc.text('AGE / GENDER', 100, currentY + 5.5);
  doc.text('SEAT', 142, currentY + 5.5);
  doc.text('STATUS', 170, currentY + 5.5);

  currentY += 8;
  const passengers = booking.passengers || [];
  passengers.forEach((p, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(15, currentY, pageWidth - 30, 9, 'F');
    doc.setDrawColor(...borderColor);
    doc.line(15, currentY + 9, pageWidth - 15, currentY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkTextColor);
    doc.text(String(idx + 1), 20, currentY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(p.fullName || 'Passenger', 32, currentY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`${p.age || '-'} yrs / ${p.gender || '-'}`, 100, currentY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text(p.seat || `${12 + idx}A`, 142, currentY + 6);
    doc.setTextColor(...darkTextColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Confirmed', 170, currentY + 6);

    currentY += 9;
  });

  // 5. Payment & Fare Summary Box
  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('PAYMENT & FARE BREAKDOWN', 15, currentY);

  currentY += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(15, currentY, pageWidth - 30, 36, 3, 3, 'FD');

  const fare = booking.fare || {};
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text('Base Airfare:', 22, currentY + 9);
  doc.text(formatCurrency(fare.totalBaseFare || 0), 75, currentY + 9, { align: 'right' });

  doc.text('Taxes & Airline GST (12%):', 22, currentY + 16);
  doc.text(formatCurrency(fare.taxesAndSurcharges || 0), 75, currentY + 16, { align: 'right' });

  doc.text('Airport & User Development Fees:', 22, currentY + 23);
  doc.text(formatCurrency(fare.airportFees || 0), 75, currentY + 23, { align: 'right' });

  doc.text('Convenience & Platform Fee:', 22, currentY + 30);
  doc.text(formatCurrency(fare.convenienceFee || 249), 75, currentY + 30, { align: 'right' });

  // Divider
  doc.line(88, currentY + 5, 88, currentY + 32);

  // Total Paid on right side
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.text('TOTAL AMOUNT PAID', 96, currentY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(formatCurrency(fare.finalPayable || 0), 96, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkTextColor);
  doc.text(`Payment Mode: ${booking.payment?.method || 'Online'} (Simulated)`, 96, currentY + 27);
  doc.text(`Transaction ID: ${booking.payment?.transactionId || 'TXN-DEMO'}`, 96, currentY + 32);

  // 6. Important Travel Notice / Guidelines
  currentY += 44;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(15, currentY, pageWidth - 30, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  doc.text('IMPORTANT TRAVEL ADVISORY & BAGGAGE GUIDELINES', 22, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkTextColor);
  doc.text('1. Airport Check-in: Please reach at least 2 hours before departure for domestic, and 3 hours for international flights.', 22, currentY + 12);
  doc.text('2. Mandatory ID: A valid Government photo ID (Passport / Aadhaar / Driving License) is mandatory for airport entry.', 22, currentY + 17);
  doc.text('3. Baggage Limits: Standard Cabin Baggage is 7 kg per guest. Check-in luggage allowances apply per ticket category.', 22, currentY + 22);
  doc.text('4. Simulated Booking Notice: This ticket is generated for demonstration purposes by SkyBook Flight Booking System.', 22, currentY + 27);

  // 7. Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...lightTextColor);
  doc.text('SkyBook Aviation Services | 24/7 Helpline: +91 1800-SKY-BOOK | Email: support@skybook.com', pageWidth / 2, 288, { align: 'center' });

  // Save the PDF
  const filename = `SkyBook_Ticket_${booking.pnr || 'Demo'}.pdf`;
  doc.save(filename);
  return true;
}
