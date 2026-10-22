import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { HotelBooking } from '../types';
import { Plus, Search, Edit2, Trash2, X, Building2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function HotelsPage() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<HotelBooking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    hotelName: '',
    city: '',
    checkIn: '',
    checkOut: '',
    roomType: 'single',
    guests: 1,
    buyPrice: 0,
    sellPrice: 0,
    currency: 'AFN',
    status: 'pending' as HotelBooking['status'],
    confirmationNo: '',
  });

  const filteredBookings = state.hotelBookings.filter(b =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ customerId: '', customerName: '', hotelName: '', city: '', checkIn: '', checkOut: '', roomType: 'single', guests: 1, buyPrice: 0, sellPrice: 0, currency: 'AFN', status: 'pending', confirmationNo: '' });
    setEditingBooking(null);
    setShowForm(false);
  };

  const handleEdit = (booking: HotelBooking) => {
    setEditingBooking(booking);
    setFormData({
      customerId: booking.customerId,
      customerName: booking.customerName,
      hotelName: booking.hotelName,
      city: booking.city,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomType,
      guests: booking.guests,
      buyPrice: booking.buyPrice,
      sellPrice: booking.sellPrice,
      currency: booking.currency,
      status: booking.status,
      confirmationNo: booking.confirmationNo || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.hotelName || !formData.city) return;

    if (editingBooking) {
      dispatch({ type: 'UPDATE_HOTEL_BOOKING', payload: { ...editingBooking, ...formData } });
    } else {
      const newBooking: HotelBooking = {
        id: uuidv4(),
        bookingNo: `HTL-${Date.now().toString(36).toUpperCase()}`,
        ...formData,
      };
      dispatch({ type: 'ADD_HOTEL_BOOKING', payload: newBooking });
    }
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('savedSuccessfully', lang), type: 'success' } });
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_HOTEL_BOOKING', payload: id });
    setDeleteConfirm(null);
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('deletedSuccessfully', lang), type: 'success' } });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      checked_in: 'badge-info',
      checked_out: 'badge-gray',
      cancelled: 'badge-danger',
    };
    return map[status] || 'badge-gray';
  };

  const cities = ['کابل', 'هرات', 'مزار شریف', 'کندهار', 'جلال‌آباد', 'بامیان', 'دبی', 'استانبول', 'تهران', 'مشهد', 'دهلی', 'بانکوک'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('hotels', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredBookings.length} رزرو</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          {t('addHotelBooking', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('search', lang) + '...'} className="w-full ps-10 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-container">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('bookingNo', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customerName', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('hotelName', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('city', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('checkIn', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('checkOut', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sellPrice', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">{t('noData', lang)}</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-blue-600">{booking.bookingNo}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{booking.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{booking.hotelName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{booking.city}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">{booking.checkIn}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">{booking.checkOut}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{booking.sellPrice.toLocaleString()} {booking.currency}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusBadge(booking.status)}`}>{t(booking.status, lang)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(booking)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => setDeleteConfirm(booking.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold text-gray-800">{editingBooking ? t('edit', lang) : t('addHotelBooking', lang)}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('customerName', lang)} *</label>
                  <input type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('hotelName', lang)} *</label>
                  <input type="text" value={formData.hotelName} onChange={e => setFormData({ ...formData, hotelName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city', lang)} *</label>
                  <select value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required>
                    <option value="">انتخاب کنید</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkIn', lang)}</label>
                  <input type="date" value={formData.checkIn} onChange={e => setFormData({ ...formData, checkIn: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkOut', lang)}</label>
                  <input type="date" value={formData.checkOut} onChange={e => setFormData({ ...formData, checkOut: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('roomType', lang)}</label>
                  <select value={formData.roomType} onChange={e => setFormData({ ...formData, roomType: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="single">یک نفره</option>
                    <option value="double">دو نفره</option>
                    <option value="suite">سوییت</option>
                    <option value="family">خانوادگی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('guests', lang)}</label>
                  <input type="number" min={1} value={formData.guests} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('status', lang)}</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="pending">{t('pending', lang)}</option>
                    <option value="confirmed">{t('confirmed', lang)}</option>
                    <option value="checked_in">ورود</option>
                    <option value="checked_out">خروج</option>
                    <option value="cancelled">{t('cancelled', lang)}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('buyPrice', lang)}</label>
                  <input type="number" min={0} value={formData.buyPrice} onChange={e => setFormData({ ...formData, buyPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('sellPrice', lang)}</label>
                  <input type="number" min={0} value={formData.sellPrice} onChange={e => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('currency', lang)}</label>
                  <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="AFN">AFN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              {formData.sellPrice > 0 && formData.buyPrice > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-sm text-green-700 font-medium">{t('profit', lang)}: {(formData.sellPrice - formData.buyPrice).toLocaleString()} {formData.currency}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">{t('save', lang)}</button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">{t('cancel', lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{t('confirmDelete', lang)}</h3>
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 font-medium">{t('delete', lang)}</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50">{t('cancel', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
