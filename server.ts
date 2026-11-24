import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import type {
  Inquiry,
  InquiryStatus,
  InquiryType,
  LandTenure,
  PriceUnit,
  Property,
  PropertyCategory,
  PropertyStatus
} from './src/types.ts';
import {
  UPLOADS_DIR,
  createInquiry,
  createProperty,
  deleteInquiry,
  deleteProperty,
  getPropertyById,
  getStore,
  listInquiries,
  listProperties,
  setAdminPasswordHash,
  updateInquiry,
  updateProperty
} from './server/store.ts';

const PORT = Number(process.env.PORT) || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const app = express();
app.use(express.json({ limit: '4mb' }));

// Security helpers
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyScryptHash(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, hex] = parts;
  if (!salt || !hex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

function safeCompareStrings(a: string, b: string): boolean {
  const da = crypto.createHash('sha256').update(a).digest();
  const db = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(da, db);
}

function signToken(role: 'admin'): string {
  const payload = Buffer.from(
    JSON.stringify({
      role,
      exp: Date.now() + TOKEN_TTL_MS,
      jti: crypto.randomUUID()
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (!safeCompareStrings(sig, expectedSig)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function getAuthMode(): 'env' | 'claimed' | 'unclaimed' {
  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  if (envPass.length > 0) return 'env';
  if (getStore().adminPasswordHash) return 'claimed';
  return 'unclaimed';
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }
  next();
}

// Serve uploaded resized WebP images safely with path confinement
app.get('/uploads/:filename', (req: Request, res: Response) => {
  const rawName = String(req.params.filename || '');
  const safeName = path.basename(rawName);
  if (!/^[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png)$/i.test(safeName)) {
    res.status(400).json({ error: 'Invalid filename' });
    return;
  }
  const resolved = path.resolve(UPLOADS_DIR, safeName);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  if (!fs.existsSync(resolved)) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(resolved);
});

// Public Properties API
app.get('/api/properties', (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const location = typeof req.query.location === 'string' ? req.query.location : '';
  const tenure = typeof req.query.tenure === 'string' ? req.query.tenure : '';
  const minBeds = Number(req.query.minBeds || 0);
  const maxPrice = Number(req.query.maxPrice || 0);
  const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';

  let items = listProperties().filter((p) => p.status !== 'sold' || req.query.includeSold === 'true');
  if (category && ['short_term', 'long_term', 'sale'].includes(category)) {
    items = items.filter((p) => p.category === category);
  }
  if (location && location !== 'all') {
    items = items.filter((p) => p.location.toLowerCase() === location.toLowerCase());
  }
  if (tenure && tenure !== 'all') {
    items = items.filter((p) => p.landTenure === tenure || (tenure !== 'not_applicable' && p.landTenure === 'both'));
  }
  if (minBeds > 0) {
    items = items.filter((p) => p.bedrooms >= minBeds);
  }
  if (maxPrice > 0) {
    items = items.filter((p) => p.priceThb <= maxPrice);
  }
  if (search) {
    items = items.filter(
      (p) =>
        p.title_de.toLowerCase().includes(search) ||
        p.title_en.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search) ||
        p.description_de.toLowerCase().includes(search) ||
        p.description_en.toLowerCase().includes(search)
    );
  }
  res.json({ properties: items });
});

// Public Inquiry / Booking submission
app.post('/api/inquiries', (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const type = String(body.type || '') as InquiryType;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!['short_term_booking', 'viewing', 'general_contact'].includes(type)) {
    res.status(400).json({ error: 'Invalid inquiry type' });
    return;
  }
  if (name.length < 2 || name.length > 120) {
    res.status(400).json({ error: 'Please provide your full name' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return;
  }
  if (phone.length < 5 || phone.length > 40) {
    res.status(400).json({ error: 'Please provide a valid phone or WhatsApp number' });
    return;
  }

  let linkedProperty: Property | undefined;
  if (typeof body.propertyId === 'string' && body.propertyId.trim()) {
    linkedProperty = getPropertyById(body.propertyId.trim());
  }

  let estimatedTotalThb: number | undefined;
  const checkIn = typeof body.checkIn === 'string' ? body.checkIn : undefined;
  const checkOut = typeof body.checkOut === 'string' ? body.checkOut : undefined;
  if (type === 'short_term_booking') {
    if (!checkIn || !checkOut) {
      res.status(400).json({ error: 'Check-in and check-out dates are required for bookings' });
      return;
    }
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      res.status(400).json({ error: 'Check-out date must be after check-in date' });
      return;
    }
    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    if (linkedProperty && linkedProperty.priceUnit === 'night') {
      estimatedTotalThb = nights * linkedProperty.priceThb;
    }
  }

  if (type === 'viewing') {
    if (typeof body.viewingDate !== 'string' || !body.viewingDate.trim()) {
      res.status(400).json({ error: 'Preferred viewing date is required' });
      return;
    }
  }

  const now = new Date().toISOString();
  const inquiry: Inquiry = {
    id: `inq-${crypto.randomUUID().slice(0, 8)}`,
    type,
    propertyId: linkedProperty?.id,
    propertyTitle: linkedProperty?.title_en || (typeof body.propertyTitle === 'string' ? body.propertyTitle : undefined),
    propertyCategory: linkedProperty?.category,
    name,
    email,
    phone,
    language: body.language === 'en' ? 'en' : 'de',
    checkIn,
    checkOut,
    guests: typeof body.guests === 'number' && body.guests > 0 ? Math.min(20, Math.floor(body.guests)) : undefined,
    viewingDate: typeof body.viewingDate === 'string' ? body.viewingDate : undefined,
    viewingTime: typeof body.viewingTime === 'string' ? body.viewingTime : undefined,
    viewingFormat: body.viewingFormat === 'video' ? 'video' : body.viewingFormat === 'in_person' ? 'in_person' : undefined,
    preferredTenure:
      body.preferredTenure === 'freehold' || body.preferredTenure === 'leasehold' || body.preferredTenure === 'undecided'
        ? body.preferredTenure
        : undefined,
    addOns: Array.isArray(body.addOns)
      ? body.addOns.filter((a): a is string => typeof a === 'string').slice(0, 8)
      : [],
    estimatedTotalThb,
    message: message.slice(0, 2000),
    status: 'new',
    adminNotes: '',
    createdAt: now,
    updatedAt: now
  };

  createInquiry(inquiry);
  res.status(201).json({ inquiry });
});

// Admin Auth Routes
app.get('/api/admin/auth-status', (_req: Request, res: Response) => {
  const mode = getAuthMode();
  res.json({
    configured: mode !== 'unclaimed',
    mode
  });
});

app.post('/api/admin/setup', (req: Request, res: Response) => {
  const mode = getAuthMode();
  if (mode !== 'unclaimed') {
    res.status(409).json({ error: 'Admin password is already configured' });
    return;
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long' });
    return;
  }
  const hash = hashPassword(password);
  setAdminPasswordHash(hash);
  const token = signToken('admin');
  res.status(201).json({ token });
});

app.post('/api/admin/login', (req: Request, res: Response) => {
  const mode = getAuthMode();
  if (mode === 'unclaimed') {
    res.status(400).json({ error: 'Admin password not yet set up' });
    return;
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  let valid = false;
  if (mode === 'env') {
    valid = safeCompareStrings(password, (process.env.ADMIN_PASSWORD || '').trim());
  } else {
    const storedHash = getStore().adminPasswordHash;
    if (storedHash) {
      valid = verifyScryptHash(password, storedHash);
    }
  }

  if (!valid) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  const token = signToken('admin');
  res.json({ token });
});

// Admin Protected Routes: Image Upload with Automatic Scaling & WebP Conversion
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported image format. Please upload JPG, PNG, WebP, or AVIF.'));
    }
  }
});

app.post('/api/admin/upload', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded' });
    return;
  }

  try {
    const id = crypto.randomUUID().slice(0, 12);
    const mainFilename = `prop_${id}.webp`;
    const thumbFilename = `prop_${id}_thumb.webp`;
    const mainPath = path.resolve(UPLOADS_DIR, mainFilename);
    const thumbPath = path.resolve(UPLOADS_DIR, thumbFilename);

    // Ensure target paths stay confined inside UPLOADS_DIR
    if (!mainPath.startsWith(UPLOADS_DIR + path.sep) || !thumbPath.startsWith(UPLOADS_DIR + path.sep)) {
      res.status(403).json({ error: 'Invalid upload destination' });
      return;
    }

    const mainBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({
        width: 1600,
        height: 1066,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    await fs.promises.writeFile(mainPath, mainBuffer.data);

    const thumbBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({
        width: 640,
        height: 480,
        fit: 'cover',
        position: 'centre'
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    await fs.promises.writeFile(thumbPath, thumbBuffer);

    res.status(201).json({
      url: `/uploads/${mainFilename}`,
      thumbUrl: `/uploads/${thumbFilename}`,
      width: mainBuffer.info.width,
      height: mainBuffer.info.height,
      sizeBytes: mainBuffer.info.size,
      originalSizeBytes: req.file.size,
      format: 'webp'
    });
  } catch (err) {
    console.error('Image optimization failed:', err);
    res.status(500).json({ error: 'Failed to process and scale image' });
  }
});

// Admin Protected Routes: Properties CRUD
app.get('/api/admin/properties', requireAdmin, (_req: Request, res: Response) => {
  res.json({ properties: listProperties() });
});

function sanitizePropertyPayload(body: Record<string, unknown>, isCreate: boolean): Partial<Property> | { error: string } {
  const category = body.category as PropertyCategory | undefined;
  const status = body.status as PropertyStatus | undefined;
  const landTenure = body.landTenure as LandTenure | undefined;
  const priceUnit = body.priceUnit as PriceUnit | undefined;

  if (isCreate) {
    if (!category || !['short_term', 'long_term', 'sale'].includes(category)) {
      return { error: 'Valid category is required' };
    }
    if (typeof body.title_de !== 'string' || !body.title_de.trim()) {
      return { error: 'German title is required' };
    }
    if (typeof body.title_en !== 'string' || !body.title_en.trim()) {
      return { error: 'English title is required' };
    }
  }

  const out: Partial<Property> = {};
  if (category && ['short_term', 'long_term', 'sale'].includes(category)) out.category = category;
  if (status && ['available', 'reserved', 'sold'].includes(status)) out.status = status;
  if (typeof body.featured === 'boolean') out.featured = body.featured;
  if (typeof body.sourcePartner === 'string') out.sourcePartner = body.sourcePartner.trim();
  if (typeof body.location === 'string' && body.location.trim()) out.location = body.location.trim();
  if (typeof body.title_de === 'string' && body.title_de.trim()) out.title_de = body.title_de.trim();
  if (typeof body.title_en === 'string' && body.title_en.trim()) out.title_en = body.title_en.trim();
  if (typeof body.subtitle_de === 'string') out.subtitle_de = body.subtitle_de.trim();
  if (typeof body.subtitle_en === 'string') out.subtitle_en = body.subtitle_en.trim();
  if (typeof body.description_de === 'string') out.description_de = body.description_de.trim();
  if (typeof body.description_en === 'string') out.description_en = body.description_en.trim();
  if (Array.isArray(body.highlights_de)) {
    out.highlights_de = body.highlights_de.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  if (Array.isArray(body.highlights_en)) {
    out.highlights_en = body.highlights_en.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  if (Array.isArray(body.amenities)) {
    out.amenities = body.amenities.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  if (body.bedrooms !== undefined) out.bedrooms = Math.max(0, Number(body.bedrooms) || 0);
  if (body.bathrooms !== undefined) out.bathrooms = Math.max(0, Number(body.bathrooms) || 0);
  if (body.maxGuests !== undefined) out.maxGuests = Math.max(1, Number(body.maxGuests) || 2);
  if (body.livingAreaSqm !== undefined) out.livingAreaSqm = Math.max(0, Number(body.livingAreaSqm) || 0);
  if (body.landAreaSqm !== undefined) out.landAreaSqm = Math.max(0, Number(body.landAreaSqm) || 0);
  if (body.priceThb !== undefined) out.priceThb = Math.max(0, Number(body.priceThb) || 0);
  if (priceUnit && ['night', 'month', 'total'].includes(priceUnit)) out.priceUnit = priceUnit;
  if (landTenure && ['freehold', 'leasehold', 'both', 'not_applicable'].includes(landTenure)) out.landTenure = landTenure;
  if (body.leaseYears !== undefined) out.leaseYears = Math.max(0, Number(body.leaseYears) || 0);
  if (body.beachDistanceMeters !== undefined) out.beachDistanceMeters = Math.max(0, Number(body.beachDistanceMeters) || 0);
  if (typeof body.imageUrl === 'string' && body.imageUrl.trim()) {
    const img = body.imageUrl.trim();
    if (img.startsWith('/') || img.startsWith('https://')) {
      out.imageUrl = img;
    }
  }
  if (Array.isArray(body.galleryUrls)) {
    out.galleryUrls = body.galleryUrls.filter(
      (u): u is string => typeof u === 'string' && (u.startsWith('/') || u.startsWith('https://'))
    );
  }
  return out;
}

app.post('/api/admin/properties', requireAdmin, (req: Request, res: Response) => {
  const parsed = sanitizePropertyPayload(req.body as Record<string, unknown>, true);
  if ('error' in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const now = new Date().toISOString();
  const id = `gs-${crypto.randomUUID().slice(0, 8)}`;
  const slugBase = (parsed.title_en || 'property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const prop: Property = {
    id,
    slug: `${slugBase}-${id.slice(-4)}`,
    category: parsed.category!,
    status: parsed.status || 'available',
    featured: Boolean(parsed.featured),
    sourcePartner: parsed.sourcePartner || (parsed.category === 'short_term' ? 'Rockstar Villas (rockstarvillas.com)' : 'Golden Samui Real Estate'),
    location: parsed.location || 'Bophut',
    title_de: parsed.title_de!,
    title_en: parsed.title_en!,
    subtitle_de: parsed.subtitle_de || '',
    subtitle_en: parsed.subtitle_en || '',
    description_de: parsed.description_de || '',
    description_en: parsed.description_en || '',
    highlights_de: parsed.highlights_de || [],
    highlights_en: parsed.highlights_en || [],
    amenities: parsed.amenities || ['Private Pool', 'Fiber Wi-Fi'],
    bedrooms: parsed.bedrooms ?? 3,
    bathrooms: parsed.bathrooms ?? 3,
    maxGuests: parsed.maxGuests ?? 6,
    livingAreaSqm: parsed.livingAreaSqm ?? 220,
    landAreaSqm: parsed.landAreaSqm ?? 450,
    priceThb: parsed.priceThb ?? 12000,
    priceUnit: parsed.priceUnit || (parsed.category === 'short_term' ? 'night' : parsed.category === 'long_term' ? 'month' : 'total'),
    landTenure: parsed.landTenure || (parsed.category === 'sale' ? 'freehold' : 'not_applicable'),
    leaseYears: parsed.leaseYears,
    beachDistanceMeters: parsed.beachDistanceMeters,
    imageUrl: parsed.imageUrl || '/src/assets/images/villa_bob_dylan_1795277391069.jpg',
    galleryUrls: parsed.galleryUrls?.length ? parsed.galleryUrls : [parsed.imageUrl || '/src/assets/images/villa_bob_dylan_1795277391069.jpg'],
    createdAt: now,
    updatedAt: now
  };
  createProperty(prop);
  res.status(201).json({ property: prop });
});

app.patch('/api/admin/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const parsed = sanitizePropertyPayload(req.body as Record<string, unknown>, false);
  if ('error' in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const updated = updateProperty(id, parsed);
  if (!updated) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({ property: updated });
});

app.delete('/api/admin/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = deleteProperty(String(req.params.id || ''));
  if (!ok) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({ ok: true });
});

// Admin Protected Routes: Inquiries & Bookings
app.get('/api/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  res.json({ inquiries: listInquiries() });
});

app.patch('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  const body = req.body as Record<string, unknown>;
  const patch: Partial<Inquiry> = {};
  if (typeof body.status === 'string' && ['new', 'confirmed', 'completed', 'archived'].includes(body.status)) {
    patch.status = body.status as InquiryStatus;
  }
  if (typeof body.adminNotes === 'string') {
    patch.adminNotes = body.adminNotes.slice(0, 2000);
  }
  const updated = updateInquiry(id, patch);
  if (!updated) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }
  res.json({ inquiry: updated });
});

app.delete('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = deleteInquiry(String(req.params.id || ''));
  if (!ok) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }
  res.json({ ok: true });
});

// Admin Protected Real-Time Export (CSV & JSON)
function escapeCsvCell(val: unknown): string {
  const str = val === null || val === undefined ? '' : String(val);
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

app.get('/api/admin/export', requireAdmin, (req: Request, res: Response) => {
  const resource = req.query.resource === 'inquiries' ? 'inquiries' : 'listings';
  const format = req.query.format === 'json' ? 'json' : 'csv';
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

  if (resource === 'listings') {
    let rows = listProperties();
    if (category && category !== 'all') rows = rows.filter((p) => p.category === category);
    if (status && status !== 'all') rows = rows.filter((p) => p.status === status);
    if (search) {
      rows = rows.filter(
        (p) =>
          p.title_de.toLowerCase().includes(search) ||
          p.title_en.toLowerCase().includes(search) ||
          p.location.toLowerCase().includes(search)
      );
    }

    if (format === 'json') {
      res.setHeader('Content-Disposition', `attachment; filename="golden-samui-listings-${stamp}.json"`);
      res.json({ exportedAt: new Date().toISOString(), count: rows.length, listings: rows });
      return;
    }

    const headers = [
      'ID',
      'Category',
      'Status',
      'Location',
      'Title (DE)',
      'Title (EN)',
      'Bedrooms',
      'Bathrooms',
      'Living Area (m2)',
      'Land Area (m2)',
      'Price (THB)',
      'Price Unit',
      'Land Tenure',
      'Source Partner',
      'Updated At'
    ];
    const lines = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((r) =>
        [
          r.id,
          r.category,
          r.status,
          r.location,
          r.title_de,
          r.title_en,
          r.bedrooms,
          r.bathrooms,
          r.livingAreaSqm,
          r.landAreaSqm,
          r.priceThb,
          r.priceUnit,
          r.landTenure,
          r.sourcePartner || '',
          r.updatedAt
        ]
          .map(escapeCsvCell)
          .join(',')
      )
    ];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="golden-samui-listings-${stamp}.csv"`);
    res.send('\uFEFF' + lines.join('\r\n'));
    return;
  }

  // Inquiries export
  let rows = listInquiries();
  if (category && category !== 'all') rows = rows.filter((i) => i.type === category);
  if (status && status !== 'all') rows = rows.filter((i) => i.status === status);
  if (search) {
    rows = rows.filter(
      (i) =>
        i.name.toLowerCase().includes(search) ||
        i.email.toLowerCase().includes(search) ||
        (i.propertyTitle || '').toLowerCase().includes(search)
    );
  }

  if (format === 'json') {
    res.setHeader('Content-Disposition', `attachment; filename="golden-samui-inquiries-${stamp}.json"`);
    res.json({ exportedAt: new Date().toISOString(), count: rows.length, inquiries: rows });
    return;
  }

  const headers = [
    'ID',
    'Type',
    'Status',
    'Customer Name',
    'Email',
    'Phone',
    'Property',
    'Check-In',
    'Check-Out',
    'Guests',
    'Viewing Date',
    'Viewing Time',
    'Viewing Format',
    'Preferred Tenure',
    'Estimated Total (THB)',
    'Add-Ons',
    'Message',
    'Admin Notes',
    'Created At'
  ];
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((i) =>
      [
        i.id,
        i.type,
        i.status,
        i.name,
        i.email,
        i.phone,
        i.propertyTitle || '',
        i.checkIn || '',
        i.checkOut || '',
        i.guests ?? '',
        i.viewingDate || '',
        i.viewingTime || '',
        i.viewingFormat || '',
        i.preferredTenure || '',
        i.estimatedTotalThb ?? '',
        (i.addOns || []).join('; '),
        i.message,
        i.adminNotes,
        i.createdAt
      ]
        .map(escapeCsvCell)
        .join(',')
    )
  ];

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="golden-samui-inquiries-${stamp}.csv"`);
  res.send('\uFEFF' + lines.join('\r\n'));
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Golden Samui Real Estate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
