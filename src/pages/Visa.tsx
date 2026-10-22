import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../translations';
import { VisaApplication } from '../types';
import { Plus, Search, Edit2, Trash2, X, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function VisaPage() {
  const { state, dispatch } = useApp();
  const lang = state.language;
  const [showForm, setShowForm] = useState(false);
  const [editingVisa, setEditingVisa] = useState<VisaApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    country: '',
    visaType: '',
    status: 'draft' as VisaApplication['status'],
    embassyDate: '',
    serviceFee: 0,
    currency: 'AFN',
    assignedTo: '',
    notes: '',
  });

  const filteredVisas = state.visaApplications.filter(v => {
    const matchesSearch = v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || v.country.toLowerCase().includes(searchTerm.toLowerCase()) || v.fileNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({ customerId: '', customerName: '', country: '', visaType: '', status: 'draft', embassyDate: '', serviceFee: 0, currency: 'AFN', assignedTo: '', notes: '' });
    setEditingVisa(null);
    setShowForm(false);
  };

  const handleEdit = (visa: VisaApplication) => {
    setEditingVisa(visa);
    setFormData({
      customerId: visa.customerId,
      customerName: visa.customerName,
      country: visa.country,
      visaType: visa.visaType,
      status: visa.status,
      embassyDate: visa.embassyDate || '',
      serviceFee: visa.serviceFee,
      currency: visa.currency,
      assignedTo: visa.assignedTo,
      notes: visa.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.country || !formData.visaType) return;

    if (editingVisa) {
      dispatch({ type: 'UPDATE_VISA_APPLICATION', payload: { ...editingVisa, ...formData } });
    } else {
      const newVisa: VisaApplication = {
        id: uuidv4(),
        fileNo: `VISA-${Date.now().toString(36).toUpperCase()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_VISA_APPLICATION', payload: newVisa });
    }
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('savedSuccessfully', lang), type: 'success' } });
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_VISA_APPLICATION', payload: id });
    setDeleteConfirm(null);
    dispatch({ type: 'SHOW_TOAST', payload: { message: t('deletedSuccessfully', lang), type: 'success' } });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: 'badge-gray',
      pending_docs: 'badge-warning',
      ready: 'badge-info',
      submitted: 'badge-info',
      under_review: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      cancelled: 'badge-danger',
      completed: 'badge-success',
    };
    return map[status] || 'badge-gray';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved' || status === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'rejected' || status === 'cancelled') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const countries = ['ترکیه', 'ایران', 'امارات', 'عربستان سعودی', 'پاکستان', 'هند', 'چین', 'روسیه', 'آلمان', 'انگلستان', 'کانادا', 'امریکا', 'مالیزیا', 'تایلند'];
  const visaTypes = ['توریستی', 'تجاری', 'تحصیلی', 'کاری', 'ترانزیت', 'خانوادگی'];

  // Stats
  const stats = {
    total: state.visaApplications.length,
    pending: state.visaApplications.filter(v => v.status === 'pending_docs' || v.status === 'under_review' || v.status === 'submitted').length,
    approved: state.visaApplications.filter(v => v.status === 'approved' || v.status === 'completed').length,
    rejected: state.visaApplications.filter(v => v.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('visa', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredVisas.length} درخواست</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          {t('addVisa', lang)}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">کل درخواست‌ها</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-100">
          <p className="text-xs text-gray-500">در حال بررسی</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100">
          <p className="text-xs text-gray-500">{t('approved', lang)}</p>
          <p className="text-xl font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-100">
          <p className="text-xs text-gray-500">{t('rejected', lang)}</p>
          <p className="text-xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('search', lang) + '...'} className="w-full ps-10 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">{t('draft', lang)}</option>
            <option value="pending_docs">در انتظار اسناد</option>
            <option value="submitted">{t('submitted', lang)}</option>
            <option value="under_review">{t('under_review', lang)}</option>
            <option value="approved">{t('approved', lang)}</option>
            <option value="rejected">{t('rejected', lang)}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-container">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('fileNo', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customerName', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('country', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('visaType', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('serviceFee', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status', lang)}</th>
                <th className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVisas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">{t('noData', lang)}</p>
                  </td>
                </tr>
              ) : (
                filteredVisas.map(visa => (
                  <tr key={visa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(visa.status)}
                        <span className="text-sm font-mono text-blue-600">{visa.fileNo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{visa.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{visa.country}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{visa.visaType}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800 hidden lg:table-cell">{visa.serviceFee.toLocaleString()} {visa.currency}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusBadge(visa.status)}`}>{t(visa.status, lang)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(visa)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => setDeleteConfirm(visa.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
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
              <h3 className="text-lg font-semibold text-gray-800">{editingVisa ? t('edit', lang) : t('addVisa', lang)}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('customerName', lang)} *</label>
                  <input type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('country', lang)} *</label>
                  <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required>
                    <option value="">انتخاب کنید</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('visaType', lang)} *</label>
                  <select value={formData.visaType} onChange={e => setFormData({ ...formData, visaType: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" required>
                    <option value="">انتخاب کنید</option>
                    {visaTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('embassyDate', lang)}</label>
                  <input type="date" value={formData.embassyDate} onChange={e => setFormData({ ...formData, embassyDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('serviceFee', lang)}</label>
                  <input type="number" min={0} value={formData.serviceFee} onChange={e => setFormData({ ...formData, serviceFee: parseFloat(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('currency', lang)}</label>
                  <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="AFN">AFN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('status', lang)}</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="draft">{t('draft', lang)}</option>
                    <option value="pending_docs">در انتظار اسناد</option>
                    <option value="ready">آماده ارسال</option>
                    <option value="submitted">{t('submitted', lang)}</option>
                    <option value="under_review">{t('under_review', lang)}</option>
                    <option value="approved">{t('approved', lang)}</option>
                    <option value="rejected">{t('rejected', lang)}</option>
                    <option value="completed">{t('completed', lang)}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description', lang)}</label>
                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
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
