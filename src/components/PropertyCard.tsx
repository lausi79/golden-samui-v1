import { ArrowUpRight } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Currency, Language, Property } from '../types';
import {
  formatPrice,
  formatSecondaryPrice,
  getPropertySubtitle,
  getPropertyTitle,
  getTenureLabel
} from '../utils/format';
import { PropertyImage } from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  lang: Language;
  currency: Currency;
  onSelect: (property: Property) => void;
}

export function PropertyCard({ property, lang, currency, onSelect }: PropertyCardProps) {
  const t = TRANSLATIONS[lang];
  const title = getPropertyTitle(property, lang);
  const subtitle = getPropertySubtitle(property, lang);
  const categoryLabel = t.categoryShort[property.category];
  const tenureLabel = property.category === 'sale' ? getTenureLabel(property.landTenure, lang) : '';

  const priceSuffix =
    property.priceUnit === 'night'
      ? ` ${t.listings.perNight}`
      : property.priceUnit === 'month'
        ? ` ${t.listings.perMonth}`
        : '';

  return (
    <article
      onClick={() => onSelect(property)}
      className="group bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:border-[#B8860B]/60 transition-colors"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <PropertyImage
          src={property.imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Unboxed typographic metadata kicker */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-stone-500">
            <span className="text-[#8A610C] font-semibold">{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{property.location}</span>
            {property.status !== 'available' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-semibold">
                  {t.listings.statusLabels[property.status]}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display font-semibold text-lg leading-snug text-[#171614] group-hover:text-[#8A610C] transition-colors">
            {title}
          </h3>

          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{subtitle}</p>

          {tenureLabel && (
            <p className="text-xs font-medium text-[#171614] pt-0.5">{tenureLabel}</p>
          )}
        </div>

        <div className="pt-4 border-t border-stone-100 space-y-3">
          {/* Specs row with tabular numerals */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500 tabular-nums">
            <span>
              {property.bedrooms} {t.listings.beds}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {property.bathrooms} {t.listings.baths}
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.livingAreaSqm} m²</span>
            {property.landAreaSqm > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {property.landAreaSqm} m² {t.listings.landArea}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="tabular-nums">
              <div className="font-display font-semibold text-base text-[#171614]">
                {formatPrice(property.priceThb, currency, lang)}
                <span className="text-xs font-normal text-stone-500">{priceSuffix}</span>
              </div>
              <div className="text-xs text-stone-500">
                {formatSecondaryPrice(property.priceThb, currency, lang)}
                {priceSuffix}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(property);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#FAF9F6] text-[#171614] border border-stone-300 rounded-lg group-hover:bg-[#171614] group-hover:text-white group-hover:border-[#171614] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>
                {property.category === 'short_term'
                  ? t.listings.bookOrDetails
                  : t.listings.requestViewing}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
