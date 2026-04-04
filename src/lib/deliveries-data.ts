export interface Delivery {
  id: string;
  district: string;
  school: string;
  items: string;
  quoteNum: string | null;
  dateAssigned: string | null;
  dateDelivered: string | null;
  installDate: string | null;
  who: string;
  packingSlip?: string;
  tracking?: string;
  alexConfirmed: boolean;
  status: 'pending' | 'shipped' | 'delivered' | 'installed' | 'confirmed';
}

function deriveStatus(d: Omit<Delivery, 'id' | 'status'>): Delivery['status'] {
  if (d.alexConfirmed) return 'confirmed';
  if (d.installDate) return 'installed';
  if (d.dateDelivered) return 'delivered';
  if (d.dateAssigned) return 'shipped';
  return 'pending';
}

const raw: Omit<Delivery, 'id' | 'status'>[] = [
  // Current / recent
  { district: 'North Riverside', school: 'Corp HQ',          items: '7 PoE Readers',                              quoteNum: 'Q 783564',   dateAssigned: '2025-12-31', dateDelivered: null,         installDate: null,         who: '', alexConfirmed: true },
  { district: 'Foxhill',         school: 'Corp HQ',          items: '10 PoE Readers',                             quoteNum: 'Q 186404',   dateAssigned: '2025-12-31', dateDelivered: null,         installDate: null,         who: '', alexConfirmed: true },
  { district: 'North Riverside', school: 'Site B',           items: 'Kiosk Decals',                               quoteNum: null,         dateAssigned: '2026-01-26', dateDelivered: null,         installDate: null,         who: '', alexConfirmed: true },
  { district: 'Birchwood',       school: 'Corp HQ',          items: '1 Handheld (free)',                          quoteNum: null,         dateAssigned: '2026-02-09', dateDelivered: null,         installDate: null,         who: '', alexConfirmed: true },
  { district: 'Coral Cove',      school: 'Regional Office',  items: '4 spares',                                   quoteNum: null,         dateAssigned: '2026-03-24', dateDelivered: '2026-03-28', installDate: '2026-03-23', who: 'Morgan', alexConfirmed: false },
  { district: 'Cedar Falls',     school: 'Regional Office',  items: '3 spares',                                   quoteNum: null,         dateAssigned: '2026-03-13', dateDelivered: '2026-03-30', installDate: '2026-03-20', who: 'Morgan', tracking: '1ZWUP4ZCDX973KZM7H', alexConfirmed: false },
  { district: 'Lakewood',        school: 'Corp HQ',          items: 'VM and 1 MR',                                quoteNum: null,         dateAssigned: '2026-03-19', dateDelivered: '2026-03-12', installDate: '2026-03-22', who: 'Morgan', tracking: '1Z288611WM0A9OG2ZC', alexConfirmed: false },
  { district: 'Mapleton',        school: 'Corp HQ',          items: '1 MR',                                       quoteNum: null,         dateAssigned: '2026-03-13', dateDelivered: '2026-03-15', installDate: '2026-03-28', who: 'Morgan', tracking: '1ZXYMLCJH1ZMP1JO6N', alexConfirmed: false },
  { district: 'Creekstone',      school: 'Corp HQ',          items: '1 PoE, 1 MR',                                quoteNum: null,         dateAssigned: '2026-03-19', dateDelivered: null,         installDate: null,         who: '', alexConfirmed: false },
  // Historical
  { district: 'Northfield',  school: 'Corp HQ',         items: '1 PoE Reader, Screws (free)',                     quoteNum: null,         dateAssigned: '2025-12-03', dateDelivered: '2025-12-06', installDate: '2025-12-02', who: 'Morgan', packingSlip: 'SOMS 090826.pdf', alexConfirmed: true },
  { district: 'Northfield',  school: 'Office',          items: '1 Receipt Printer, 1 Ribbon (free)',              quoteNum: null,         dateAssigned: '2025-12-18', dateDelivered: '2025-12-06', installDate: '2025-11-29', who: 'Morgan', packingSlip: 'SMS 041725.pdf', alexConfirmed: true },
  { district: 'Forest Glen', school: 'Corp HQ',         items: '2 15ft cords, 2 blocks, 22 raceway (free)',       quoteNum: null,         dateAssigned: '2025-12-06', dateDelivered: '2025-12-15', installDate: '2025-12-18', who: 'Morgan', packingSlip: 'FGHS 101026.pdf', alexConfirmed: true },
  { district: 'Foxhill',     school: 'Corp HQ',         items: '3 PoE Readers, Screws',                           quoteNum: 'Q 862762',   dateAssigned: '2025-12-02', dateDelivered: '2025-12-06', installDate: '2025-12-07', who: 'Morgan', packingSlip: 'FHHS 091025.pdf', alexConfirmed: true },
  { district: 'Sunbay',      school: 'Regional Office', items: '5 MR, 5 cords, 20 Temp Passes, 11 Badges (free)', quoteNum: null,         dateAssigned: '2025-12-15', dateDelivered: '2025-12-07', installDate: '2025-12-09', who: 'Jordan', packingSlip: 'SBMS 042426.pdf', alexConfirmed: true },
  { district: 'Forest Glen', school: 'Corp HQ',         items: '8 Handhelds',                                     quoteNum: 'Q 645979',   dateAssigned: '2025-12-06', dateDelivered: '2026-01-13', installDate: '2026-01-10', who: 'Jordan', packingSlip: 'FGHS 042026', alexConfirmed: true },
  { district: 'Maple Creek', school: 'Corp HQ',         items: 'Badge Station install (free)',                     quoteNum: null,         dateAssigned: null,         dateDelivered: '2025-12-11', installDate: '2025-12-24', who: 'Alex', alexConfirmed: true },
  { district: 'Riverside',   school: 'Corp HQ',         items: '1,400 Badge Cards',                               quoteNum: 'Q 664162',   dateAssigned: '2025-12-23', dateDelivered: '2025-12-17', installDate: '2025-12-25', who: 'Morgan', packingSlip: 'RVJSHS 022325', alexConfirmed: true },
  { district: 'North Riverside', school: 'Corp HQ',     items: '10 Handhelds',                                    quoteNum: 'Q 957691',   dateAssigned: '2025-12-06', dateDelivered: '2025-12-13', installDate: '2025-12-24', who: 'Jordan', packingSlip: 'WFHS 020126.pdf', alexConfirmed: true },
  { district: 'North Riverside', school: 'Site B',      items: '25 Label Rolls',                                  quoteNum: 'Q 264559',   dateAssigned: '2025-12-13', dateDelivered: '2025-12-08', installDate: '2025-12-23', who: 'Morgan', packingSlip: 'WFMMS 071725', alexConfirmed: true },
  { district: 'Harborview',  school: 'All Sites',       items: '2 Badge Stations',                                quoteNum: 'Q 447646',   dateAssigned: '2025-12-08', dateDelivered: '2025-12-19', installDate: '2025-12-29', who: 'Alex', alexConfirmed: true },
  { district: 'Harborview',  school: 'All Sites',       items: '5 VM',                                            quoteNum: 'Q 938940',   dateAssigned: '2025-12-16', dateDelivered: '2025-12-19', installDate: '2025-12-27', who: 'Jordan', alexConfirmed: true },
  { district: 'Harborview',  school: 'All Sites',       items: '600 Badge Cards',                                 quoteNum: 'Q 241218',   dateAssigned: '2025-12-22', dateDelivered: '2025-12-20', installDate: '2025-12-22', who: 'Alex', alexConfirmed: true },
  { district: 'Harborview',  school: 'All Sites',       items: '23 Handhelds (Corp HQ 16, Site B 7)',             quoteNum: 'Q 492462',   dateAssigned: '2025-12-17', dateDelivered: '2025-12-19', installDate: '2025-12-20', who: 'Jordan', alexConfirmed: true },
  { district: 'Maple Creek', school: 'Corp HQ',         items: '5 Handhelds, 50 Readers',                         quoteNum: 'Q 360561',   dateAssigned: '2025-12-26', dateDelivered: '2025-12-20', installDate: '2025-12-26', who: 'Morgan', packingSlip: 'MCHS 021725.pdf', alexConfirmed: true },
  { district: 'Meadowbrook', school: 'Corp HQ',         items: '1 replacement tablet (free)',                     quoteNum: null,         dateAssigned: '2025-12-06', dateDelivered: '2025-12-21', installDate: '2025-12-19', who: 'Jordan', packingSlip: 'MLHS 051526.pdf', alexConfirmed: true },
  { district: 'Riverside',   school: 'Corp HQ',         items: '500 Badge Cards (gave 1K)',                       quoteNum: 'Q 669689',   dateAssigned: '2025-12-24', dateDelivered: '2026-01-02', installDate: '2025-12-27', who: 'Jordan', packingSlip: 'RVRSHS 101726', alexConfirmed: true },
  { district: 'Pinehurst',   school: 'Corp HQ',         items: '10 MR',                                           quoteNum: 'Q 490500',   dateAssigned: '2025-12-26', dateDelivered: '2025-12-31', installDate: '2026-01-01', who: 'Morgan', packingSlip: 'PHHS 020826', alexConfirmed: true },
  { district: 'Harborview',  school: 'Regional Office', items: '1 broken kiosk, HH Charger Station',              quoteNum: null,         dateAssigned: '2025-12-26', dateDelivered: '2026-01-09', installDate: '2025-12-29', who: 'Jordan', packingSlip: 'HVMS 072125.pdf', alexConfirmed: true },
  { district: 'Foxhill',     school: 'Corp HQ',         items: '15 Handhelds',                                    quoteNum: 'Q 341246',   dateAssigned: '2025-12-29', dateDelivered: '2026-01-02', installDate: '2026-01-10', who: 'Jordan', packingSlip: 'FHHS 040125.pdf', alexConfirmed: true },
  { district: 'North Riverside', school: 'Site B',      items: '200 Badge Cards',                                 quoteNum: 'Q 720209',   dateAssigned: '2025-12-14', dateDelivered: '2026-01-07', installDate: '2026-01-02', who: 'Jordan', packingSlip: 'WFMMS 072525.pdf', alexConfirmed: true },
  { district: 'Northfield',  school: 'Corp HQ',         items: '2,000 Badge Cards',                               quoteNum: 'Q 570171',   dateAssigned: '2026-01-18', dateDelivered: '2026-01-30', installDate: '2026-01-16', who: 'Morgan', packingSlip: 'SGHS 082326.pdf', alexConfirmed: true },
  { district: 'Northfield',  school: 'Corp HQ',         items: '1 Badge Printer',                                 quoteNum: 'Q 943258',   dateAssigned: '2026-01-17', dateDelivered: '2026-01-18', installDate: '2026-01-21', who: 'Casey', alexConfirmed: true },
  { district: 'Harborview',  school: 'Corp HQ',         items: '14 readers, 16 cables, 18 boxes, 1 raceway box',  quoteNum: null,         dateAssigned: '2026-01-31', dateDelivered: '2026-02-01', installDate: '2026-01-18', who: 'Morgan', packingSlip: 'WBHS 061125.pdf', alexConfirmed: true },
  { district: 'Greenfield',  school: 'Corp HQ',         items: '1 printer, 100 blanks, 1189 Badges, 4 K, 2 HH, 1 PoE', quoteNum: null, dateAssigned: '2026-01-17', dateDelivered: '2026-01-15', installDate: '2026-01-23', who: 'Taylor & Alex', packingSlip: 'GFHS 070825.pdf', alexConfirmed: true },
  { district: 'Northfield',  school: 'All Sites',       items: '30 PoE Readers',                                  quoteNum: null,         dateAssigned: '2026-01-28', dateDelivered: '2026-02-01', installDate: '2026-02-06', who: 'Jordan', packingSlip: 'PM 050425.pdf', alexConfirmed: true },
  { district: 'Cedar Falls', school: 'All Sites',       items: 'Mail checkout reader',                            quoteNum: null,         dateAssigned: '2026-01-18', dateDelivered: '2026-02-06', installDate: '2026-02-02', who: 'Morgan', tracking: '888400013300', alexConfirmed: true },
  { district: 'Meadowbrook', school: 'All Sites',       items: '5 VM Install',                                    quoteNum: 'Q 906914',   dateAssigned: '2026-01-22', dateDelivered: '2026-02-10', installDate: '2026-02-06', who: 'Taylor & Jordan', alexConfirmed: true },
  { district: 'Northfield',  school: 'Regional Office', items: '500 Blank Badge Cards',                           quoteNum: 'Q 262288',   dateAssigned: '2026-01-31', dateDelivered: '2026-02-22', installDate: '2026-02-18', who: 'Jordan', packingSlip: 'OMS 031125.pdf', alexConfirmed: true },
  { district: 'Harborview',  school: 'All Sites',       items: '600 Blank Badge Cards',                           quoteNum: 'Q 850020',   dateAssigned: '2026-02-01', dateDelivered: '2026-02-12', installDate: '2026-02-24', who: 'Morgan', packingSlip: 'LD 101725.pdf', alexConfirmed: true },
  { district: 'Valley Ridge', school: 'Corp HQ',        items: '1 Handheld (complimentary)',                      quoteNum: null,         dateAssigned: '2026-02-09', dateDelivered: '2026-02-05', installDate: '2026-02-10', who: 'Jordan', packingSlip: 'LD 052625.pdf', alexConfirmed: true },
  { district: 'Cedar Falls', school: 'Corp HQ',         items: '4 kiosk swaps',                                   quoteNum: null,         dateAssigned: '2026-01-18', dateDelivered: '2026-02-25', installDate: '2026-03-04', who: 'Jordan', alexConfirmed: true },
  { district: 'Lakeside',    school: 'Regional Office', items: '10 Handhelds (via partner)',                      quoteNum: null,         dateAssigned: '2026-02-17', dateDelivered: '2026-02-09', installDate: '2026-02-23', who: 'Taylor & Alex', packingSlip: '091025 LKMS.pdf', alexConfirmed: true },
  { district: 'North Riverside', school: 'Corp HQ',     items: '500 Blank Badge Cards',                           quoteNum: 'Q 524585',   dateAssigned: '2026-02-26', dateDelivered: '2026-02-28', installDate: '2026-02-26', who: 'Morgan', packingSlip: '100626 WFHS.pdf', tracking: '962445109084', alexConfirmed: true },
  { district: 'Harbortown',  school: 'Corp HQ',         items: '4 MR, 1 HH',                                      quoteNum: 'Q 563999',   dateAssigned: '2026-02-17', dateDelivered: '2026-02-23', installDate: '2026-02-17', who: 'Morgan', packingSlip: '051126 HTVT.pdf', tracking: '827142417438', alexConfirmed: true },
  { district: 'Northfield',  school: 'Corp HQ',         items: '10 Receipt Printers',                             quoteNum: 'Q 653310',   dateAssigned: '2026-02-19', dateDelivered: '2026-02-17', installDate: '2026-03-05', who: 'Morgan', packingSlip: '082125 SGHS.pdf', tracking: '941423769176', alexConfirmed: true },
  { district: 'Blue Lake',   school: 'Corp HQ',         items: '1 Badge Printer, 1 Badge Station, 1 Kiosk, 1 Receipt Printer', quoteNum: 'Q 139421', dateAssigned: '2026-02-01', dateDelivered: '2026-03-07', installDate: '2026-02-26', who: 'Taylor & Sanera', packingSlip: '100625 BLH.pdf', alexConfirmed: true },
  { district: 'Pinehurst',   school: 'Corp HQ',         items: '500 Badges, 1 K, 2 HH',                          quoteNum: 'Q 715310',   dateAssigned: '2026-01-26', dateDelivered: '2026-02-18', installDate: '2026-02-08', who: 'Jordan', alexConfirmed: true },
  { district: 'Blue Lake',   school: 'Corp HQ',         items: '10 temp pass rolls',                              quoteNum: 'Q 836581',   dateAssigned: '2026-03-08', dateDelivered: '2026-03-10', installDate: '2026-03-11', who: 'Taylor & Alex', packingSlip: '081225 BLH.pdf', alexConfirmed: true },
  { district: 'Northfield',  school: 'All Sites',       items: '10 Handhelds',                                    quoteNum: 'Q 465168',   dateAssigned: '2026-03-02', dateDelivered: '2026-03-23', installDate: '2026-03-16', who: 'Casey', packingSlip: '051525 PMD.pdf', alexConfirmed: true },
  { district: 'Harborview',  school: 'Regional Office', items: '3 pre-programmed MR (lobby, conf, ops)',          quoteNum: null,         dateAssigned: '2026-03-08', dateDelivered: '2026-03-14', installDate: '2026-03-09', who: 'Morgan', tracking: '944433072528', alexConfirmed: true },
  { district: 'Northgate',   school: 'Corp HQ',         items: '1 kiosk with shelf and barcode',                  quoteNum: null,         dateAssigned: '2026-02-01', dateDelivered: '2026-03-23', installDate: '2026-03-15', who: 'Taylor & Alex', alexConfirmed: true },
];

export const deliveries: Delivery[] = raw.map((d, i) => ({
  ...d,
  id: `del-${i + 1}`,
  status: deriveStatus(d),
}));

export const statusConfig: Record<Delivery['status'], { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#71717a', bg: 'rgba(113,113,122,0.10)' },
  shipped:   { label: 'Assigned',  color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  delivered: { label: 'Delivered', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  installed: { label: 'Installed', color: '#fb923c', bg: 'rgba(251,146,60,0.10)' },
  confirmed: { label: 'Confirmed', color: '#22c55e', bg: 'rgba(34,197,94,0.10)' },
};
