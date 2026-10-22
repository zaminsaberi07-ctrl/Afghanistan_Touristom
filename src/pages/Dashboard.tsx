import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { TrendingUp, TrendingDown, Users, Plane, Map, FileText, DollarSign, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

export default function Dashboard() {
  const { state } = useApp();
  const lang = state.language;

  // Calculate stats from real data
  const totalSales = state.flightBookings.reduce((sum, b) => sum + b.sellPrice, 0) +
    state.tourBookings.reduce((sum, b) => sum + b.totalPrice, 0) +
    state.hotelBookings.reduce((sum, b) => sum + b.sellPrice, 0);

  const totalProfit = state.flightBookings.reduce((sum, b) => sum + (b.sellPrice - b.buyPrice), 0) +
    state.tourBookings.reduce((sum, b) => sum + (b.totalPrice - (state.tours.find(tour => tour.id === b.tourId)?.costPrice || 0) * b.passengers), 0) +
    state.hotelBookings.reduce((sum, b) => sum + (b.sellPrice - b.buyPrice), 0);

  const activeBookings = state.flightBookings.filter(b => b.status === 'confirmed' || b.status === 'issued').length +
    state.tourBookings.filter(b => b.status === 'confirmed').length +
    state.hotelBookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length;

  const totalPayments = state.payments.filter(p => p.type === 'receipt').reduce((sum, p) => sum + p.amount, 0);

  // Chart data
  const monthlySalesData = [
    { name: 'حمل', sales: 450000, profit: 85000 },
    { name: 'ثور', sales: 520000, profit: 98000 },
    { name: 'جوزا', sales: 380000, profit: 72000 },
    { name: 'سرطان', sales: 610000, profit: 115000 },
    { name: 'اسد', sales: 550000, profit: 102000 },
    { name: 'سنبله', sales: 720000, profit: 138000 },
  ];

  const serviceDistribution = [
    { name: t('tickets', lang), value: state.flightBookings.length || 35, color: '#3b82f6' },
    { name: t('tours', lang), value: state.tourBookings.length || 25, color: '#10b981' },
    { name: t('visa', lang), value: state.visaApplications.length || 20, color: '#f59e0b' },
    { name: t('hotels', lang), value: state.hotelBookings.length || 20, color: '#8b5cf6' },
  ];

  const weeklyData = [
    { day: 'شنبه', value: 120000 },
    { day: 'یکشنبه', value: 180000 },
    { day: 'دوشنبه', value: 250000 },
    { day: 'سه‌شنبه', value: 190000 },
    { day: 'چهارشنبه', value: 310000 },
    { day: 'پنجشنبه', value: 280000 },
    { day: 'جمعه', value: 150000 },
  ];

  const stats = [
    { 
      title: t('totalSales', lang), 
      value: totalSales > 0 ? `${(totalSales / 1000).toFixed(0)}K` : '۲.۴M',
      unit: '؋',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: t('totalProfit', lang), 
      value: totalProfit > 0 ? `${(totalProfit / 1000).toFixed(0)}K` : '۴۸۰K',
      unit: '؋',
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    { 
      title: t('activeBookings', lang), 
      value: activeBookings > 0 ? activeBookings.toString() : '۲۴',
      unit: '',
      change: '+3',
      isPositive: true,
      icon: Plane,
      gradient: 'from-violet-500 to-violet-600'
    },
    { 
      title: t('customers', lang), 
      value: state.customers.length > 0 ? state.customers.length.toString() : '۱۵۶',
      unit: '',
      change: '+12',
      isPositive: true,
      icon: Users,
      gradient: 'from-amber-500 to-amber-600'
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('welcome', lang)}، {state.user?.fullName}</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString(lang === 'english' ? 'en-US' : 'fa-AF', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-gray-500 ms-1">{stat.unit}</span>}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className={`flex items-center gap-1 mt-3 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{stat.change}</span>
              <span className="text-gray-400 ms-1">{t('thisMonth', lang)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">{t('salesReport', lang)}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">۶ ماه اخیر</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#salesGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">توزیع خدمات</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {serviceDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly performance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">عملکرد هفتگی</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">{t('recentActivities', lang)}</h3>
          <div className="space-y-3">
            {state.flightBookings.length > 0 ? (
              state.flightBookings.slice(-5).reverse().map(booking => (
                <div key={booking.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{booking.customerName}</p>
                    <p className="text-xs text-gray-500">{booking.origin} → {booking.destination}</p>
                  </div>
                  <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : booking.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                    {t(booking.status, lang)}
                  </span>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                {[
                  { icon: Plane, text: 'رزرو بلیت کابل - دبی', status: 'confirmed', color: 'blue' },
                  { icon: Map, text: 'تور بامیان - ۵ نفر', status: 'pending', color: 'green' },
                  { icon: FileText, text: 'درخواست ویزای ترکیه', status: 'under_review', color: 'amber' },
                  { icon: Building2, text: 'رزرو هتل هرات', status: 'confirmed', color: 'violet' },
                  { icon: Users, text: 'ثبت مشتری جدید', status: 'completed', color: 'gray' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-9 h-9 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-500">۵ دقیقه پیش</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <Plane className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{state.flightBookings.length || '۱۲'}</p>
          <p className="text-sm opacity-80">{t('tickets', lang)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
          <Map className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{state.tours.length || '۸'}</p>
          <p className="text-sm opacity-80">{t('tours', lang)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
          <FileText className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{state.visaApplications.length || '۱۵'}</p>
          <p className="text-sm opacity-80">{t('visa', lang)}</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-4 text-white">
          <Building2 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{state.hotelBookings.length || '۹'}</p>
          <p className="text-sm opacity-80">{t('hotels', lang)}</p>
        </div>
      </div>
    </div>
  );
}
