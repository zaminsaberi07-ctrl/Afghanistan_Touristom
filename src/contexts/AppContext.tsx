import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Customer, FlightBooking, Tour, TourBooking, VisaApplication, HotelBooking, Payment, Branch, Currency, Notification, SystemSettings, Language } from '../types';

interface AppState {
  user: User | null;
  language: Language;
  sidebarOpen: boolean;
  customers: Customer[];
  flightBookings: FlightBooking[];
  tours: Tour[];
  tourBookings: TourBooking[];
  visaApplications: VisaApplication[];
  hotelBookings: HotelBooking[];
  payments: Payment[];
  branches: Branch[];
  currencies: Currency[];
  notifications: Notification[];
  settings: SystemSettings;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'SET_FLIGHT_BOOKINGS'; payload: FlightBooking[] }
  | { type: 'ADD_FLIGHT_BOOKING'; payload: FlightBooking }
  | { type: 'UPDATE_FLIGHT_BOOKING'; payload: FlightBooking }
  | { type: 'DELETE_FLIGHT_BOOKING'; payload: string }
  | { type: 'SET_TOURS'; payload: Tour[] }
  | { type: 'ADD_TOUR'; payload: Tour }
  | { type: 'UPDATE_TOUR'; payload: Tour }
  | { type: 'DELETE_TOUR'; payload: string }
  | { type: 'SET_VISA_APPLICATIONS'; payload: VisaApplication[] }
  | { type: 'ADD_VISA_APPLICATION'; payload: VisaApplication }
  | { type: 'UPDATE_VISA_APPLICATION'; payload: VisaApplication }
  | { type: 'DELETE_VISA_APPLICATION'; payload: string }
  | { type: 'SET_HOTEL_BOOKINGS'; payload: HotelBooking[] }
  | { type: 'ADD_HOTEL_BOOKING'; payload: HotelBooking }
  | { type: 'UPDATE_HOTEL_BOOKING'; payload: HotelBooking }
  | { type: 'DELETE_HOTEL_BOOKING'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SystemSettings> }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

const defaultSettings: SystemSettings = {
  companyName: 'آژانس مسافرتی افغانستان',
  defaultLanguage: 'dari',
  baseCurrency: 'AFN',
  defaultCalendar: 'hijri',
  phone: '+93 70 123 4567',
  email: 'info@afghantravel.af',
  address: 'کابل، افغانستان',
};

const defaultCurrencies: Currency[] = [
  { code: 'AFN', name: 'افغانی', symbol: '؋', rate: 1, isBase: true },
  { code: 'USD', name: 'دالر امریکا', symbol: '$', rate: 70.5, isBase: false },
  { code: 'EUR', name: 'یورو', symbol: '€', rate: 76.8, isBase: false },
  { code: 'IRR', name: 'تومان ایران', symbol: '﷼', rate: 1.68, isBase: false },
  { code: 'PKR', name: 'روپیه پاکستان', symbol: '₨', rate: 0.25, isBase: false },
];

const defaultBranches: Branch[] = [
  { id: '1', name: 'شعبه مرکزی کابل', address: 'سرک اول، شهر نو، کابل', phone: '+93 70 111 1111', manager: 'احمد محمدی', isActive: true },
  { id: '2', name: 'شعبه هرات', address: 'جاده ولایت، هرات', phone: '+93 70 222 2222', manager: 'علی رحیمی', isActive: true },
  { id: '3', name: 'شعبه مزار شریف', address: 'سرک اصلی، مزار شریف', phone: '+93 70 333 3333', manager: 'محمد کریمی', isActive: true },
];

const initialState: AppState = {
  user: null,
  language: 'dari',
  sidebarOpen: true,
  customers: [],
  flightBookings: [],
  tours: [],
  tourBookings: [],
  visaApplications: [],
  hotelBookings: [],
  payments: [],
  branches: defaultBranches,
  currencies: defaultCurrencies,
  notifications: [],
  settings: defaultSettings,
  toast: null,
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function getInitialState(): AppState {
  return {
    ...initialState,
    language: loadFromStorage<Language>('app_language', 'dari'),
    customers: loadFromStorage<Customer[]>('app_customers', []),
    flightBookings: loadFromStorage<FlightBooking[]>('app_flights', []),
    tours: loadFromStorage<Tour[]>('app_tours', []),
    tourBookings: loadFromStorage<TourBooking[]>('app_tourBookings', []),
    visaApplications: loadFromStorage<VisaApplication[]>('app_visa', []),
    hotelBookings: loadFromStorage<HotelBooking[]>('app_hotels', []),
    payments: loadFromStorage<Payment[]>('app_payments', []),
    branches: loadFromStorage<Branch[]>('app_branches', defaultBranches),
    currencies: loadFromStorage<Currency[]>('app_currencies', defaultCurrencies),
    notifications: loadFromStorage<Notification[]>('app_notifications', []),
    settings: loadFromStorage<SystemSettings>('app_settings', defaultSettings),
    user: loadFromStorage<User | null>('app_user', null),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('app_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'SET_LANGUAGE':
      localStorage.setItem('app_language', action.payload);
      return { ...state, language: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_CUSTOMERS':
      localStorage.setItem('app_customers', JSON.stringify(action.payload));
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      const newCustomers = [...state.customers, action.payload];
      localStorage.setItem('app_customers', JSON.stringify(newCustomers));
      return { ...state, customers: newCustomers };
    case 'UPDATE_CUSTOMER':
      const updatedCustomers = state.customers.map(c => c.id === action.payload.id ? action.payload : c);
      localStorage.setItem('app_customers', JSON.stringify(updatedCustomers));
      return { ...state, customers: updatedCustomers };
    case 'DELETE_CUSTOMER':
      const filteredCustomers = state.customers.filter(c => c.id !== action.payload);
      localStorage.setItem('app_customers', JSON.stringify(filteredCustomers));
      return { ...state, customers: filteredCustomers };
    case 'SET_FLIGHT_BOOKINGS':
      localStorage.setItem('app_flights', JSON.stringify(action.payload));
      return { ...state, flightBookings: action.payload };
    case 'ADD_FLIGHT_BOOKING':
      const newFlights = [...state.flightBookings, action.payload];
      localStorage.setItem('app_flights', JSON.stringify(newFlights));
      return { ...state, flightBookings: newFlights };
    case 'UPDATE_FLIGHT_BOOKING':
      const updatedFlights = state.flightBookings.map(f => f.id === action.payload.id ? action.payload : f);
      localStorage.setItem('app_flights', JSON.stringify(updatedFlights));
      return { ...state, flightBookings: updatedFlights };
    case 'DELETE_FLIGHT_BOOKING':
      const filteredFlights = state.flightBookings.filter(f => f.id !== action.payload);
      localStorage.setItem('app_flights', JSON.stringify(filteredFlights));
      return { ...state, flightBookings: filteredFlights };
    case 'SET_TOURS':
      localStorage.setItem('app_tours', JSON.stringify(action.payload));
      return { ...state, tours: action.payload };
    case 'ADD_TOUR':
      const newTours = [...state.tours, action.payload];
      localStorage.setItem('app_tours', JSON.stringify(newTours));
      return { ...state, tours: newTours };
    case 'UPDATE_TOUR':
      const updatedTours = state.tours.map(t => t.id === action.payload.id ? action.payload : t);
      localStorage.setItem('app_tours', JSON.stringify(updatedTours));
      return { ...state, tours: updatedTours };
    case 'DELETE_TOUR':
      const filteredTours = state.tours.filter(t => t.id !== action.payload);
      localStorage.setItem('app_tours', JSON.stringify(filteredTours));
      return { ...state, tours: filteredTours };
    case 'SET_VISA_APPLICATIONS':
      localStorage.setItem('app_visa', JSON.stringify(action.payload));
      return { ...state, visaApplications: action.payload };
    case 'ADD_VISA_APPLICATION':
      const newVisa = [...state.visaApplications, action.payload];
      localStorage.setItem('app_visa', JSON.stringify(newVisa));
      return { ...state, visaApplications: newVisa };
    case 'UPDATE_VISA_APPLICATION':
      const updatedVisa = state.visaApplications.map(v => v.id === action.payload.id ? action.payload : v);
      localStorage.setItem('app_visa', JSON.stringify(updatedVisa));
      return { ...state, visaApplications: updatedVisa };
    case 'DELETE_VISA_APPLICATION':
      const filteredVisa = state.visaApplications.filter(v => v.id !== action.payload);
      localStorage.setItem('app_visa', JSON.stringify(filteredVisa));
      return { ...state, visaApplications: filteredVisa };
    case 'SET_HOTEL_BOOKINGS':
      localStorage.setItem('app_hotels', JSON.stringify(action.payload));
      return { ...state, hotelBookings: action.payload };
    case 'ADD_HOTEL_BOOKING':
      const newHotels = [...state.hotelBookings, action.payload];
      localStorage.setItem('app_hotels', JSON.stringify(newHotels));
      return { ...state, hotelBookings: newHotels };
    case 'UPDATE_HOTEL_BOOKING':
      const updatedHotels = state.hotelBookings.map(h => h.id === action.payload.id ? action.payload : h);
      localStorage.setItem('app_hotels', JSON.stringify(updatedHotels));
      return { ...state, hotelBookings: updatedHotels };
    case 'DELETE_HOTEL_BOOKING':
      const filteredHotels = state.hotelBookings.filter(h => h.id !== action.payload);
      localStorage.setItem('app_hotels', JSON.stringify(filteredHotels));
      return { ...state, hotelBookings: filteredHotels };
    case 'SET_PAYMENTS':
      localStorage.setItem('app_payments', JSON.stringify(action.payload));
      return { ...state, payments: action.payload };
    case 'ADD_PAYMENT':
      const newPayments = [...state.payments, action.payload];
      localStorage.setItem('app_payments', JSON.stringify(newPayments));
      return { ...state, payments: newPayments };
    case 'SET_NOTIFICATIONS':
      localStorage.setItem('app_notifications', JSON.stringify(action.payload));
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotifs = [action.payload, ...state.notifications];
      localStorage.setItem('app_notifications', JSON.stringify(newNotifs));
      return { ...state, notifications: newNotifs };
    case 'MARK_NOTIFICATION_READ':
      const readNotifs = state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n);
      localStorage.setItem('app_notifications', JSON.stringify(readNotifs));
      return { ...state, notifications: readNotifs };
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('app_settings', JSON.stringify(newSettings));
      return { ...state, settings: newSettings };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  useEffect(() => {
    document.documentElement.dir = state.language === 'english' ? 'ltr' : 'rtl';
    document.documentElement.lang = state.language === 'dari' ? 'fa' : state.language === 'pashto' ? 'ps' : 'en';
  }, [state.language]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
