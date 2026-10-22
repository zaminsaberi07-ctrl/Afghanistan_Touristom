import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/Customers';
import TicketsPage from './pages/Tickets';
import ToursPage from './pages/Tours';
import VisaPage from './pages/Visa';
import HotelsPage from './pages/Hotels';
import AccountingPage from './pages/Accounting';
import SettingsPage from './pages/Settings';

function AppContent() {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Not logged in - show login page
  if (!state.user) {
    return <LoginPage />;
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'customers': return <CustomersPage />;
      case 'tickets': return <TicketsPage />;
      case 'tours': return <ToursPage />;
      case 'visa': return <VisaPage />;
      case 'hotels': return <HotelsPage />;
      case 'transport': return <TransportPlaceholder />;
      case 'accounting': return <AccountingPage />;
      case 'reports': return <ReportsPlaceholder />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

// Placeholder pages for Transport and Reports
function TransportPlaceholder() {
  const { state } = useApp();
  const lang = state.language;
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ترانسپورت</h1>
      <p className="text-gray-500 mb-6">مدیریت وسایط نقلیه و سفرهای زمینی</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">وسایط نقلیه</h3>
          <p className="text-sm text-gray-500 mt-1">مدیریت موترها و ظرفیت</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">مسیرها</h3>
          <p className="text-sm text-gray-500 mt-1">مسیرهای شهری و بین‌شهری</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">رانندگان</h3>
          <p className="text-sm text-gray-500 mt-1">مدیریت رانندگان و قراردادها</p>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">مسیرهای فعال</h3>
        <div className="space-y-3">
          {[
            { from: 'کابل', to: 'هرات', distance: '850 کم', duration: '۱۲ ساعت', price: '3,500 ؋' },
            { from: 'کابل', to: 'مزار شریف', distance: '320 کم', duration: '۵ ساعت', price: '1,500 ؋' },
            { from: 'کابل', to: 'جلال‌آباد', distance: '150 کم', duration: '۲.۵ ساعت', price: '800 ؋' },
            { from: 'کابل', to: 'بامیان', distance: '250 کم', duration: '۴ ساعت', price: '1,200 ؋' },
            { from: 'کابل', to: 'کندهار', distance: '480 کم', duration: '۷ ساعت', price: '2,500 ؋' },
          ].map((route, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">{idx + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{route.from} ← → {route.to}</p>
                  <p className="text-xs text-gray-500">{route.distance} | {route.duration}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-800">{route.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPlaceholder() {
  const { state } = useApp();
  const lang = state.language;
  
  const totalFlightSales = state.flightBookings.reduce((s, b) => s + b.sellPrice, 0);
  const totalFlightProfit = state.flightBookings.reduce((s, b) => s + (b.sellPrice - b.buyPrice), 0);
  const totalHotelSales = state.hotelBookings.reduce((s, b) => s + b.sellPrice, 0);
  const totalHotelProfit = state.hotelBookings.reduce((s, b) => s + (b.sellPrice - b.buyPrice), 0);
  const totalVisaFees = state.visaApplications.reduce((s, v) => s + v.serviceFee, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">گزارش‌ها</h1>
        <p className="text-sm text-gray-500 mt-1">گزارش‌های مدیریتی و عملیاتی</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">فروش بلیت</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{totalFlightSales.toLocaleString()} ؋</p>
          <p className="text-xs text-green-600 mt-1">سود: {totalFlightProfit.toLocaleString()} ؋</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">فروش هتل</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{totalHotelSales.toLocaleString()} ؋</p>
          <p className="text-xs text-green-600 mt-1">سود: {totalHotelProfit.toLocaleString()} ؋</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">خدمات ویزا</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{totalVisaFees.toLocaleString()} ؋</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">تعداد مشتریان</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{state.customers.length}</p>
        </div>
      </div>

      {/* Reports list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">گزارش‌های مالی</h3>
          <div className="space-y-2">
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>گزارش سود و زیان</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>ترازنامه</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>گردش حساب‌ها</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>گزارش دریافت و پرداخت</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">گزارش‌های عملیاتی</h3>
          <div className="space-y-2">
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>فروش به تفکیک خدمت</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>عملکرد کارمندان</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>گزارش شعبه‌ها</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
            <button className="w-full text-start p-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between transition-colors">
              <span>فهرست مشتریان</span>
              <span className="text-xs text-gray-400">PDF / Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
