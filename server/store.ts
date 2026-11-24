import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Inquiry, Property, StoreData } from '../src/types.ts';
import { SEED_INQUIRIES, SEED_PROPERTIES } from './seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
export const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

function ensureDirs(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function loadStoreFromDisk(): StoreData {
  ensureDirs();
  if (!fs.existsSync(STORE_PATH)) {
    const initial: StoreData = {
      adminPasswordHash: null,
      properties: SEED_PROPERTIES,
      inquiries: SEED_INQUIRIES
    };
    saveStoreToDisk(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      adminPasswordHash: typeof parsed.adminPasswordHash === 'string' ? parsed.adminPasswordHash : null,
      properties: Array.isArray(parsed.properties) ? parsed.properties : SEED_PROPERTIES,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : SEED_INQUIRIES
    };
  } catch {
    const fallback: StoreData = {
      adminPasswordHash: null,
      properties: SEED_PROPERTIES,
      inquiries: SEED_INQUIRIES
    };
    saveStoreToDisk(fallback);
    return fallback;
  }
}

function saveStoreToDisk(data: StoreData): void {
  ensureDirs();
  const tmpPath = `${STORE_PATH}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, STORE_PATH);
}

let store: StoreData = loadStoreFromDisk();

export function getStore(): StoreData {
  return store;
}

export function setAdminPasswordHash(hash: string): void {
  store = { ...store, adminPasswordHash: hash };
  saveStoreToDisk(store);
}

export function listProperties(): Property[] {
  return store.properties;
}

export function getPropertyById(id: string): Property | undefined {
  return store.properties.find((p) => p.id === id);
}

export function createProperty(prop: Property): Property {
  store = { ...store, properties: [prop, ...store.properties] };
  saveStoreToDisk(store);
  return prop;
}

export function updateProperty(id: string, patch: Partial<Property>): Property | null {
  const idx = store.properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated: Property = {
    ...store.properties[idx],
    ...patch,
    id: store.properties[idx].id,
    updatedAt: new Date().toISOString()
  };
  const next = [...store.properties];
  next[idx] = updated;
  store = { ...store, properties: next };
  saveStoreToDisk(store);
  return updated;
}

export function deleteProperty(id: string): boolean {
  const before = store.properties.length;
  const next = store.properties.filter((p) => p.id !== id);
  if (next.length === before) return false;
  store = { ...store, properties: next };
  saveStoreToDisk(store);
  return true;
}

export function listInquiries(): Inquiry[] {
  return store.inquiries;
}

export function createInquiry(inquiry: Inquiry): Inquiry {
  store = { ...store, inquiries: [inquiry, ...store.inquiries] };
  saveStoreToDisk(store);
  return inquiry;
}

export function updateInquiry(id: string, patch: Partial<Inquiry>): Inquiry | null {
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const updated: Inquiry = {
    ...store.inquiries[idx],
    ...patch,
    id: store.inquiries[idx].id,
    updatedAt: new Date().toISOString()
  };
  const next = [...store.inquiries];
  next[idx] = updated;
  store = { ...store, inquiries: next };
  saveStoreToDisk(store);
  return updated;
}

export function deleteInquiry(id: string): boolean {
  const before = store.inquiries.length;
  const next = store.inquiries.filter((i) => i.id !== id);
  if (next.length === before) return false;
  store = { ...store, inquiries: next };
  saveStoreToDisk(store);
  return true;
}
