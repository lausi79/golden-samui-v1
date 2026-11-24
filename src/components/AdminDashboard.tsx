import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowUpDown,
  Download,
  Lock,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type {
  Inquiry,
  InquiryStatus,
  InquiryType,
  Language,
  Property,
  PropertyCategory,
  PropertyStatus
} from '../types';
import { formatPrice, getPropertyTitle } from '../utils/format';
import { AdminListingModal } from './AdminListingModal';
import { PropertyImage } from './PropertyImage';

interface AdminDashboardProps {
  lang: Language;
  onPropertiesUpdated: () => void;
}

type AdminTab = 'listings' | 'inquiries';
type ListingSortField = 'title' | 'category' | 'location' | 'bedrooms' | 'priceThb' | 'status';
type InquirySortField = 'createdAt' | 'name' | 'type' | 'status';

export function AdminDashboard({ lang, onPropertiesUpdated }: AdminDashboardProps) {
  const t = TRANSLATIONS[lang];

  // Auth state kept strictly in React memory
  const [authStatus, setAuthStatus] = useState<'loading' | 'unclaimed' | 'ready'>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Dashboard data
  const [tab, setTab] = useState<AdminTab>('listings');
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Listing filters & sorting
  const [listingSearch, setListingSearch] = useState('');
  const [listingCatFilter, setListingCatFilter] = useState<PropertyCategory | 'all'>('all');
  const [listingStatusFilter, setListingStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [listingSortField, setListingSortField] = useState<ListingSortField>('category');
  const [listingSortDir, setListingSortDir] = useState<'asc' | 'desc'>('asc');

  // Inquiry filters & sorting
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<InquiryType | 'all'>('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [inquirySortField, setInquirySortField] = useState<InquirySortField>('createdAt');
  const [inquirySortDir, setInquirySortDir] = useState<'asc' | 'desc'>('desc');

  // Editor modal & notes draft
  const [editingProperty, setEditingProperty] = useState<Property | null | 'new'>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth-status')
      .then((r) => r.json())
      .then((d: { configured: boolean }) => {
        setAuthStatus(d.configured ? 'ready' : 'unclaimed');
      })
      .catch(() => setAuthStatus('ready'));
  }, []);

  const fetchAdminData = async (activeToken: string) => {
    setLoadingData(true);
    try {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/admin/properties', {
          headers: { Authorization: `Bearer ${activeToken}` }
        }),
        fetch('/api/admin/inquiries', {
          headers: { Authorization: `Bearer ${activeToken}` }
        })
      ]);
      if (pRes.status === 401 || iRes.status === 401) {
        setToken(null);
        return;
      }
      const pJson = await pRes.json();
      const iJson = await iRes.json();
      setProperties(pJson.properties || []);
      const inqs: Inquiry[] = iJson.inquiries || [];
      setInquiries(inqs);
      const draft: Record<string, string> = {};
      for (const inq of inqs) {
        draft[inq.id] = inq.adminNotes || '';
      }
      setNotesDraft(draft);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleSetupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password.length < 8) {
      setAuthError(
        lang === 'de'
          ? 'Das Passwort muss mindestens 8 Zeichen lang sein.'
          : 'Password must be at least 8 characters long.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setAuthError(
        lang === 'de' ? 'Passwörter stimmen nicht überein.' : 'Passwords do not match.'
      );
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Setup failed');
      } else {
        setAuthStatus('ready');
        setToken(data.token);
        setPassword('');
        setConfirmPassword('');
      }
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid password');
      } else {
        setToken(data.token);
        setPassword('');
      }
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (propId: string, nextStatus: PropertyStatus) => {
    if (!token) return;
    const res = await fetch(`/api/admin/properties/${propId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    });
    if (res.ok) {
      const { property } = await res.json();
      setProperties((prev) => prev.map((p) => (p.id === propId ? property : p)));
      onPropertiesUpdated();
    }
  };

  const handleDeleteProperty = async (propId: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/properties/${propId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p.id !== propId));
      onPropertiesUpdated();
    }
  };

  const handleUpdateInquiry = async (id: string, patch: { status?: InquiryStatus; adminNotes?: string }) => {
    if (!token) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(patch)
    });
    if (res.ok) {
      const { inquiry } = await res.json();
      setInquiries((prev) => prev.map((i) => (i.id === id ? inquiry : i)));
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!token) return;
    setExporting(true);
    try {
      const params = new URLSearchParams({
        resource: tab,
        format,
        category: tab === 'listings' ? listingCatFilter : inquiryTypeFilter,
        status: tab === 'listings' ? listingStatusFilter : inquiryStatusFilter,
        search: tab === 'listings' ? listingSearch : inquirySearch
      });
      const res = await fetch(`/api/admin/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `golden-samui-${tab}-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const toggleListingSort = (field: ListingSortField) => {
    if (listingSortField === field) {
      setListingSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setListingSortField(field);
      setListingSortDir('asc');
    }
  };

  const toggleInquirySort = (field: InquirySortField) => {
    if (inquirySortField === field) {
      setInquirySortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setInquirySortField(field);
      setInquirySortDir('desc');
    }
  };

  // Auth Gate Screen
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F2EFE9] border border-stone-200 flex items-center justify-center text-[#8A610C]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg text-[#171614]">
                {authStatus === 'unclaimed' ? t.admin.setupTitle : t.admin.loginTitle}
              </h1>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {authStatus === 'unclaimed' ? t.admin.setupDesc : t.admin.loginDesc}
          </p>

          {authStatus === 'loading' ? (
            <div className="h-24 flex items-center justify-center text-sm text-stone-500">...</div>
          ) : authStatus === 'unclaimed' ? (
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  {t.admin.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  {t.admin.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg cursor-pointer"
              >
                {t.admin.createPasswordBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  {t.admin.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg cursor-pointer"
              >
                {t.admin.loginBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filtered & sorted listings
  const filteredListings = properties
    .filter((p) => (listingCatFilter === 'all' ? true : p.category === listingCatFilter))
    .filter((p) => (listingStatusFilter === 'all' ? true : p.status === listingStatusFilter))
    .filter((p) => {
      if (!listingSearch.trim()) return true;
      const q = listingSearch.trim().toLowerCase();
      return (
        p.title_de.toLowerCase().includes(q) ||
        p.title_en.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const mul = listingSortDir === 'asc' ? 1 : -1;
      if (listingSortField === 'bedrooms') return (a.bedrooms - b.bedrooms) * mul;
      if (listingSortField === 'priceThb') return (a.priceThb - b.priceThb) * mul;
      if (listingSortField === 'title') return getPropertyTitle(a, lang).localeCompare(getPropertyTitle(b, lang)) * mul;
      return String(a[listingSortField]).localeCompare(String(b[listingSortField])) * mul;
    });

  // Filtered & sorted inquiries
  const filteredInquiries = inquiries
    .filter((i) => (inquiryTypeFilter === 'all' ? true : i.type === inquiryTypeFilter))
    .filter((i) => (inquiryStatusFilter === 'all' ? true : i.status === inquiryStatusFilter))
    .filter((i) => {
      if (!inquirySearch.trim()) return true;
      const q = inquirySearch.trim().toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.propertyTitle || '').toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const mul = inquirySortDir === 'asc' ? 1 : -1;
      return String(a[inquirySortField]).localeCompare(String(b[inquirySortField])) * mul;
    });

  const availableCount = properties.filter((p) => p.status === 'available').length;
  const openInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const confirmedBookingsCount = inquiries.filter(
    (i) => i.status === 'confirmed' && i.type === 'short_term_booking'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-medium text-stone-500">Admin / Golden Samui Portfolio</div>
          <h1 className="font-display font-semibold text-2xl text-[#171614] mt-0.5">
            {t.admin.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={exporting}
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#171614] bg-white border border-stone-300 hover:bg-stone-100 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.admin.exportCsv}</span>
          </button>
          <button
            type="button"
            disabled={exporting}
            onClick={() => handleExport('json')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#171614] bg-white border border-stone-300 hover:bg-stone-100 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.admin.exportJson}</span>
          </button>
          <button
            type="button"
            onClick={() => setEditingProperty('new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.admin.newListing.replace('+ ', '')}</span>
          </button>
          <button
            type="button"
            onClick={() => setToken(null)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-[#171614] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.logout}</span>
          </button>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-xs font-medium text-stone-500">{t.admin.kpiTotalListings}</div>
          <div className="font-display font-semibold text-2xl text-[#171614] mt-1">
            {properties.length}
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-xs font-medium text-stone-500">{t.admin.kpiAvailable}</div>
          <div className="font-display font-semibold text-2xl text-emerald-700 mt-1">
            {availableCount}
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-xs font-medium text-stone-500">{t.admin.kpiOpenInquiries}</div>
          <div className="font-display font-semibold text-2xl text-[#8A610C] mt-1">
            {openInquiriesCount}
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-xs font-medium text-stone-500">{t.admin.kpiConfirmedBookings}</div>
          <div className="font-display font-semibold text-2xl text-[#171614] mt-1">
            {confirmedBookingsCount}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setTab('listings')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            tab === 'listings'
              ? 'border-[#171614] text-[#171614]'
              : 'border-transparent text-stone-500 hover:text-[#171614]'
          }`}
        >
          {t.admin.tabListings} ({properties.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('inquiries')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            tab === 'inquiries'
              ? 'border-[#171614] text-[#171614]'
              : 'border-transparent text-stone-500 hover:text-[#171614]'
          }`}
        >
          {t.admin.tabInquiries} ({inquiries.length})
        </button>
      </div>

      {/* Tab 1: Listings Management */}
      {tab === 'listings' && (
        <div className="space-y-4">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder={t.admin.searchPlaceholder}
                className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-stone-200 rounded-lg"
              />
            </div>
            <select
              value={listingCatFilter}
              onChange={(e) => setListingCatFilter(e.target.value as PropertyCategory | 'all')}
              className="h-10 px-3 text-sm bg-white border border-stone-200 rounded-lg"
            >
              <option value="all">{t.categories.all}</option>
              <option value="short_term">{t.categories.short_term}</option>
              <option value="long_term">{t.categories.long_term}</option>
              <option value="sale">{t.categories.sale}</option>
            </select>
            <select
              value={listingStatusFilter}
              onChange={(e) => setListingStatusFilter(e.target.value as PropertyStatus | 'all')}
              className="h-10 px-3 text-sm bg-white border border-stone-200 rounded-lg"
            >
              <option value="all">{t.admin.allStatuses}</option>
              <option value="available">{t.listings.statusLabels.available}</option>
              <option value="reserved">{t.listings.statusLabels.reserved}</option>
              <option value="sold">{t.listings.statusLabels.sold}</option>
            </select>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-stone-600">
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleListingSort('title')}
                      className="inline-flex items-center gap-1 hover:text-[#171614] cursor-pointer"
                    >
                      <span>{lang === 'de' ? 'Immobilie' : 'Property'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleListingSort('category')}
                      className="inline-flex items-center gap-1 hover:text-[#171614] cursor-pointer"
                    >
                      <span>{t.quickFilter.categoryLabel}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => toggleListingSort('location')}
                      className="inline-flex items-center gap-1 hover:text-[#171614] cursor-pointer"
                    >
                      <span>{lang === 'de' ? 'Lage' : 'Location'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleListingSort('bedrooms')}
                      className="inline-flex items-center gap-1 hover:text-[#171614] cursor-pointer"
                    >
                      <span>{lang === 'de' ? 'Zi.' : 'Beds'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleListingSort('priceThb')}
                      className="inline-flex items-center gap-1 hover:text-[#171614] cursor-pointer"
                    >
                      <span>{lang === 'de' ? 'Preis (THB)' : 'Price (THB)'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">{lang === 'de' ? 'Aktionen' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {loadingData ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-500">
                      ...
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-500">
                      {t.listings.emptyTitle}
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="w-12 h-9 rounded overflow-hidden bg-stone-100 shrink-0">
                            <PropertyImage src={prop.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#171614] truncate max-w-[260px]">
                              {getPropertyTitle(prop, lang)}
                            </div>
                            <div className="text-xs text-stone-500 truncate">
                              {prop.sourcePartner || prop.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-700 whitespace-nowrap">
                        {t.categoryShort[prop.category]}
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-700 whitespace-nowrap">
                        {prop.location}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                        {prop.bedrooms}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs tabular-nums whitespace-nowrap">
                        {formatPrice(prop.priceThb, 'THB', lang)}
                        <span className="text-stone-400">
                          {prop.priceUnit === 'night' ? '/N' : prop.priceUnit === 'month' ? '/M' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={prop.status}
                          onChange={(e) => handleQuickStatusChange(prop.id, e.target.value as PropertyStatus)}
                          className="h-8 px-2 text-xs bg-[#FAF9F6] border border-stone-200 rounded-md"
                        >
                          <option value="available">{t.listings.statusLabels.available}</option>
                          <option value="reserved">{t.listings.statusLabels.reserved}</option>
                          <option value="sold">{t.listings.statusLabels.sold}</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingProperty(prop)}
                            title={t.admin.edit}
                            className="p-1.5 text-stone-600 hover:text-[#171614] hover:bg-stone-200/60 rounded-md cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(prop.id)}
                            title={t.admin.delete}
                            className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Tab 2: Inquiries & Bookings Management */}
      {tab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder={t.admin.searchPlaceholder}
                className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-stone-200 rounded-lg"
              />
            </div>
            <select
              value={inquiryTypeFilter}
              onChange={(e) => setInquiryTypeFilter(e.target.value as InquiryType | 'all')}
              className="h-10 px-3 text-sm bg-white border border-stone-200 rounded-lg"
            >
              <option value="all">{t.quickFilter.allCategories}</option>
              <option value="short_term_booking">{t.admin.inquiryTypes.short_term_booking}</option>
              <option value="viewing">{t.admin.inquiryTypes.viewing}</option>
              <option value="general_contact">{t.admin.inquiryTypes.general_contact}</option>
            </select>
            <select
              value={inquiryStatusFilter}
              onChange={(e) => setInquiryStatusFilter(e.target.value as InquiryStatus | 'all')}
              className="h-10 px-3 text-sm bg-white border border-stone-200 rounded-lg"
            >
              <option value="all">{t.admin.allStatuses}</option>
              <option value="new">{t.admin.inquiryStatuses.new}</option>
              <option value="confirmed">{t.admin.inquiryStatuses.confirmed}</option>
              <option value="completed">{t.admin.inquiryStatuses.completed}</option>
              <option value="archived">{t.admin.inquiryStatuses.archived}</option>
            </select>
            <button
              type="button"
              onClick={() => toggleInquirySort('createdAt')}
              className="h-10 px-3 text-xs font-medium bg-white border border-stone-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'Datum' : 'Date'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-sm text-stone-500">
                {lang === 'de' ? 'Keine Anfragen gefunden.' : 'No inquiries found.'}
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-[#8A610C]">
                          {t.admin.inquiryTypes[inq.type]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {new Date(inq.createdAt).toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')}
                        </span>
                        {inq.propertyTitle && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#171614]">{inq.propertyTitle}</span>
                          </>
                        )}
                      </div>
                      <div className="font-display font-semibold text-base text-[#171614]">
                        {inq.name}{' '}
                        <span className="font-normal text-sm text-stone-600">
                          ({inq.email} · {inq.phone})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateInquiry(inq.id, { status: e.target.value as InquiryStatus })
                        }
                        className="h-9 px-3 text-xs font-medium bg-[#FAF9F6] border border-stone-200 rounded-lg"
                      >
                        <option value="new">{t.admin.inquiryStatuses.new}</option>
                        <option value="confirmed">{t.admin.inquiryStatuses.confirmed}</option>
                        <option value="completed">{t.admin.inquiryStatuses.completed}</option>
                        <option value="archived">{t.admin.inquiryStatuses.archived}</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-2 text-stone-400 hover:text-red-700 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Structured Booking / Viewing Details */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-stone-700 bg-[#FAF9F6] border border-stone-100 rounded-lg px-4 py-2.5 tabular-nums">
                    {inq.checkIn && inq.checkOut && (
                      <span>
                        <strong>{t.modal.checkIn}:</strong> {inq.checkIn} → {inq.checkOut}
                      </span>
                    )}
                    {inq.guests && (
                      <span>
                        <strong>{t.modal.guestsCount}:</strong> {inq.guests}
                      </span>
                    )}
                    {inq.estimatedTotalThb && (
                      <span>
                        <strong>{t.modal.estimatedTotal}:</strong>{' '}
                        {formatPrice(inq.estimatedTotalThb, 'THB', lang)}
                      </span>
                    )}
                    {inq.viewingDate && (
                      <span>
                        <strong>{t.modal.viewingDate}:</strong> {inq.viewingDate} {inq.viewingTime} (
                        {inq.viewingFormat === 'video' ? t.modal.videoCall : t.modal.inPerson})
                      </span>
                    )}
                    {inq.preferredTenure && (
                      <span>
                        <strong>Tenure:</strong> {inq.preferredTenure}
                      </span>
                    )}
                    {inq.addOns && inq.addOns.length > 0 && (
                      <span>
                        <strong>Extras:</strong> {inq.addOns.join(', ')}
                      </span>
                    )}
                  </div>

                  {inq.message && <p className="text-sm text-stone-700 leading-relaxed">{inq.message}</p>}

                  {/* Internal Admin Note */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      value={notesDraft[inq.id] ?? ''}
                      onChange={(e) =>
                        setNotesDraft((prev) => ({ ...prev, [inq.id]: e.target.value }))
                      }
                      placeholder={t.admin.notesPlaceholder}
                      className="flex-1 h-9 px-3 text-xs bg-[#FAF9F6] border border-stone-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateInquiry(inq.id, { adminNotes: notesDraft[inq.id] ?? '' })
                      }
                      className="h-9 px-3.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-[#171614] rounded-lg cursor-pointer shrink-0"
                    >
                      {lang === 'de' ? 'Notiz speichern' : 'Save Note'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Listing Create/Edit Modal */}
      {editingProperty && (
        <AdminListingModal
          lang={lang}
          token={token}
          initialProperty={editingProperty === 'new' ? null : editingProperty}
          onClose={() => setEditingProperty(null)}
          onSaved={(savedProp, isNew) => {
            setProperties((prev) =>
              isNew ? [savedProp, ...prev] : prev.map((p) => (p.id === savedProp.id ? savedProp : p))
            );
            setEditingProperty(null);
            onPropertiesUpdated();
          }}
        />
      )}
    </div>
  );
}
