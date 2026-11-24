import { useState, type FormEvent } from 'react';
import { Check, CheckCircle2, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Currency, Language, Property, ViewingFormat } from '../types';
import {
  formatPrice,
  formatSecondaryPrice,
  getPropertyDescription,
  getPropertyHighlights,
  getPropertyTitle,
  getTenureLabel
} from '../utils/format';
import { PropertyImage } from './PropertyImage';

interface PropertyModalProps {
  property: Property | null;
  lang: Language;
  currency: Currency;
  onClose: () => void;
}

export function PropertyModal({ property, lang, currency, onClose }: PropertyModalProps) {
  const t = TRANSLATIONS[lang];
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Booking / Viewing form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('2026-12-10');
  const [checkOut, setCheckOut] = useState('2026-12-17');
  const [guests, setGuests] = useState(2);
  const [viewingDate, setViewingDate] = useState('2026-11-28');
  const [viewingTime, setViewingTime] = useState('11:00');
  const [viewingFormat, setViewingFormat] = useState<ViewingFormat>('in_person');
  const [preferredTenure, setPreferredTenure] = useState<'freehold' | 'leasehold' | 'undecided'>('undecided');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!property) return null;

  const isShortTerm = property.category === 'short_term';
  const gallery = property.galleryUrls.length > 0 ? property.galleryUrls : [property.imageUrl];
  const currentImg = gallery[activePhotoIdx] || property.imageUrl;

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 0;
  })();

  const estimatedTotalThb = isShortTerm && nights > 0 ? nights * property.priceThb : 0;

  const toggleAddOn = (key: string) => {
    setAddOns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isShortTerm ? 'short_term_booking' : 'viewing',
          propertyId: property.id,
          propertyTitle: property.title_en,
          name,
          email,
          phone,
          language: lang,
          ...(isShortTerm
            ? {
                checkIn,
                checkOut,
                guests,
                addOns
              }
            : {
                viewingDate,
                viewingTime,
                viewingFormat,
                preferredTenure: property.category === 'sale' ? preferredTenure : undefined
              }),
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(
        lang === 'de'
          ? 'Verbindungsfehler. Bitte versuchen Sie es erneut.'
          : 'Connection error. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const priceSuffix =
    property.priceUnit === 'night'
      ? ` ${t.listings.perNight}`
      : property.priceUnit === 'month'
        ? ` ${t.listings.perMonth}`
        : '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] border border-stone-200 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-medium text-stone-500">
              <span className="text-[#8A610C] font-semibold">{t.categoryShort[property.category]}</span>
              <span className="mx-1.5">·</span>
              <span>{property.location}, Koh Samui</span>
              {property.sourcePartner && (
                <>
                  <span className="mx-1.5">·</span>
                  <span>{property.sourcePartner}</span>
                </>
              )}
            </div>
            <h2 className="font-display font-semibold text-lg sm:text-xl text-[#171614] truncate">
              {getPropertyTitle(property, lang)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.close}
            className="p-2 text-stone-600 hover:text-[#171614] hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual Showcase & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-200 border border-stone-200">
                <PropertyImage
                  src={currentImg}
                  alt={getPropertyTitle(property, lang)}
                  className="w-full h-full object-cover"
                />
              </div>

              {gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {gallery.map((url, idx) => (
                    <button
                      key={url + idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                        idx === activePhotoIdx ? 'border-[#B8860B]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <PropertyImage src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-stone-200 rounded-xl p-4 tabular-nums">
              <div>
                <div className="text-xs text-stone-500">{t.listings.beds}</div>
                <div className="font-display font-semibold text-base text-[#171614]">{property.bedrooms}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500">{t.listings.baths}</div>
                <div className="font-display font-semibold text-base text-[#171614]">{property.bathrooms}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500">{t.listings.livingArea}</div>
                <div className="font-display font-semibold text-base text-[#171614]">{property.livingAreaSqm} m²</div>
              </div>
              <div>
                <div className="text-xs text-stone-500">
                  {property.landAreaSqm > 0 ? t.listings.landArea : t.listings.guests}
                </div>
                <div className="font-display font-semibold text-base text-[#171614]">
                  {property.landAreaSqm > 0 ? `${property.landAreaSqm} m²` : property.maxGuests}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                {getPropertyDescription(property, lang)}
              </p>
            </div>

            {/* Land Tenure Notice for Sales */}
            {property.category === 'sale' && (
              <div className="bg-[#F2EFE9] border border-stone-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-semibold text-[#8A610C]">
                  {getTenureLabel(property.landTenure, lang)}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {property.landTenure === 'freehold'
                    ? t.tenureExplainer.freeholdDesc
                    : property.landTenure === 'leasehold'
                      ? t.tenureExplainer.leaseholdDesc
                      : `${t.tenureExplainer.freeholdDesc} / ${t.tenureExplainer.leaseholdDesc}`}
                </p>
              </div>
            )}

            {/* Highlights */}
            {getPropertyHighlights(property, lang).length > 0 && (
              <div className="space-y-2.5">
                <h3 className="font-display font-semibold text-sm text-[#171614]">
                  {t.modal.highlights}
                </h3>
                <ul className="space-y-2">
                  {getPropertyHighlights(property, lang).map((hl) => (
                    <li key={hl} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <Check className="w-4 h-4 text-[#8A610C] mt-0.5 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Amenities (unboxed clean inline list) */}
            {property.amenities.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-sm text-[#171614]">
                  {t.modal.amenities}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {property.amenities.join(' · ')}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Booking / Viewing Request Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 sticky top-20">
              <div className="pb-4 border-b border-stone-100 flex items-baseline justify-between gap-3 tabular-nums">
                <div>
                  <div className="font-display font-semibold text-2xl text-[#171614]">
                    {formatPrice(property.priceThb, currency, lang)}
                    <span className="text-sm font-normal text-stone-500">{priceSuffix}</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {formatSecondaryPrice(property.priceThb, currency, lang)}
                    {priceSuffix}
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#8A610C]">
                  {t.listings.statusLabels[property.status]}
                </span>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-display font-semibold text-lg text-[#171614]">
                    {t.modal.successTitle}
                  </h4>
                  <p className="text-sm text-stone-600">{t.modal.successDesc}</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-xs font-semibold bg-[#171614] text-white rounded-lg cursor-pointer"
                  >
                    {t.modal.bookAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display font-semibold text-base text-[#171614]">
                    {isShortTerm ? t.modal.bookTitleShort : t.modal.bookTitleViewing}
                  </h3>

                  {isShortTerm ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {t.modal.checkIn} *
                          </label>
                          <input
                            type="date"
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full h-10 px-2.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {t.modal.checkOut} *
                          </label>
                          <input
                            type="date"
                            required
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full h-10 px-2.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          {t.modal.guestsCount} (max. {property.maxGuests})
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={property.maxGuests}
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg tabular-nums"
                        />
                      </div>

                      {/* Rockstar Villas Concierge Add-Ons */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-stone-600">{t.modal.addOnsLabel}</div>
                        <div className="space-y-1.5 text-xs text-stone-700">
                          {[
                            { id: 'airport_transfer', label: t.modal.addOnTransfer },
                            { id: 'car_rental', label: t.modal.addOnCar },
                            { id: 'scooter_rental', label: t.modal.addOnScooter }
                          ].map((opt) => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={addOns.includes(opt.id)}
                                onChange={() => toggleAddOn(opt.id)}
                                className="rounded border-stone-300 text-[#8A610C] focus:ring-[#A17415]"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {nights > 0 && (
                        <div className="bg-[#F2EFE9] rounded-lg p-3 flex items-center justify-between text-sm tabular-nums">
                          <span className="text-stone-700">
                            {nights} {t.modal.nights}
                          </span>
                          <span className="font-semibold text-[#171614]">
                            {formatPrice(estimatedTotalThb, currency, lang)}{' '}
                            <span className="text-xs font-normal text-stone-500">
                              ({formatSecondaryPrice(estimatedTotalThb, currency, lang)})
                            </span>
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {t.modal.viewingDate} *
                          </label>
                          <input
                            type="date"
                            required
                            value={viewingDate}
                            onChange={(e) => setViewingDate(e.target.value)}
                            className="w-full h-10 px-2.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {t.modal.viewingTime}
                          </label>
                          <select
                            value={viewingTime}
                            onChange={(e) => setViewingTime(e.target.value)}
                            className="w-full h-10 px-2.5 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                          >
                            <option value="09:30">09:30</option>
                            <option value="11:00">11:00</option>
                            <option value="14:00">14:00</option>
                            <option value="16:30">16:30</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          {t.modal.viewingFormat}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingFormat('in_person')}
                            className={`h-10 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                              viewingFormat === 'in_person'
                                ? 'bg-[#171614] text-white border-[#171614]'
                                : 'bg-[#FAF9F6] text-stone-700 border-stone-200'
                            }`}
                          >
                            {t.modal.inPerson}
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingFormat('video')}
                            className={`h-10 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                              viewingFormat === 'video'
                                ? 'bg-[#171614] text-white border-[#171614]'
                                : 'bg-[#FAF9F6] text-stone-700 border-stone-200'
                            }`}
                          >
                            {t.modal.videoCall}
                          </button>
                        </div>
                      </div>

                      {property.category === 'sale' && (
                        <div>
                          <label className="block text-xs font-medium text-stone-600 mb-1">
                            {t.modal.tenureInterest}
                          </label>
                          <select
                            value={preferredTenure}
                            onChange={(e) =>
                              setPreferredTenure(e.target.value as 'freehold' | 'leasehold' | 'undecided')
                            }
                            className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                          >
                            <option value="undecided">{t.modal.tenureUndecided}</option>
                            <option value="freehold">{t.tenure.freehold}</option>
                            <option value="leasehold">{t.tenure.leasehold}</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        {t.modal.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        {t.modal.emailLabel} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        {t.modal.phoneLabel} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 / +66..."
                        className="w-full h-10 px-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        {t.modal.messageLabel}
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          isShortTerm ? t.modal.messagePlaceholderShort : t.modal.messagePlaceholderViewing
                        }
                        className="w-full p-3 text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 text-sm font-semibold bg-[#171614] text-white hover:bg-[#2B2823] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {submitting
                      ? t.modal.submitting
                      : isShortTerm
                        ? t.modal.submitBooking
                        : t.modal.submitViewing}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
