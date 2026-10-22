import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { Settings as SettingsIcon, Globe, Building, Users, DollarSign, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [activeTab, setActiveTab] = useState<'general' | 'branches' | 'currencies' | 'users'>('general');

  const [settings, setSettings] = useState(state.settings);

  const handleSaveSettings = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('savedSuccessfully', lang), type: 'success' } });
  };

  const tabs = [
    { id: 'general', icon: SettingsIcon, label: 'عمومی' },
    { id: 'branches', icon: Building, label: t('branches', lang) },
    { id: 'currencies', icon: DollarSign, label: 'ارزها' },
    { id: 'users', icon: Users, label: t('users', lang) },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t('settings', lang)}</h1>
        <p className="text-sm text-gray-500 mt-1">تنظیمات سیستم و شرکت</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('companyInfo', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام شرکت</label>
                <input type="text" value={settings.companyName} onChange={e => setSettings({ ...settings, companyName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                <input type="text" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address', lang)}</label>
                <input type="text" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">تنظیمات عمومی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('language', lang)}</label>
                <select value={settings.defaultLanguage} onChange={e => setSettings({ ...settings, defaultLanguage: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="dari">دری</option>
                  <option value="pashto">پشتو</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ارز پایه</label>
                <select value={settings.baseCurrency} onChange={e => setSettings({ ...settings, baseCurrency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="AFN">افغانی (AFN)</option>
                  <option value="USD">دالر (USD)</option>
                  <option value="EUR">یورو (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('calendar', lang)}</label>
                <select value={settings.defaultCalendar} onChange={e => setSettings({ ...settings, defaultCalendar: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="hijri">{t('hijri', lang)}</option>
                  <option value="gregorian">{t('gregorian', lang)}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              <Save className="w-4 h-4" />
              {t('save', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Branches */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          {state.branches.map(branch => (
            <div key={branch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                    <p className="text-sm text-gray-500">{branch.phone}</p>
                    <p className="text-sm text-blue-600 mt-1">مدیر: {branch.manager}</p>
                  </div>
                </div>
                <span className={`badge ${branch.isActive ? 'badge-success' : 'badge-gray'}`}>
                  {branch.isActive ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Currencies */}
      {activeTab === 'currencies' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">کد ارز</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">نماد</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('exchangeRate', lang)} (نسبت به AFN)</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {state.currencies.map(currency => (
                  <tr key={currency.code} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono font-bold text-blue-600">{currency.code}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{currency.name}</td>
                    <td className="py-3 px-4 text-lg">{currency.symbol}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{currency.rate}</td>
                    <td className="py-3 px-4">
                      {currency.isBase ? (
                        <span className="badge badge-success">ارز پایه</span>
                      ) : (
                        <span className="badge badge-gray">فعال</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">کاربران سیستم</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">م</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">مدیر سیستم (admin)</p>
                  <p className="text-xs text-gray-500">مدیر کل</p>
                </div>
              </div>
              <span className="badge badge-success">فعال</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">ک</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">کاربر فروش (user)</p>
                  <p className="text-xs text-gray-500">کارمند فروش</p>
                </div>
              </div>
              <span className="badge badge-success">فعال</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-700">
              <strong>توجه:</strong> نقش‌ها و مجوزها شامل: مدیر کل، مدیر شعبه، مدیر فروش، مسئول رزرو بلیت، مسئول ویزا، مسئول تورها، حسابدار، صندوقدار، کارمند فروش، مدیر منابع انسانی، حسابرس (فقط خواندنی) و مشتری وب‌سایت.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
