export type Language = 'de' | 'en';
export type Currency = 'THB' | 'EUR';

export type PropertyCategory = 'short_term' | 'long_term' | 'sale';
export type LandTenure = 'freehold' | 'leasehold' | 'both' | 'not_applicable';
export type PropertyStatus = 'available' | 'reserved' | 'sold';
export type PriceUnit = 'night' | 'month' | 'total';

export interface Property {
  id: string;
  slug: string;
  category: PropertyCategory;
  status: PropertyStatus;
  featured: boolean;
  sourcePartner?: string;
  location: string;
  title_de: string;
  title_en: string;
  subtitle_de: string;
  subtitle_en: string;
  description_de: string;
  description_en: string;
  highlights_de: string[];
  highlights_en: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  livingAreaSqm: number;
  landAreaSqm: number;
  priceThb: number;
  priceUnit: PriceUnit;
  landTenure: LandTenure;
  leaseYears?: number;
  beachDistanceMeters?: number;
  imageUrl: string;
  galleryUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export type InquiryType = 'short_term_booking' | 'viewing' | 'general_contact';
export type InquiryStatus = 'new' | 'confirmed' | 'completed' | 'archived';
export type ViewingFormat = 'in_person' | 'video';

export interface Inquiry {
  id: string;
  type: InquiryType;
  propertyId?: string;
  propertyTitle?: string;
  propertyCategory?: PropertyCategory;
  name: string;
  email: string;
  phone: string;
  language: Language;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  viewingDate?: string;
  viewingTime?: string;
  viewingFormat?: ViewingFormat;
  preferredTenure?: 'freehold' | 'leasehold' | 'undecided';
  addOns?: string[];
  estimatedTotalThb?: number;
  message: string;
  status: InquiryStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreData {
  adminPasswordHash: string | null;
  properties: Property[];
  inquiries: Inquiry[];
}

export interface UploadResult {
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  originalSizeBytes: number;
  format: string;
}
