import { Search, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Currency, Language, LandTenure, Property, PropertyCategory } from '../types';
import { PropertyCard } from './PropertyCard';

export type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'beds_desc';

interface ListingsPageProps {
  lang: Language;
  currency: Currency;
  onChangeCurrency: (currency: Currency) => void;
  properties: Property[];
  locations: string[];
  category: PropertyCategory | 'all';
  onChangeCategory: (cat: PropertyCategory | 'all') => void;
  location: string;
  onChangeLocation: (loc: string) => void;
  minBeds: number;
  onChangeMinBeds: (beds: number) => void;
  tenure: LandTenure | 'all';
  onChangeTenure: (tenure: LandTenure | 'all') => void;
  search: string;
  onChangeSearch: (q: string) => void;
  sort: SortOption;
  onChangeSort: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectProperty: (property: Property) => void;
}

export function ListingsPage({
  lang,
  currency,
  onChangeCurrency,
  properties,
  locations,
  category,
  onChangeCategory,
  location,
  onChangeLocation,
  minBeds,
  onChangeMinBeds,
  tenure,
  onChangeTenure,
  search,
  onChangeSearch,
  sort,
  onChangeSort,
  onResetFilters,
  onSelectProperty
}: ListingsPageProps) {
  const t = TRANSLATIONS[lang];

  const filtered = properties
    .filter((p) => p.status !== 'sold')
    .filter((p) => (category === 'all' ? true : p.category === category))
    .filter((p) => (location === 'all' ? true : p.location === location))
    .filter((p) => (minBeds > 0 ? p.bedrooms >= minBeds : true))
    .filter((p) => {
      if (tenure === 'all') return true;
      if (p.category !== 'sale') return false;
      return p.landTenure === tenure || p.landTenure === 'both';
    })
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        p.title_de.toLowerCase().includes(q) ||
        p.title_en.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description_de.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.priceThb - b.priceThb;
      if (sort === 'price_desc') return b.priceThb - a.priceThb;
      if (sort === 'beds_desc') return b.bedrooms - a.bedrooms;
      return Number(b.featured) - Number(a.featured);
    });

  const categories: Array<{ id: PropertyCategory | 'all'; label: string }> = [
    { id: 'all', label: t.categories.all },
    { id: 'short_term', label: t.categories.short_term },
    { id: 'long_term', label: t.categories.long_term },
    { id: 'sale', label: t.categories.sale }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      {/* Header & Currency Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[#171614] tracking-tight">
            {t.listings.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{t.listings.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-stone-500">{t.listings.currency}:</span>
          <div className="inline-flex p-1 bg-stone-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => onChangeCurrency('THB')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                currency === 'THB' ? 'bg-white text-[#171614] shadow-sm' : 'text-stone-600 hover:text-[#171614]'
              }`}
            >
              THB ฿
            </button>
            <button
              type="button"
              onClick={() => onChangeCurrency('EUR')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                currency === 'EUR' ? 'bg-white text-[#171614] shadow-sm' : 'text-stone-600 hover:text-[#171614]'
              }`}
            >
              EUR €
            </button>
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F2EFE9] border border-stone-200 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              onChangeCategory(cat.id);
              if (cat.id !== 'sale' && cat.id !== 'all') {
                onChangeTenure('all');
              }
            }}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              category === cat.id
                ? 'bg-[#171614] text-white'
                : 'text-stone-700 hover:text-[#171614] hover:bg-white/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rockstar Villas Partner Banner for Short-Term Rentals */}
      {category === 'short_term' && (
        <div className="bg-white border border-[#C59B27]/40 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm text-[#171614] font-medium">{t.listings.rockstarBanner}</p>
          <span className="text-xs font-mono text-[#8A610C] shrink-0">rockstarvillas.com</span>
        </div>
      )}

      {/* Sales Land Tenure Banner */}
      {category === 'sale' && (
        <div className="bg-[#F2EFE9] border border-stone-200 rounded-xl px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#8A610C]">{t.tenureExplainer.freeholdTitle}: </span>
            <span className="text-stone-700">{t.tenureExplainer.freeholdDesc}</span>
          </div>
          <div>
            <span className="font-semibold text-[#8A610C]">{t.tenureExplainer.leaseholdTitle}: </span>
            <span className="text-stone-700">{t.tenureExplainer.leaseholdDesc}</span>
          </div>
        </div>
      )}

      {/* Detailed Filter Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            {t.quickFilter.locationLabel}
          </label>
          <select
            value={location}
            onChange={(e) => onChangeLocation(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
          >
            <option value="all">{t.quickFilter.allLocations}</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            {t.quickFilter.bedroomsLabel}
          </label>
          <select
            value={minBeds}
            onChange={(e) => onChangeMinBeds(Number(e.target.value))}
            className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
          >
            <option value={0}>{t.quickFilter.anyBeds}</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            {lang === 'de' ? 'Grundstücksart (Kauf)' : 'Land Option (Sales)'}
          </label>
          <select
            value={tenure}
            disabled={category === 'short_term' || category === 'long_term'}
            onChange={(e) => onChangeTenure(e.target.value as LandTenure | 'all')}
            className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg disabled:opacity-50"
          >
            <option value="all">{t.tenure.all}</option>
            <option value="freehold">{t.tenure.freehold}</option>
            <option value="leasehold">{t.tenure.leasehold}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">{t.listings.sortBy}</label>
          <select
            value={sort}
            onChange={(e) => onChangeSort(e.target.value as SortOption)}
            className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
          >
            <option value="featured">{t.listings.sortFeatured}</option>
            <option value="price_asc">{t.listings.sortPriceAsc}</option>
            <option value="price_desc">{t.listings.sortPriceDesc}</option>
            <option value="beds_desc">{t.listings.sortBedsDesc}</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-stone-600 mb-1">
            {t.quickFilter.searchLabel}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                placeholder={t.quickFilter.searchPlaceholder}
                className="w-full h-10 pl-9 pr-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={onResetFilters}
              title={t.listings.resetFilters}
              className="h-10 px-3 text-xs font-medium text-stone-600 hover:text-[#171614] border border-stone-200 rounded-lg hover:bg-stone-100 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.listings.resetFilters}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-stone-600 tabular-nums">
        <span className="font-semibold text-[#171614]">{filtered.length}</span>{' '}
        {t.listings.resultsCount}
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-3">
          <h3 className="font-display font-semibold text-lg text-[#171614]">
            {t.listings.emptyTitle}
          </h3>
          <p className="text-sm text-stone-600">{t.listings.emptyDesc}</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-sm font-medium bg-[#171614] text-white rounded-lg cursor-pointer"
          >
            {t.listings.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              lang={lang}
              currency={currency}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
