export type ProductCategory = 'software' | 'hardware' | 'consumables' | 'services' | 'support';
export type BillingType = 'annual' | 'one_time' | 'per_hour' | 'free';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  billing: BillingType;
  unitPrice: number;
  unit: string;
  description: string;
  note?: string;
}

export const products: Product[] = [
  // SOFTWARE
  { id: 'license-standard', name: 'Core Platform License', sku: 'SW-001', category: 'software', billing: 'annual', unitPrice: 10, unit: 'per seat/yr', description: 'Entry-level platform access — access management, ID scanning, check-in workflows' },
  { id: 'addon-classroom', name: 'Analytics Add-On', sku: 'SW-002', category: 'software', billing: 'annual', unitPrice: 0, unit: 'per seat/yr', description: 'Site-level analytics and reporting (included with full plan)' },
  { id: 'vm-annual', name: 'Site Management Annual Fee', sku: 'SW-003', category: 'software', billing: 'annual', unitPrice: 2175, unit: 'per site/yr', description: 'Annual Site Management license per location' },

  // HARDWARE
  { id: 'wifi-reader', name: 'WiFi Scanner', sku: 'HW-001', category: 'hardware', billing: 'one_time', unitPrice: 100, unit: 'each', description: 'Wireless scanner for lobbies and entry points' },
  { id: 'poe-reader', name: 'PoE Scanner', sku: 'HW-002', category: 'hardware', billing: 'one_time', unitPrice: 200, unit: 'each', description: 'Power-over-Ethernet scanner for permanent installations' },
  { id: 'kiosk', name: 'Check-in Kiosk', sku: 'HW-003', category: 'hardware', billing: 'one_time', unitPrice: 1400, unit: 'each', description: 'Self-service check-in kiosk with touchscreen' },
  { id: 'handheld', name: 'Handheld Device', sku: 'HW-004', category: 'hardware', billing: 'one_time', unitPrice: 200, unit: 'each', description: 'Portable handheld scanner for staff use in the field and at events' },
  { id: 'id-card-station', name: 'Badge Station', sku: 'HW-005', category: 'hardware', billing: 'one_time', unitPrice: 3725, unit: 'each', description: 'Full badge printing station (printer + software + setup)' },
  { id: 'id-all', name: 'All-in-One Unit', sku: 'HW-006', category: 'hardware', billing: 'one_time', unitPrice: 900, unit: 'each', description: 'All-in-one badge reader and scanner unit' },
  { id: 'late-pass-printer', name: 'Receipt Printer', sku: 'HW-007', category: 'hardware', billing: 'one_time', unitPrice: 425, unit: 'each', description: 'Dedicated printer for printing visitor and access receipts' },
  { id: 'vm-setup', name: 'Hardware Installation', sku: 'HW-008', category: 'hardware', billing: 'one_time', unitPrice: 1500, unit: 'per install', description: 'On-site hardware installation by our team' },

  // CONSUMABLES
  { id: 'id-card', name: 'Printed Badge', sku: 'CON-001', category: 'consumables', billing: 'one_time', unitPrice: 2.55, unit: 'each', description: 'Printed badge cards (full color, CR80)' },
  { id: 'blank-card', name: 'Blank Badge Card', sku: 'CON-002', category: 'consumables', billing: 'one_time', unitPrice: 0.35, unit: 'each', description: 'Blank white CR80 cards for on-site printing' },
  { id: 'ribbon', name: 'Printer Ribbon', sku: 'CON-003', category: 'consumables', billing: 'one_time', unitPrice: 100, unit: 'each', description: 'Full-color YMCKO ribbon for badge card printers', note: 'First ribbon provided free' },
  { id: 'cleaning-kit', name: 'Cleaning Kit', sku: 'CON-004', category: 'consumables', billing: 'one_time', unitPrice: 50, unit: 'each', description: 'Printer cleaning kit for maintenance', note: 'First kit provided free' },
  { id: 'temp-id', name: 'Temp Pass', sku: 'CON-005', category: 'consumables', billing: 'free', unitPrice: 0, unit: 'each', description: 'Temporary paper access passes', note: 'First 25 provided free' },
  { id: 'sticker', name: 'Kiosk Decal', sku: 'CON-006', category: 'consumables', billing: 'free', unitPrice: 0, unit: 'each', description: 'Branding and directional decals for kiosk units' },

  // SERVICES
  { id: 'training', name: 'Training / Install', sku: 'SVC-001', category: 'services', billing: 'per_hour', unitPrice: 150, unit: 'per hour', description: 'On-site training and installation by our team' },

  // SUPPORT (Annual)
  { id: 'kiosk-support', name: 'Kiosk Annual Support & Insurance', sku: 'SUP-001', category: 'support', billing: 'annual', unitPrice: 1025, unit: 'per device/yr', description: 'Annual support, maintenance, insurance, replacements, OTA updates per kiosk' },
  { id: 'hh-support', name: 'Handheld Annual Support & Insurance', sku: 'SUP-002', category: 'support', billing: 'annual', unitPrice: 100, unit: 'per device/yr', description: 'Annual support, maintenance, insurance per handheld device' },
  { id: 'mr-support', name: 'Scanner Annual Support', sku: 'SUP-003', category: 'support', billing: 'annual', unitPrice: 25, unit: 'per device/yr', description: 'Annual support, maintenance, insurance per scanner' },
];

export const categoryConfig: Record<ProductCategory, { label: string; color: string; bg: string }> = {
  software:    { label: 'Software',    color: '#22c55e', bg: 'rgba(34,197,94,0.10)' },
  hardware:    { label: 'Hardware',    color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  consumables: { label: 'Consumables', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  services:    { label: 'Services',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
  support:     { label: 'Support',     color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
};

export const billingConfig: Record<BillingType, { label: string; color: string }> = {
  annual:   { label: 'Annual',   color: '#22c55e' },
  one_time: { label: 'One-time', color: '#3b82f6' },
  per_hour: { label: 'Per Hour', color: '#8b5cf6' },
  free:     { label: 'Free',     color: '#71717a' },
};
