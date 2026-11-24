import { TRANSLATIONS } from '../i18n';
import type { Language, PropertyCategory } from '../types';
import type { PageView } from './Header';

interface FooterProps {
  lang: Language;
  onNavigate: (view: PageView, sectionId?: string) => void;
  onBrowseCategory: (category: PropertyCategory | 'all') => void;
}

const LOGO_URL = '/src/assets/images/golden_samui_logo_1795277392919.jpg';

export function Footer({ lang, onNavigate, onBrowseCategory }: FooterProps) {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-[#171614] text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-stone-800">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={LOGO_URL}
                alt="Golden Samui Real Estate 3D Gold Emblem"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover border border-[#C59B27]/50 shrink-0"
              />
              <div>
                <div className="font-display font-semibold text-lg text-white">{t.brand}</div>
                <p className="text-xs text-stone-400 mt-1">{t.hero.eyebrow}</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">{t.footer.tagline}</p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <div className="text-sm font-semibold text-white">{t.nav.listings}</div>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onBrowseCategory('short_term')}
                  className="hover:text-[#E2C067] transition-colors cursor-pointer"
                >
                  {t.categories.short_term}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onBrowseCategory('long_term')}
                  className="hover:text-[#E2C067] transition-colors cursor-pointer"
                >
                  {t.categories.long_term}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onBrowseCategory('sale')}
                  className="hover:text-[#E2C067] transition-colors cursor-pointer"
                >
                  {t.categories.sale}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-sm font-semibold text-white">{t.contact.officeLabel}</div>
            <p className="text-sm text-stone-400 leading-relaxed">{t.contact.officeValue}</p>
            <p className="text-xs text-stone-400">{t.contact.hoursValue}</p>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="text-xs text-stone-400 hover:text-white underline underline-offset-4 pt-1 cursor-pointer"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span>
            © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </span>
          <span>Koh Samui · Surat Thani · Thailand</span>
        </div>
      </div>
    </footer>
  );
}
