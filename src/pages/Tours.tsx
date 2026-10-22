import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { Tour } from '../types';
import { Plus, Search, Edit2, Trash2, X, Map, Users, Calendar, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function ToursPage() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    days: 1,
    capacity: 10,
    adultPrice: 0,
    childPrice: 0,
    costPrice: 0,
    currency: 'AFN',
    status: 'draft' as Tour['status'],
    guide: '',
    type: 'domestic' as 'domestic' | 'international',
  });

  const filteredTours = state.tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tour.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const resetForm = () => {
    setFormData({ name: '', destination: '', description: '', startDate: '', endDate: '', days: 1, capacity: 10, adultPrice: 0, childPrice: 0, costPrice: 0, currency: 'AFN', status: 'draft', guide: '', type: 'domestic' });
    setEditingTour(null);
    setShowForm(false);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      destination: tour.destination,
      description: tour.description,
      startDate: tour.startDate,
      endDate: tour.endDate,
      days: tour.days,
      capacity: tour.capacity,
      adultPrice: tour.adultPrice,
      childPrice: tour.childPrice,
      costPrice: tour.costPrice,
      currency: tour.currency,
      status: tour.status,
      guide: tour.guide || '',
      type: tour.type,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.destination) return;

    if (editingTour) {
      dispatch({ type: 'UPDATE_TOUR', payload: { ...editingTour, ...formData } });
    } else {
      const newTour: Tour = { id: uuidv4(), ...formData, bookedCount: 0 };
      dispatch({ type: 'ADD_TOUR', payload: newTour });
    }
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('savedSuccessfully', lang), type: 'success' } });
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TOUR', payload: id });
    setDeleteConfirm(null);
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('deletedSuccessfully', lang), type: 'success' } });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: 'badge-gray',
      active: 'badge-success',
      full: 'badge-warning',
      completed: 'badge-info',
      cancelled: 'badge-danger',
    };
    return map[status] || 'badge-gray';
  };

  const destinations = ['بامیان', 'بند امیر', 'هرات', 'بلخ', 'کندهار', 'بدخشان', 'نورستان', 'پنجشیر', 'سواحات', 'ترکیه', 'دبی', 'ایران', 'تایلند', 'مالیزیا'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('tours', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredTours.length} {t('tours', lang)}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          {t('addTour', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('search', lang) + '...'} className="w-full ps-10 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
            <option value="all">همه تورها</option>
            <option value="domestic">{t('domestic', lang)}</option>
            <option value="international">{t('international', lang)}</option>
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('noData', lang)}</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:underline text-sm">{t('addTour', lang)}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTours.map(tour => (
            <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
              {/* Tour header */}
              <div className={`h-32 bg-gradient-to-br ${tour.type === 'domestic' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600'} p-4 flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                  <span className={`badge ${tour.type === 'domestic' ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
                    {t(tour.type, lang)}
                  </span>
                  <span className={`badge ${getStatusBadge(tour.status)}`}>{t(tour.status, lang)}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{tour.name}</h3>
                  <p className="text-white/80 text-sm">{tour.destination}</p>
                </div>
              </div>

              {/* Tour details */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{tour.days} روز</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{tour.bookedCount}/{tour.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">{t('adultPrice', lang)}</p>
                    <p className="text-lg font-bold text-gray-800">{tour.adultPrice.toLocaleString()} <span className="text-xs font-normal text-gray-500">{tour.currency}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-gray-500">{t('profit', lang)}</p>
                    <p className="text-lg font-bold text-green-600">{(tour.adultPrice - tour.costPrice).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleEdit(tour)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm hover:bg-blue-100 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                    {t('edit', lang)}
                  </button>
                  <button onClick={() => setDeleteConfirm(tour.id)} className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold text-gray-800">{editingTour ? t('edit', lang) : t('addTour', lang)}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('tourName', lang)} *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('tourDestination', lang)} *</label>
                  <select value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required>
                    <option value="">انتخاب کنید</option>
                    {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description', lang)}</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('startDate', lang)}</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('endDate', lang)}</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('days', lang)}</label>
                  <input type="number" min={1} value={formData.days} onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('capacity', lang)}</label>
                  <input type="number" min={1} value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('adultPrice', lang)}</label>
                  <input type="number" min={0} value={formData.adultPrice} onChange={e => setFormData({ ...formData, adultPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('childPrice', lang)}</label>
                  <input type="number" min={0} value={formData.childPrice} onChange={e => setFormData({ ...formData, childPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قیمت تمام‌شده</label>
                  <input type="number" min={0} value={formData.costPrice} onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('tourType', lang)}</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="domestic">{t('domestic', lang)}</option>
                    <option value="international">{t('international', lang)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">راهنمای تور</label>
                  <input type="text" value={formData.guide} onChange={e => setFormData({ ...formData, guide: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('status', lang)}</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="draft">{t('draft', lang)}</option>
                    <option value="active">فعال</option>
                    <option value="full">تکمیل</option>
                    <option value="completed">{t('completed', lang)}</option>
                    <option value="cancelled">{t('cancelled', lang)}</option>
                  </select>
                </div>
              </div>
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
