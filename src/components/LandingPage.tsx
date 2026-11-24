import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, MapPin, Clock, Search } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Currency, Language, Property, PropertyCategory } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertyImage } from './PropertyImage';

interface QuickFilterValues {
  category: PropertyCategory | 'all';
  location: string;
  minBeds: number;
  search: string;
}

interface LandingPageProps {
  lang: Language;
  currency: Currency;
  properties: Property[];
  locations: string[];
  onApplyQuickFilter: (filters: QuickFilterValues) => void;
  onBrowseCategory: (category: PropertyCategory | 'all') => void;
  onSelectProperty: (property: Property) => void;
}

const HERO_IMG = '/src/assets/images/hero_samui_villa_1795277391956.jpg';
const LOGO_IMG = '/src/assets/images/golden_samui_logo_1795277392919.jpg';

export function LandingPage({
  lang,
  currency,
  properties,
  locations,
  onApplyQuickFilter,
  onBrowseCategory,
  onSelectProperty
}: LandingPageProps) {
  const t = TRANSLATIONS[lang];

  // Quick filter bar state
  const [qfCategory, setQfCategory] = useState<PropertyCategory | 'all'>('all');
  const [qfLocation, setQfLocation] = useState('all');
  const [qfMinBeds, setQfMinBeds] = useState(0);
  const [qfSearch, setQfSearch] = useState('');

  // Direct contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactInterest, setContactInterest] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);

  const handleQuickSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApplyQuickFilter({
      category: qfCategory,
      location: qfLocation,
      minBeds: qfMinBeds,
      search: qfSearch
    });
  };

  const handleServiceAction = (index: number) => {
    if (index === 0) onBrowseCategory('short_term');
    else if (index === 1) onBrowseCategory('long_term');
    else if (index === 2) onBrowseCategory('sale');
    else {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactSubmitting(true);
    try {
      const interestLabel =
        t.contact.interestOptions[contactInterest as keyof typeof t.contact.interestOptions] ||
        contactInterest;
      const preferredTenure =
        contactInterest === 'freehold'
          ? 'freehold'
          : contactInterest === 'leasehold'
            ? 'leasehold'
            : undefined;

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general_contact',
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          language: lang,
          preferredTenure,
          message: `[${interestLabel}] ${contactMessage}`.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setContactError(data.error || 'Submission failed');
      } else {
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
      }
    } catch {
      setContactError(
        lang === 'de'
          ? 'Verbindungsfehler. Bitte versuchen Sie es erneut.'
          : 'Connection error. Please try again.'
      );
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. Cinematic Hero Section */}
      <section className="relative bg-[#141311] text-white overflow-hidden">
        <div className="absolute inset-0">
          <PropertyImage
            src={HERO_IMG}
            alt="Koh Samui Luxury Infinity Villa"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141311]/90 via-[#141311]/65 to-[#141311]/35" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <p className="text-sm font-medium tracking-wide text-[#E2C067]">{t.hero.eyebrow}</p>

              <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight text-white text-balance max-w-2xl">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onBrowseCategory('all')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#141311] hover:bg-[#D4AD3B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-5 py-3.5 text-sm font-medium text-white border border-white/30 hover:border-white/70 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.hero.secondaryCta}
                </button>
              </div>
            </div>

            {/* 3D Cast Gold Emblem Showcase */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
              <div className="bg-[#1A1815]/90 border border-[#C59B27]/40 rounded-xl p-4 max-w-[260px]">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#141311]">
                  <img
                    src={LOGO_IMG}
                    alt="Golden Samui Real Estate 3D Cast Gold Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-stone-300 mt-3 leading-relaxed">{t.hero.crestCaption}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick 4-Column Property Filter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <form
          onSubmit={handleQuickSubmit}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end shadow-sm"
        >
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t.quickFilter.categoryLabel}
            </label>
            <select
              value={qfCategory}
              onChange={(e) => setQfCategory(e.target.value as PropertyCategory | 'all')}
              className="w-full h-11 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg text-[#171614] focus:outline-none focus:border-[#A17415]"
            >
              <option value="all">{t.quickFilter.allCategories}</option>
              <option value="short_term">{t.categories.short_term}</option>
              <option value="long_term">{t.categories.long_term}</option>
              <option value="sale">{t.categories.sale}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t.quickFilter.locationLabel}
            </label>
            <select
              value={qfLocation}
              onChange={(e) => setQfLocation(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg text-[#171614] focus:outline-none focus:border-[#A17415]"
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
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t.quickFilter.bedroomsLabel}
            </label>
            <select
              value={qfMinBeds}
              onChange={(e) => setQfMinBeds(Number(e.target.value))}
              className="w-full h-11 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg text-[#171614] focus:outline-none focus:border-[#A17415]"
            >
              <option value={0}>{t.quickFilter.anyBeds}</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t.quickFilter.searchLabel}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={qfSearch}
                onChange={(e) => setQfSearch(e.target.value)}
                placeholder={t.quickFilter.searchPlaceholder}
                className="w-full h-11 pl-9 pr-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg text-[#171614] placeholder:text-stone-400 focus:outline-none focus:border-[#A17415]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-11 px-5 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.quickFilter.submit}
          </button>
        </form>
      </section>

      {/* 3. Services Section */}
      <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="text-sm font-semibold text-[#8A610C]">{t.services.eyebrow}</p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#171614] tracking-tight text-balance">
            {t.services.title}
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">{t.services.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {t.services.items.map((item, idx) => {
            const isWide = idx === 0 || idx === 2;
            return (
              <div
                key={item.num}
                className={`${
                  isWide ? 'md:col-span-7' : 'md:col-span-5'
                } bg-white border border-stone-200 rounded-xl p-7 flex flex-col justify-between gap-6`}
              >
                <div className="space-y-3">
                  <div className="font-mono text-sm font-semibold text-[#8A610C] tabular-nums">
                    {item.num}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-[#171614]">{item.title}</h3>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{item.desc}</p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleServiceAction(idx)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#171614] hover:text-[#8A610C] transition-colors cursor-pointer"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Land Tenure Explanation Bar */}
        <div className="mt-8 bg-[#F2EFE9] border border-stone-200 rounded-xl p-6 sm:p-8">
          <h3 className="font-display font-semibold text-lg text-[#171614] mb-4">
            {t.tenureExplainer.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#8A610C]">
                {t.tenureExplainer.freeholdTitle}
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                {t.tenureExplainer.freeholdDesc}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#8A610C]">
                {t.tenureExplainer.leaseholdTitle}
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                {t.tenureExplainer.leaseholdDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Residences */}
      <section className="bg-white border-y border-stone-200 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#8A610C]">{t.featured.eyebrow}</p>
              <h2 className="font-display font-semibold text-3xl text-[#171614] tracking-tight">
                {t.featured.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onBrowseCategory('all')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#171614] border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.featured.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                lang={lang}
                currency={currency}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Direct Contact Section */}
      <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm font-semibold text-[#8A610C]">{t.contact.eyebrow}</p>
            <h2 className="font-display font-semibold text-3xl text-[#171614] tracking-tight text-balance">
              {t.contact.title}
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">{t.contact.subtitle}</p>

            <div className="space-y-4 pt-2 border-t border-stone-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8A610C] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-stone-500">{t.contact.officeLabel}</div>
                  <div className="text-sm text-[#171614] mt-0.5">{t.contact.officeValue}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8A610C] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-stone-500">{t.contact.hoursLabel}</div>
                  <div className="text-sm text-[#171614] mt-0.5">{t.contact.hoursValue}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 sm:p-8">
            {contactSuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-11 h-11 text-emerald-700 mx-auto" />
                <h3 className="font-display font-semibold text-xl text-[#171614]">
                  {t.modal.successTitle}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">{t.contact.success}</p>
                <button
                  type="button"
                  onClick={() => setContactSuccess(false)}
                  className="px-5 py-2.5 text-sm font-medium bg-[#171614] text-white rounded-lg hover:bg-[#2B2823] transition-colors cursor-pointer"
                >
                  {t.modal.bookAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      {t.modal.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#A17415]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      {t.modal.emailLabel} *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#A17415]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      {t.modal.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+49 / +66..."
                      className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#A17415]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      {t.contact.interestLabel}
                    </label>
                    <select
                      value={contactInterest}
                      onChange={(e) => setContactInterest(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#A17415]"
                    >
                      <option value="short_term">{t.contact.interestOptions.short_term}</option>
                      <option value="long_term">{t.contact.interestOptions.long_term}</option>
                      <option value="freehold">{t.contact.interestOptions.freehold}</option>
                      <option value="leasehold">{t.contact.interestOptions.leasehold}</option>
                      <option value="general">{t.contact.interestOptions.general}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    {t.modal.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={t.modal.messagePlaceholderViewing}
                    className="w-full p-3.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#A17415]"
                  />
                </div>

                {contactError && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                    {contactError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  {contactSubmitting ? t.modal.submitting : t.contact.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
