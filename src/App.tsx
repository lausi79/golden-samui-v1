import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Header, type PageView } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ListingsPage, type SortOption } from './components/ListingsPage';
import { PropertyModal } from './components/PropertyModal';
import type { Currency, Language, LandTenure, Property, PropertyCategory } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('gs_lang');
      return saved === 'en' ? 'en' : 'de';
    } catch {
      return 'de';
    }
  });
  const [currency, setCurrency] = useState<Currency>('THB');
  const [activeView, setActiveView] = useState<PageView>('home');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Listings filter state
  const [filterCategory, setFilterCategory] = useState<PropertyCategory | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterMinBeds, setFilterMinBeds] = useState<number>(0);
  const [filterTenure, setFilterTenure] = useState<LandTenure | 'all'>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterSort, setFilterSort] = useState<SortOption>('featured');

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (Array.isArray(data.properties)) {
        setProperties(data.properties);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleToggleLang = (nextLang: Language) => {
    setLang(nextLang);
    try {
      localStorage.setItem('gs_lang', nextLang);
    } catch {
      // Ignore storage errors
    }
  };

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const p of properties) {
      if (p.location) set.add(p.location);
    }
    return Array.from(set).sort();
  }, [properties]);

  const handleNavigate = (view: PageView, sectionId?: string) => {
    setActiveView(view);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBrowseCategory = (cat: PropertyCategory | 'all') => {
    setFilterCategory(cat);
    if (cat !== 'sale' && cat !== 'all') {
      setFilterTenure('all');
    }
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyQuickFilter = (q: {
    category: PropertyCategory | 'all';
    location: string;
    minBeds: number;
    search: string;
  }) => {
    setFilterCategory(q.category);
    setFilterLocation(q.location);
    setFilterMinBeds(q.minBeds);
    setFilterSearch(q.search);
    setFilterTenure('all');
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setFilterCategory('all');
    setFilterLocation('all');
    setFilterMinBeds(0);
    setFilterTenure('all');
    setFilterSearch('');
    setFilterSort('featured');
  };

  const handleOpenQuickBooking = () => {
    const firstAvailable = properties.find((p) => p.status === 'available') || properties[0];
    if (firstAvailable) {
      setSelectedProperty(firstAvailable);
    } else {
      handleNavigate('home', 'contact-section');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#171614]">
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenQuickBooking={handleOpenQuickBooking}
      />

      <main className="flex-1">
        {loading && activeView !== 'admin' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-sm text-stone-500">
            {lang === 'de' ? 'Lade Immobilien auf Koh Samui...' : 'Loading Koh Samui properties...'}
          </div>
        ) : activeView === 'home' ? (
          <LandingPage
            lang={lang}
            currency={currency}
            properties={properties}
            locations={locations}
            onApplyQuickFilter={handleApplyQuickFilter}
            onBrowseCategory={handleBrowseCategory}
            onSelectProperty={setSelectedProperty}
          />
        ) : activeView === 'listings' ? (
          <ListingsPage
            lang={lang}
            currency={currency}
            onChangeCurrency={setCurrency}
            properties={properties}
            locations={locations}
            category={filterCategory}
            onChangeCategory={setFilterCategory}
            location={filterLocation}
            onChangeLocation={setFilterLocation}
            minBeds={filterMinBeds}
            onChangeMinBeds={setFilterMinBeds}
            tenure={filterTenure}
            onChangeTenure={setFilterTenure}
            search={filterSearch}
            onChangeSearch={setFilterSearch}
            sort={filterSort}
            onChangeSort={setFilterSort}
            onResetFilters={handleResetFilters}
            onSelectProperty={setSelectedProperty}
          />
        ) : (
          <AdminDashboard lang={lang} onPropertiesUpdated={fetchProperties} />
        )}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} onBrowseCategory={handleBrowseCategory} />

      <PropertyModal
        key={selectedProperty?.id || 'closed'}
        property={selectedProperty}
        lang={lang}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
