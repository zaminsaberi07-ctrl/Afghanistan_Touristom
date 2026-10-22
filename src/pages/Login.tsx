import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { User } from '../types';
import { Plane, Shield, Globe } from 'lucide-react';

export default function LoginPage() {
  const { state, dispatch } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Trim inputs
    const user = username.trim();
    const pass = password.trim();

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 800));

    if (user === 'admin' && pass === 'admin123') {
      const userData: User = {
        id: '1',
        username: 'admin',
        fullName: 'مدیر سیستم',
        role: 'admin',
        branchId: '1',
        isActive: true,
        lastLogin: new Date().toISOString(),
      };
      dispatch({ type: 'SET_USER', payload: userData });
      setLoading(false);
    } else if (user === 'user' && pass === 'user123') {
      const userData: User = {
        id: '2',
        username: 'user',
        fullName: 'کاربر فروش',
        role: 'sales',
        branchId: '1',
        isActive: true,
        lastLogin: new Date().toISOString(),
      };
      dispatch({ type: 'SET_USER', payload: userData });
      setLoading(false);
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است. لطفاً دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  const lang = state.language;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Plane className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('welcome', lang)}
          </h1>
          <p className="text-blue-200 text-sm">
            سیستم مدیریت آژانس مسافرتی افغانستان
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('username', lang)}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('password', lang)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('loading', lang)}
                </span>
              ) : t('login', lang)}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">اطلاعات ورود آزمایشی:</p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="font-medium text-gray-700">مدیر سیستم</p>
                <p className="text-gray-500 mt-1">admin / admin123</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="font-medium text-gray-700">کاربر فروش</p>
                <p className="text-gray-500 mt-1">user / user123</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                پر کردن: مدیر
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('user');
                  setPassword('user123');
                }}
                className="py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                پر کردن: کاربر
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const userData: User = {
                  id: '1',
                  username: 'admin',
                  fullName: 'مدیر سیستم',
                  role: 'admin',
                  branchId: '1',
                  isActive: true,
                  lastLogin: new Date().toISOString(),
                };
                dispatch({ type: 'SET_USER', payload: userData });
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
            >
              ⚡ ورود سریع (بدون رمز)
            </button>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'dari' })}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${lang === 'dari' ? 'bg-white text-blue-700 font-medium' : 'text-white/70 hover:text-white'}`}
          >
            دری
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'pashto' })}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${lang === 'pashto' ? 'bg-white text-blue-700 font-medium' : 'text-white/70 hover:text-white'}`}
          >
            پشتو
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'english' })}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${lang === 'english' ? 'bg-white text-blue-700 font-medium' : 'text-white/70 hover:text-white'}`}
          >
            English
          </button>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-blue-200 text-xs">
            <Shield className="w-4 h-4" />
            <span>امن</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-200 text-xs">
            <Globe className="w-4 h-4" />
            <span>چند زبانه</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-200 text-xs">
            <Plane className="w-4 h-4" />
            <span>حرفه‌ای</span>
          </div>
        </div>
      </div>
    </div>
  );
}
