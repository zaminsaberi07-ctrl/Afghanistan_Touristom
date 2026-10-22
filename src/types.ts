export type Language = 'dari' | 'pashto' | 'english';
export type Direction = 'rtl' | 'ltr';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branchId: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  passportNo?: string;
  passportExpiry?: string;
  dateOfBirth?: string;
  type: 'individual' | 'company';
  notes?: string;
  createdAt: string;
}

export interface FlightBooking {
  id: string;
  bookingNo: string;
  customerId: string;
  customerName: string;
  airline: string;
  flightNo: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  buyPrice: number;
  sellPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'issued' | 'cancelled' | 'refunded';
  createdAt: string;
  createdBy: string;
}

export interface Tour {
  id: string;
  name: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  days: number;
  capacity: number;
  bookedCount: number;
  adultPrice: number;
  childPrice: number;
  costPrice: number;
  currency: string;
  status: 'draft' | 'active' | 'full' | 'completed' | 'cancelled';
  guide?: string;
  type: 'domestic' | 'international';
}

export interface TourBooking {
  id: string;
  tourId: string;
  tourName: string;
  customerId: string;
  customerName: string;
  passengers: number;
  adults: number;
  children: number;
  totalPrice: number;
  paidAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
}

export interface VisaApplication {
  id: string;
  fileNo: string;
  customerId: string;
  customerName: string;
  country: string;
  visaType: string;
  status: 'draft' | 'pending_docs' | 'ready' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  embassyDate?: string;
  serviceFee: number;
  currency: string;
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export interface HotelBooking {
  id: string;
  bookingNo: string;
  customerId: string;
  customerName: string;
  hotelName: string;
  city: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  buyPrice: number;
  sellPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  confirmationNo?: string;
}

export interface JournalEntry {
  id: string;
  entryNo: string;
  date: string;
  description: string;
  lines: JournalLine[];
  createdBy: string;
  status: 'draft' | 'posted' | 'voided';
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: string;
}

export interface Payment {
  id: string;
  receiptNo: string;
  customerId?: string;
  customerName?: string;
  type: 'receipt' | 'payment';
  amount: number;
  currency: string;
  method: 'cash' | 'bank' | 'check' | 'transfer';
  referenceNo?: string;
  description: string;
  date: string;
  createdBy: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  isActive: boolean;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isBase: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  defaultLanguage: Language;
  baseCurrency: string;
  defaultCalendar: 'hijri' | 'gregorian';
  phone: string;
  email: string;
  address: string;
}
