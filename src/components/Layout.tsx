import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { 
  LayoutDashboard, Users, Plane, Map, FileText, Building2, 
  Truck, Calculator, BarChart3, Settings, LogOut, Bell, 
  Search, Menu, ChevronDown, Globe, User, X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { state, dispatch } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lang = state.language;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard', lang) },
    { id: 'customers', icon: Users, label: t('customers', lang) },
    { id: 'tickets', icon: Plane, label: t('tickets', lang) },
    { id: 'tours', icon: Map, label: t('tours', lang) },
    { id: 'visa', icon: FileText, label: t('visa', lang) },
    { id: 'hotels', icon: Building2, label: t('hotels', lang) },
    { id: 'transport', icon: Truck, label: t('transport', lang) },
    { id: 'accounting', icon: Calculator, label: t('accounting', lang) },
    { id: 'reports', icon: BarChart3, label: t('reports', lang) },
    { id: 'settings', icon: Settings, label: t('settings', lang) },
  ];

  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 ${state.language === 'english' ? 'left-0' : 'right-0'} z-50 w-64 bg-white border-${state.language === 'english' ? 'r' : 'l'} border-gray-200 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : state.language === 'english' ? '-translate-x-full lg:translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">آژانس مسافرتی</h2>
                <p className="text-xs text-gray-500">سیستم مدیریت ERP</p>
              </div>
              <button className="lg:hidden ms-auto" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      currentPage === item.id
                        ? 'sidebar-item-active'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{state.user?.fullName}</p>
                <p className="text-xs text-gray-500">{state.user?.role === 'admin' ? 'مدیر سیستم' : 'کاربر فروش'}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title={t('logout', lang)}>
                <LogOut className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 start-3" />
                <input
                  type="text"
                  placeholder={t('search', lang) + '...'}
                  className="w-full ps-10 pe-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const langs: Array<'dari' | 'pashto' | 'english'> = ['dari', 'pashto', 'english'];
                    const currentIdx = langs.indexOf(lang);
                    const nextLang = langs[(currentIdx + 1) % 3];
                    dispatch({ type: 'SET_LANGUAGE', payload: nextLang });
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 hidden sm:inline">
                    {lang === 'dari' ? 'دری' : lang === 'pashto' ? 'پشتو' : 'EN'}
                  </span>
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 end-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute top-full mt-2 end-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-medium text-gray-800">{t('notifications', lang)}</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {state.notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 text-center">{t('noData', lang)}</p>
                      ) : (
                        state.notifications.slice(0, 5).map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                            onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                          >
                            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{state.user?.fullName?.charAt(0)}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {showProfile && (
                  <div className="absolute top-full mt-2 end-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800 text-sm">{state.user?.fullName}</p>
                      <p className="text-xs text-gray-500">{state.user?.username}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        {t('profile', lang)}
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-start px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        {t('logout', lang)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Toast notification */}
      {state.toast && (
        <div className={`fixed bottom-6 end-6 z-[100] animate-slideIn px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
          state.toast.type === 'success' ? 'bg-green-500' : state.toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {state.toast.message}
        </div>
      )}
    </div>
  );
}
