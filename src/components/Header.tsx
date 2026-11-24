import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Language } from '../types';

export type PageView = 'home' | 'listings' | 'admin';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  activeView: PageView;
  onNavigate: (view: PageView, sectionId?: string) => void;
  onOpenQuickBooking: () => void;
}

const LOGO_URL = '/src/assets/images/golden_samui_logo_1795277392919.jpg';

export function Header({
  lang,
  onToggleLang,
  activeView,
  onNavigate,
  onOpenQuickBooking
}: HeaderProps) {
  const t = TRANSLATIONS[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view: PageView, sectionId?: string) => {
    setMobileOpen(false);
    onNavigate(view, sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Zone */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A17415] rounded-md"
        >
          <img
            src={LOGO_URL}
            alt="Golden Samui Real Estate"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded object-cover border border-[#C59B27]/40 shrink-0"
          />
          <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-[#171614] whitespace-nowrap shrink-0">
            {t.brand}
          </span>
        </button>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              activeView === 'home'
                ? 'text-[#171614] border-[#B8860B]'
                : 'border-transparent hover:text-[#171614] hover:border-stone-300'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            type="button"
            onClick={() => handleNav('listings')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              activeView === 'listings'
                ? 'text-[#171614] border-[#B8860B]'
                : 'border-transparent hover:text-[#171614] hover:border-stone-300'
            }`}
          >
            {t.nav.listings}
          </button>
          <button
            type="button"
            onClick={() => handleNav('home', 'services-section')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#171614] hover:border-stone-300 transition-colors cursor-pointer"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => handleNav('home', 'contact-section')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#171614] hover:border-stone-300 transition-colors cursor-pointer"
          >
            {t.nav.contact}
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              activeView === 'admin'
                ? 'text-[#171614] border-[#B8860B]'
                : 'border-transparent hover:text-[#171614] hover:border-stone-300'
            }`}
          >
            {t.nav.admin}
          </button>
        </nav>

        {/* Zone 3: Language toggle + Single Primary CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
            <button
              type="button"
              onClick={() => onToggleLang('de')}
              className={`px-2 py-1 rounded cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                lang === 'de' ? 'text-[#171614] font-semibold bg-stone-200/70' : 'hover:text-[#171614]'
              }`}
            >
              DE
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                lang === 'en' ? 'text-[#171614] font-semibold bg-stone-200/70' : 'hover:text-[#171614]'
              }`}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenQuickBooking}
            className="px-4 py-2.5 text-sm font-medium bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.bookViewing}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleLang(lang === 'de' ? 'en' : 'de')}
            className="px-2.5 py-2 text-xs font-semibold text-[#171614] border border-stone-300 rounded-md whitespace-nowrap shrink-0"
          >
            {lang === 'de' ? 'EN' : 'DE'}
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2.5 text-[#171614] hover:bg-stone-200/60 rounded-lg"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF9F6] px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#171614] hover:bg-stone-200/50 rounded-md"
          >
            {t.nav.home}
          </button>
          <button
            type="button"
            onClick={() => handleNav('listings')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#171614] hover:bg-stone-200/50 rounded-md"
          >
            {t.nav.listings}
          </button>
          <button
            type="button"
            onClick={() => handleNav('home', 'services-section')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#171614] hover:bg-stone-200/50 rounded-md"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => handleNav('home', 'contact-section')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#171614] hover:bg-stone-200/50 rounded-md"
          >
            {t.nav.contact}
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#171614] hover:bg-stone-200/50 rounded-md"
          >
            {t.nav.admin}
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenQuickBooking();
              }}
              className="w-full px-4 py-2.5 text-sm font-medium bg-[#171614] text-white rounded-lg"
            >
              {t.nav.bookViewing}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
