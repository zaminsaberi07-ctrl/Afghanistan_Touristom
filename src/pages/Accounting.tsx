import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { Payment } from '../types';
import { Plus, Search, X, Calculator, ArrowDownLeft, ArrowUpRight, Wallet, CreditCard, Banknote, Plane, Building2, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AccountingPage() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receipt' | 'payment'>('all');
  const [activeTab, setActiveTab] = useState<'payments' | 'summary' | 'currencies'>('payments');

  const [formData, setFormData] = useState({
    customerName: '',
    type: 'receipt' as 'receipt' | 'payment',
    amount: 0,
    currency: 'AFN',
    method: 'cash' as 'cash' | 'bank' | 'check' | 'transfer',
    referenceNo: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredPayments = state.payments.filter(p => {
    const matchesSearch = p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalReceipts = state.payments.filter(p => p.type === 'receipt').reduce((s, p) => s + p.amount, 0);
  const totalPaymentsOut = state.payments.filter(p => p.type === 'payment').reduce((s, p) => s + p.amount, 0);
  const netBalance = totalReceipts - totalPaymentsOut;

  const resetForm = () => {
    setFormData({ customerName: '', type: 'receipt', amount: 0, currency: 'AFN', method: 'cash', referenceNo: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowPaymentForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const newPayment: Payment = {
      id: uuidv4(),
      receiptNo: `${formData.type === 'receipt' ? 'RCV' : 'PAY'}-${Date.now().toString(36).toUpperCase()}`,
      ...formData,
      createdBy: state.user?.id || '',
    };
    dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('savedSuccessfully', lang), type: 'success' } });
    resetForm();
  };

  // Flight revenue
  const flightRevenue = state.flightBookings.reduce((s, b) => s + b.sellPrice, 0);
  const flightCost = state.flightBookings.reduce((s, b) => s + b.buyPrice, 0);
  const flightProfit = flightRevenue - flightCost;

  // Hotel revenue
  const hotelRevenue = state.hotelBookings.reduce((s, b) => s + b.sellPrice, 0);
  const hotelCost = state.hotelBookings.reduce((s, b) => s + b.buyPrice, 0);
  const hotelProfit = hotelRevenue - hotelCost;

  // Visa revenue
  const visaRevenue = state.visaApplications.reduce((s, v) => s + v.serviceFee, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('accounting', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">مدیریت مالی و حسابداری</p>
        </div>
        <button onClick={() => setShowPaymentForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          ثبت دریافت/پرداخت
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1">
        <button onClick={() => setActiveTab('payments')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'payments' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
          دریافت‌ها و پرداخت‌ها
        </button>
        <button onClick={() => setActiveTab('summary')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'summary' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
          خلاصه مالی
        </button>
        <button onClick={() => setActiveTab('currencies')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'currencies' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
          ارزها
        </button>
      </div>

      {activeTab === 'payments' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">کل دریافت‌ها</p>
                  <p className="text-xl font-bold text-green-600">{totalReceipts.toLocaleString()} ؋</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">کل پرداخت‌ها</p>
                  <p className="text-xl font-bold text-red-600">{totalPaymentsOut.toLocaleString()} ؋</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">مانده خالص</p>
                  <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{netBalance.toLocaleString()} ؋</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('search', lang) + '...'} className="w-full ps-10 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                <option value="all">همه</option>
                <option value="receipt">دریافت</option>
                <option value="payment">پرداخت</option>
              </select>
            </div>
          </div>

          {/* Payments table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="table-container">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">شماره</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">مشتری</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('description', lang)}</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">روش</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount', lang)}</th>
                    <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('date', lang)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">{t('noData', lang)}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-mono text-blue-600">{payment.receiptNo}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${payment.type === 'receipt' ? 'badge-success' : 'badge-danger'}`}>
                            {payment.type === 'receipt' ? t('receipt', lang) : t('payment', lang)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 hidden md:table-cell">{payment.customerName || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">
                          <span className="flex items-center gap-1">
                            {payment.method === 'cash' && <Banknote className="w-3.5 h-3.5" />}
                            {payment.method === 'bank' && <CreditCard className="w-3.5 h-3.5" />}
                            {payment.method}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm font-bold ${payment.type === 'receipt' ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.type === 'receipt' ? '+' : '-'}{payment.amount.toLocaleString()} {payment.currency}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">{payment.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">خلاصه درآمد و هزینه</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">فروش بلیت</span>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-gray-800">{flightRevenue.toLocaleString()} ؋</p>
                  <p className="text-xs text-green-600">سود: {flightProfit.toLocaleString()} ؋</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-800">رزرو هتل</span>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-gray-800">{hotelRevenue.toLocaleString()} ؋</p>
                  <p className="text-xs text-green-600">سود: {hotelProfit.toLocaleString()} ؋</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-800">خدمات ویزا</span>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-gray-800">{visaRevenue.toLocaleString()} ؋</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">مجموع دریافت‌ها</span>
                <span className="text-lg font-bold text-green-600">{totalReceipts.toLocaleString()} ؋</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">مجموع پرداخت‌ها</span>
                <span className="text-lg font-bold text-red-600">{totalPaymentsOut.toLocaleString()} ؋</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-sm font-bold text-gray-800">مانده نهایی</span>
                <span className={`text-xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{netBalance.toLocaleString()} ؋</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'currencies' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">نماد</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('exchangeRate', lang)}</th>
                  <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">پایه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {state.currencies.map(currency => (
                  <tr key={currency.code} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono font-bold text-blue-600">{currency.code}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{currency.name}</td>
                    <td className="py-3 px-4 text-lg">{currency.symbol}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{currency.rate.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {currency.isBase && <span className="badge badge-success">پایه</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold text-gray-800">ثبت دریافت / پرداخت</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع عملیات</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'receipt' })} className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${formData.type === 'receipt' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <ArrowDownLeft className="w-5 h-5 mx-auto mb-1" />
                    {t('receipt', lang)}
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'payment' })} className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${formData.type === 'payment' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <ArrowUpRight className="w-5 h-5 mx-auto mb-1" />
                    {t('payment', lang)}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount', lang)} *</label>
                  <input type="number" min={0} value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('currency', lang)}</label>
                  <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="AFN">AFN (؋)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('customerName', lang)}</label>
                <input type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">روش پرداخت</label>
                  <select value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="cash">نقدی</option>
                    <option value="bank">بانکی</option>
                    <option value="check">چک</option>
                    <option value="transfer">انتقال</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('date', lang)}</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description', lang)} *</label>
                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">{t('save', lang)}</button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">{t('cancel', lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


