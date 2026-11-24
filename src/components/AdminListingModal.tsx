import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type {
  Language,
  LandTenure,
  PriceUnit,
  Property,
  PropertyCategory,
  PropertyStatus,
  UploadResult
} from '../types';
import { PropertyImage } from './PropertyImage';

interface AdminListingModalProps {
  lang: Language;
  token: string;
  initialProperty: Property | null;
  onClose: () => void;
  onSaved: (property: Property, isNew: boolean) => void;
}

export function AdminListingModal({
  lang,
  token,
  initialProperty,
  onClose,
  onSaved
}: AdminListingModalProps) {
  const t = TRANSLATIONS[lang];
  const isEdit = Boolean(initialProperty);

  const [category, setCategory] = useState<PropertyCategory>(initialProperty?.category || 'short_term');
  const [status, setStatus] = useState<PropertyStatus>(initialProperty?.status || 'available');
  const [featured, setFeatured] = useState<boolean>(initialProperty?.featured ?? false);
  const [location, setLocation] = useState<string>(initialProperty?.location || 'Bophut');
  const [sourcePartner, setSourcePartner] = useState<string>(
    initialProperty?.sourcePartner || 'Rockstar Villas (rockstarvillas.com)'
  );
  const [titleDe, setTitleDe] = useState<string>(initialProperty?.title_de || '');
  const [titleEn, setTitleEn] = useState<string>(initialProperty?.title_en || '');
  const [subtitleDe, setSubtitleDe] = useState<string>(initialProperty?.subtitle_de || '');
  const [subtitleEn, setSubtitleEn] = useState<string>(initialProperty?.subtitle_en || '');
  const [descriptionDe, setDescriptionDe] = useState<string>(initialProperty?.description_de || '');
  const [descriptionEn, setDescriptionEn] = useState<string>(initialProperty?.description_en || '');
  const [bedrooms, setBedrooms] = useState<number>(initialProperty?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState<number>(initialProperty?.bathrooms ?? 3);
  const [maxGuests, setMaxGuests] = useState<number>(initialProperty?.maxGuests ?? 6);
  const [livingAreaSqm, setLivingAreaSqm] = useState<number>(initialProperty?.livingAreaSqm ?? 240);
  const [landAreaSqm, setLandAreaSqm] = useState<number>(initialProperty?.landAreaSqm ?? 480);
  const [priceThb, setPriceThb] = useState<number>(initialProperty?.priceThb ?? 14000);
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(initialProperty?.priceUnit || 'night');
  const [landTenure, setLandTenure] = useState<LandTenure>(initialProperty?.landTenure || 'not_applicable');
  const [amenitiesText, setAmenitiesText] = useState<string>(
    (initialProperty?.amenities || ['Private Pool', 'Sea View', 'Fiber Wi-Fi']).join(', ')
  );
  const [imageUrl, setImageUrl] = useState<string>(
    initialProperty?.imageUrl || '/src/assets/images/villa_bob_dylan_1795277391069.jpg'
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialProperty?.galleryUrls || ['/src/assets/images/villa_bob_dylan_1795277391069.jpg']
  );

  const [uploading, setUploading] = useState(false);
  const [uploadMeta, setUploadMeta] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleCategoryChange = (nextCat: PropertyCategory) => {
    setCategory(nextCat);
    if (!isEdit) {
      if (nextCat === 'short_term') {
        setPriceUnit('night');
        setLandTenure('not_applicable');
        setSourcePartner('Rockstar Villas (rockstarvillas.com)');
      } else if (nextCat === 'long_term') {
        setPriceUnit('month');
        setLandTenure('not_applicable');
        setSourcePartner('Golden Samui Real Estate');
      } else {
        setPriceUnit('total');
        setLandTenure('freehold');
        setSourcePartner('Golden Samui Real Estate');
      }
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
      } else {
        const result = data as UploadResult;
        setUploadMeta(result);
        setImageUrl(result.url);
        setGalleryUrls((prev) => [result.url, ...prev.filter((u) => u !== result.url)]);
      }
    } catch {
      setUploadError(lang === 'de' ? 'Bild-Upload fehlgeschlagen.' : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const payload = {
        category,
        status,
        featured,
        location,
        sourcePartner,
        title_de: titleDe,
        title_en: titleEn || titleDe,
        subtitle_de: subtitleDe,
        subtitle_en: subtitleEn || subtitleDe,
        description_de: descriptionDe,
        description_en: descriptionEn || descriptionDe,
        bedrooms,
        bathrooms,
        maxGuests,
        livingAreaSqm,
        landAreaSqm,
        priceThb,
        priceUnit,
        landTenure: category === 'sale' ? landTenure : 'not_applicable',
        amenities: amenitiesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        imageUrl,
        galleryUrls: galleryUrls.length > 0 ? galleryUrls : [imageUrl]
      };

      const url = isEdit ? `/api/admin/properties/${initialProperty!.id}` : '/api/admin/properties';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || 'Failed to save listing');
      } else {
        onSaved(data.property as Property, !isEdit);
      }
    } catch {
      setSaveError(lang === 'de' ? 'Speichern fehlgeschlagen.' : 'Failed to save listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-[#171614]">
            {isEdit
              ? lang === 'de'
                ? 'Inserat bearbeiten'
                : 'Edit Listing'
              : lang === 'de'
                ? 'Neues Inserat anlegen'
                : 'Create New Listing'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-[#171614] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload & Server-Side Sharp Auto-Scaling */}
          <div className="bg-[#FAF9F6] border border-stone-200 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#171614]">{t.admin.uploadTitle}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{t.admin.uploadHint}</p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#171614] text-white hover:bg-[#2B2823] rounded-lg cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? t.admin.uploading : lang === 'de' ? 'Foto wählen' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-36 h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-200 shrink-0">
                <PropertyImage src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs text-stone-600 min-w-0 flex-1">
                <div className="font-mono truncate text-[#171614]">{imageUrl}</div>
                {uploadMeta && (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 font-medium tabular-nums">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {t.admin.uploadReady}: {uploadMeta.width}×{uploadMeta.height}px ·{' '}
                      {uploadMeta.format.toUpperCase()} · {Math.round(uploadMeta.sizeBytes / 1024)} KB (
                      {lang === 'de' ? 'vorher' : 'from'}{' '}
                      {Math.round(uploadMeta.originalSizeBytes / 1024)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Core Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.quickFilter.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as PropertyCategory)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              >
                <option value="short_term">{t.categories.short_term}</option>
                <option value="long_term">{t.categories.long_term}</option>
                <option value="sale">{t.categories.sale}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              >
                <option value="available">{t.listings.statusLabels.available}</option>
                <option value="reserved">{t.listings.statusLabels.reserved}</option>
                <option value="sold">{t.listings.statusLabels.sold}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.quickFilter.locationLabel}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              >
                {['Choeng Mon', 'Bophut', 'Bangrak', 'Plai Laem', 'Chaweng Noi', 'Maenam', 'Lamai'].map(
                  (loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-[#171614] cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-stone-300"
                />
                <span>{lang === 'de' ? 'Auf Startseite hervorheben' : 'Featured on Home'}</span>
              </label>
            </div>
          </div>

          {/* Bilingual Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Titel (Deutsch) *</label>
              <input
                type="text"
                required
                value={titleDe}
                onChange={(e) => setTitleDe(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Title (English) *</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Kurzbeschreibung (DE)
              </label>
              <input
                type="text"
                value={subtitleDe}
                onChange={(e) => setSubtitleDe(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Subtitle (EN)</label>
              <input
                type="text"
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* Specs & Pricing */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 tabular-nums">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{t.listings.beds}</label>
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{t.listings.baths}</label>
              <input
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{t.listings.guests}</label>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.listings.livingArea} (m²)
              </label>
              <input
                type="number"
                min={0}
                value={livingAreaSqm}
                onChange={(e) => setLivingAreaSqm(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.listings.landArea} (m²)
              </label>
              <input
                type="number"
                min={0}
                value={landAreaSqm}
                onChange={(e) => setLandAreaSqm(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Preis (THB ฿)</label>
              <input
                type="number"
                min={0}
                value={priceThb}
                onChange={(e) => setPriceThb(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {lang === 'de' ? 'Preiseinheit' : 'Price Unit'}
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              >
                <option value="night">{lang === 'de' ? 'Pro Nacht' : 'Per Night'}</option>
                <option value="month">{lang === 'de' ? 'Pro Monat' : 'Per Month'}</option>
                <option value="total">{lang === 'de' ? 'Kaufpreis gesamt' : 'Total Sale Price'}</option>
              </select>
            </div>

            {category === 'sale' && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {lang === 'de' ? 'Grundstücksart' : 'Land Tenure'}
                </label>
                <select
                  value={landTenure}
                  onChange={(e) => setLandTenure(e.target.value as LandTenure)}
                  className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                >
                  <option value="freehold">{t.tenure.freehold}</option>
                  <option value="leasehold">{t.tenure.leasehold}</option>
                  <option value="both">{t.tenure.both}</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Partner / Quelle</label>
              <input
                type="text"
                value={sourcePartner}
                onChange={(e) => setSourcePartner(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Beschreibung (Deutsch)
              </label>
              <textarea
                rows={4}
                value={descriptionDe}
                onChange={(e) => setDescriptionDe(e.target.value)}
                className="w-full p-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Description (English)
              </label>
              <textarea
                rows={4}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full p-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              {t.modal.amenities} (comma-separated)
            </label>
            <input
              type="text"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
            />
          </div>

          {saveError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
              {saveError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              {t.admin.cancel}
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-5 py-2.5 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] disabled:opacity-50 rounded-lg cursor-pointer"
            >
              {saving ? '...' : t.admin.saveListing}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
