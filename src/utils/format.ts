import type { Currency, Language, LandTenure, Property } from '../types';

export const THB_PER_EUR = 37;

export function formatPrice(priceThb: number, currency: Currency, lang: Language): string {
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  if (currency === 'EUR') {
    const eur = Math.round(priceThb / THB_PER_EUR);
    return `€${eur.toLocaleString(locale)}`;
  }
  return `฿${Math.round(priceThb).toLocaleString(locale)}`;
}

export function formatSecondaryPrice(priceThb: number, currency: Currency, lang: Language): string {
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  if (currency === 'EUR') {
    return `฿${Math.round(priceThb).toLocaleString(locale)}`;
  }
  const eur = Math.round(priceThb / THB_PER_EUR);
  return `~€${eur.toLocaleString(locale)}`;
}

export function getTenureLabel(tenure: LandTenure, lang: Language): string {
  if (tenure === 'freehold') {
    return lang === 'de' ? 'Grundstückskauf (Freehold / Chanote)' : 'Land Purchase (Freehold / Chanote)';
  }
  if (tenure === 'leasehold') {
    return lang === 'de' ? 'Grundstücksmiete (30J Leasehold)' : 'Land Lease (30-Yr Leasehold)';
  }
  if (tenure === 'both') {
    return lang === 'de' ? 'Kauf oder Pacht wählbar' : 'Purchase or Lease Optional';
  }
  return '';
}

export function getPropertyTitle(p: Property, lang: Language): string {
  return lang === 'de' ? p.title_de : p.title_en;
}

export function getPropertySubtitle(p: Property, lang: Language): string {
  return lang === 'de' ? p.subtitle_de : p.subtitle_en;
}

export function getPropertyDescription(p: Property, lang: Language): string {
  return lang === 'de' ? p.description_de : p.description_en;
}

export function getPropertyHighlights(p: Property, lang: Language): string[] {
  return lang === 'de' ? p.highlights_de : p.highlights_en;
}
