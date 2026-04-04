export type QuoteStatus = 'paid' | 'noPO' | 'pending' | 'unknown';
export type Stage = 'Active' | 'Pending PO' | 'At Risk' | 'New';

export interface Quote {
  id: string;
  quoteNum: string;
  price: number;
  items: string;
  quoteDate: string;
  poNum: string | null;
  poDate: string | null;
  status: QuoteStatus;
}

export interface School {
  code: string;
  name: string;
  quotes: Quote[];
}

export interface District {
  id: string;
  name: string;
  stage: Stage;
  schools: School[];
  contact?: string;
  contactEmail?: string;
  state?: string;
  studentCount?: number;
  arr2526?: number;
  arr2627?: number;
  oneTimeRevenue?: number;
  boces?: 'Enterprise' | 'SMB';
  hardware?: {
    kiosks?: number;
    handhelds?: number;
    poeReaders?: number;
    vendingMachines?: number;
  };
}

export interface Activity {
  id: string;
  type: 'quote_sent' | 'po_received' | 'follow_up' | 'meeting' | 'install';
  district: string;
  description: string;
  date: string;
  amount?: number;
}

export const districts: District[] = [
  {
    id: 'riverside',
    name: 'Apex',
    stage: 'Active',
    state: 'CA',
    contact: 'Maria Lopez',
    contactEmail: 'mlopez@apexsolutions.com',
    studentCount: 1500,
    arr2526: 10725,
    arr2627: 11261,
    oneTimeRevenue: 725,
    boces: 'SMB',
    hardware: { handhelds: 100 },
    schools: [
      {
        code: 'RVJSHS',
        name: 'Apex Corp HQ',
        quotes: [
          {
            id: 'rv-q1',
            quoteNum: '194728',
            price: 10725,
            items: '1,500 Licenses $7.13ea, 100 Mobile Readers',
            quoteDate: '2025-09-12',
            poNum: '26-34087',
            poDate: '2025-10-03',
            status: 'paid',
          },
          {
            id: 'rv-q2',
            quoteNum: '627961',
            price: 725,
            items: '500 Badge Cards $1.68ea',
            quoteDate: '2025-11-05',
            poNum: '267026',
            poDate: '2025-11-20',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'oakwood',
    name: 'Nexus',
    stage: 'Pending PO',
    state: 'FL',
    contact: 'James Whitfield',
    contactEmail: 'jwhitfield@nexusgroup.com',
    studentCount: 2500,
    arr2526: 17563,
    arr2627: 18441,
    oneTimeRevenue: 32175,
    boces: 'Enterprise',
    hardware: { kiosks: 66, handhelds: 75 },
    schools: [
      {
        code: 'OWHS',
        name: 'Nexus Regional Office',
        quotes: [
          {
            id: 'ow-q1',
            quoteNum: '341813',
            price: 18900,
            items: '21 Check-in Kiosk Units',
            quoteDate: '2025-08-14',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
          {
            id: 'ow-q2',
            quoteNum: '978608',
            price: 44775,
            items: '45 Check-in Kiosk Units, 2,500 Licenses',
            quoteDate: '2025-09-01',
            poNum: '26-40373',
            poDate: '2025-10-10',
            status: 'paid',
          },
          {
            id: 'ow-q3',
            quoteNum: '883279',
            price: 5250,
            items: '750 Badge Cards, 50 Mobile Readers',
            quoteDate: '2025-10-18',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
          {
            id: 'ow-q4',
            quoteNum: '530335',
            price: 5275,
            items: '750 Badge Cards, 25 Mobile Readers',
            quoteDate: '2025-11-02',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'maple-creek',
    name: 'Crestline',
    stage: 'Active',
    state: 'OH',
    contact: 'Sandra Nguyen',
    contactEmail: 'snguyen@crestlinecorp.com',
    studentCount: 3180,
    arr2526: 22410,
    arr2627: 23531,
    oneTimeRevenue: 3200,
    schools: [
      {
        code: 'MCHS',
        name: 'Crestline Corp HQ',
        quotes: [
          {
            id: 'mc-q1',
            quoteNum: '112034',
            price: 14850,
            items: '2,100 Licenses $7.07ea',
            quoteDate: '2025-08-20',
            poNum: '25-77201',
            poDate: '2025-09-05',
            status: 'paid',
          },
          {
            id: 'mc-q2',
            quoteNum: '213905',
            price: 3200,
            items: '400 Badge Cards $8.00ea',
            quoteDate: '2025-10-11',
            poNum: '25-81034',
            poDate: '2025-10-28',
            status: 'paid',
          },
        ],
      },
      {
        code: 'MCMS',
        name: 'Crestline West Office',
        quotes: [
          {
            id: 'mc-q3',
            quoteNum: '389471',
            price: 7560,
            items: '1,080 Licenses $7.00ea',
            quoteDate: '2025-09-14',
            poNum: '25-79304',
            poDate: '2025-09-30',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'cedar-falls',
    name: 'Summit',
    stage: 'Active',
    state: 'IA',
    contact: 'Tom Burrell',
    contactEmail: 'tburrell@summittech.com',
    studentCount: 3200,
    arr2526: 22400,
    arr2627: 23520,
    oneTimeRevenue: 4800,
    schools: [
      {
        code: 'CFHS',
        name: 'Summit Corp HQ',
        quotes: [
          {
            id: 'cf-q1',
            quoteNum: '445812',
            price: 22400,
            items: '3,200 Licenses $7.00ea',
            quoteDate: '2025-07-30',
            poNum: '26-10045',
            poDate: '2025-08-15',
            status: 'paid',
          },
          {
            id: 'cf-q2',
            quoteNum: '501234',
            price: 4800,
            items: '600 Badge Cards $8.00ea',
            quoteDate: '2025-09-22',
            poNum: '26-14892',
            poDate: '2025-10-08',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'blue-lake',
    name: 'Vantage',
    stage: 'Active',
    state: 'MN',
    contact: 'Christine Park',
    contactEmail: 'cpark@vantageinc.com',
    studentCount: 2800,
    arr2526: 26600,
    arr2627: 27930,
    oneTimeRevenue: 2400,
    hardware: { kiosks: 10 },
    schools: [
      {
        code: 'BLHS',
        name: 'Vantage Corp HQ',
        quotes: [
          {
            id: 'bl-q1',
            quoteNum: '663920',
            price: 17500,
            items: '10 Check-in Kiosk Units, 1,500 Licenses',
            quoteDate: '2025-08-05',
            poNum: '26-22310',
            poDate: '2025-08-22',
            status: 'paid',
          },
        ],
      },
      {
        code: 'BLMS',
        name: 'Vantage North Office',
        quotes: [
          {
            id: 'bl-q2',
            quoteNum: '701845',
            price: 9100,
            items: '1,300 Licenses $7.00ea',
            quoteDate: '2025-09-10',
            poNum: '26-23801',
            poDate: '2025-09-28',
            status: 'paid',
          },
          {
            id: 'bl-q3',
            quoteNum: '745219',
            price: 2400,
            items: '300 Badge Cards $8.00ea',
            quoteDate: '2025-11-01',
            poNum: '26-30012',
            poDate: '2025-11-18',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'pinehurst',
    name: 'Pinehurst',
    stage: 'Active',
    state: 'NC',
    contact: 'David Flores',
    contactEmail: 'dflores@pinehurstco.com',
    studentCount: 4500,
    arr2526: 31500,
    arr2627: 33075,
    oneTimeRevenue: 5600,
    schools: [
      {
        code: 'PHHS',
        name: 'Pinehurst Corp HQ',
        quotes: [
          {
            id: 'ph-q1',
            quoteNum: '820314',
            price: 31500,
            items: '4,500 Licenses $7.00ea',
            quoteDate: '2025-08-01',
            poNum: '26-55401',
            poDate: '2025-08-19',
            status: 'paid',
          },
          {
            id: 'ph-q2',
            quoteNum: '864722',
            price: 5600,
            items: '700 Badge Cards $8.00ea',
            quoteDate: '2025-10-07',
            poNum: '26-60913',
            poDate: '2025-10-24',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'elmwood',
    name: 'Ironwood',
    stage: 'At Risk',
    state: 'TX',
    contact: 'Rebecca Torres',
    contactEmail: 'rtorres@ironwoodtech.com',
    studentCount: 1030,
    arr2526: 7210,
    arr2627: 7571,
    oneTimeRevenue: 0,
    boces: 'SMB',
    schools: [
      {
        code: 'EMHS',
        name: 'Ironwood Corp HQ',
        quotes: [
          {
            id: 'em-q1',
            quoteNum: '227406',
            price: 3950,
            items: '15 Mobile Readers, 1,030 Licenses',
            quoteDate: '2025-10-22',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'sycamore-hills',
    name: 'Lakewood',
    stage: 'Active',
    state: 'IL',
    contact: 'Nathan Reed',
    contactEmail: 'nreed@lakewoodcorp.com',
    studentCount: 4400,
    arr2526: 30800,
    arr2627: 32340,
    oneTimeRevenue: 8800,
    hardware: { kiosks: 8 },
    schools: [
      {
        code: 'SHHS',
        name: 'Lakewood Corp HQ',
        quotes: [
          {
            id: 'sh-q1',
            quoteNum: '934801',
            price: 19600,
            items: '2,800 Licenses $7.00ea',
            quoteDate: '2025-08-12',
            poNum: '26-44120',
            poDate: '2025-08-29',
            status: 'paid',
          },
          {
            id: 'sh-q2',
            quoteNum: '961247',
            price: 8800,
            items: '8 Check-in Kiosk Units',
            quoteDate: '2025-09-18',
            poNum: '26-48002',
            poDate: '2025-10-05',
            status: 'paid',
          },
        ],
      },
      {
        code: 'SHMS',
        name: 'Lakewood West Office',
        quotes: [
          {
            id: 'sh-q3',
            quoteNum: '978034',
            price: 11200,
            items: '1,600 Licenses $7.00ea',
            quoteDate: '2025-10-15',
            poNum: '26-51034',
            poDate: '2025-11-01',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'forest-glen',
    name: 'Clearwater',
    stage: 'Active',
    state: 'WI',
    contact: 'Amy Hartmann',
    contactEmail: 'ahartmann@clearwaterco.com',
    studentCount: 1800,
    arr2526: 12600,
    arr2627: 13230,
    oneTimeRevenue: 4400,
    hardware: { kiosks: 4 },
    schools: [
      {
        code: 'FGHS',
        name: 'Clearwater Corp HQ',
        quotes: [
          {
            id: 'fg-q1',
            quoteNum: '304512',
            price: 12600,
            items: '1,800 Licenses $7.00ea',
            quoteDate: '2025-09-03',
            poNum: '26-36710',
            poDate: '2025-09-20',
            status: 'paid',
          },
          {
            id: 'fg-q2',
            quoteNum: '328019',
            price: 4400,
            items: '4 Check-in Kiosk Units, 200 Badge Cards',
            quoteDate: '2025-11-08',
            poNum: '26-39845',
            poDate: '2025-11-25',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'harborview',
    name: 'Harborview',
    stage: 'Active',
    state: 'WA',
    contact: 'Kevin Marsh',
    contactEmail: 'kmarsh@harborviewinc.com',
    studentCount: 6100,
    arr2526: 42700,
    arr2627: 44835,
    oneTimeRevenue: 6400,
    schools: [
      {
        code: 'HVHS',
        name: 'Harborview Corp HQ',
        quotes: [
          {
            id: 'hv-q1',
            quoteNum: '415603',
            price: 28000,
            items: '4,000 Licenses $7.00ea',
            quoteDate: '2025-07-28',
            poNum: '26-71240',
            poDate: '2025-08-14',
            status: 'paid',
          },
          {
            id: 'hv-q2',
            quoteNum: '439281',
            price: 6400,
            items: '800 Badge Cards $8.00ea',
            quoteDate: '2025-10-02',
            poNum: '26-75901',
            poDate: '2025-10-19',
            status: 'paid',
          },
        ],
      },
      {
        code: 'HVMS',
        name: 'Harborview South Office',
        quotes: [
          {
            id: 'hv-q3',
            quoteNum: '462910',
            price: 14700,
            items: '2,100 Licenses $7.00ea',
            quoteDate: '2025-09-16',
            poNum: '26-73050',
            poDate: '2025-10-03',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'willowbrook',
    name: 'Sunrise',
    stage: 'Pending PO',
    state: 'NJ',
    contact: 'Diana Calloway',
    contactEmail: 'dcalloway@sunrisesolutions.com',
    studentCount: 3100,
    arr2526: 22100,
    arr2627: 23205,
    oneTimeRevenue: 0,
    schools: [
      {
        code: 'WBHS',
        name: 'Sunrise Corp HQ',
        quotes: [
          {
            id: 'wb-q1',
            quoteNum: '809415',
            price: 34875,
            items: '3,100 Licenses $7.13ea, 50 Mobile Readers',
            quoteDate: '2025-10-30',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'valley-ridge',
    name: 'Vantage Ridge',
    stage: 'Active',
    state: 'CO',
    contact: 'Eric Sandoval',
    contactEmail: 'esandoval@vantageridge.com',
    studentCount: 3000,
    arr2526: 21000,
    arr2627: 22050,
    oneTimeRevenue: 4000,
    schools: [
      {
        code: 'VRHS',
        name: 'Vantage Ridge Corp HQ',
        quotes: [
          {
            id: 'vr-q1',
            quoteNum: '551803',
            price: 21000,
            items: '3,000 Licenses $7.00ea',
            quoteDate: '2025-08-08',
            poNum: '26-18540',
            poDate: '2025-08-25',
            status: 'paid',
          },
          {
            id: 'vr-q2',
            quoteNum: '574901',
            price: 4000,
            items: '500 Badge Cards $8.00ea',
            quoteDate: '2025-10-14',
            poNum: '26-22013',
            poDate: '2025-10-31',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'birchwood',
    name: 'Ironwood East',
    stage: 'Active',
    state: 'MI',
    contact: 'Laura Kim',
    contactEmail: 'lkim@ironwoodeast.com',
    studentCount: 3800,
    arr2526: 26600,
    arr2627: 27930,
    oneTimeRevenue: 3200,
    schools: [
      {
        code: 'BWHS',
        name: 'Ironwood East Corp HQ',
        quotes: [
          {
            id: 'bw-q1',
            quoteNum: '680145',
            price: 16800,
            items: '2,400 Licenses $7.00ea',
            quoteDate: '2025-08-18',
            poNum: '26-29600',
            poDate: '2025-09-04',
            status: 'paid',
          },
        ],
      },
      {
        code: 'BWMS',
        name: 'Ironwood East Regional Office',
        quotes: [
          {
            id: 'bw-q2',
            quoteNum: '712038',
            price: 9800,
            items: '1,400 Licenses $7.00ea',
            quoteDate: '2025-09-25',
            poNum: '26-32104',
            poDate: '2025-10-12',
            status: 'paid',
          },
          {
            id: 'bw-q3',
            quoteNum: '738501',
            price: 3200,
            items: '400 Badge Cards $8.00ea',
            quoteDate: '2025-11-10',
            poNum: '26-35780',
            poDate: '2025-11-27',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'north-riverside',
    name: 'Apex North',
    stage: 'Active',
    state: 'CA',
    contact: 'Brian Santos',
    contactEmail: 'bsantos@apexnorth.com',
    studentCount: 3500,
    arr2526: 24500,
    arr2627: 25725,
    oneTimeRevenue: 5600,
    schools: [
      {
        code: 'NRHS',
        name: 'Apex North Corp HQ',
        quotes: [
          {
            id: 'nr-q1',
            quoteNum: '825610',
            price: 24500,
            items: '3,500 Licenses $7.00ea',
            quoteDate: '2025-07-22',
            poNum: '26-58430',
            poDate: '2025-08-08',
            status: 'paid',
          },
          {
            id: 'nr-q2',
            quoteNum: '849073',
            price: 5600,
            items: '700 Badge Cards $8.00ea',
            quoteDate: '2025-09-29',
            poNum: '26-62980',
            poDate: '2025-10-16',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'lakeside',
    name: 'Lakewood South',
    stage: 'Active',
    state: 'GA',
    contact: 'Monica Webb',
    contactEmail: 'mwebb@lakewoodsouth.com',
    studentCount: 2600,
    arr2526: 18200,
    arr2627: 19110,
    oneTimeRevenue: 8800,
    hardware: { kiosks: 8 },
    schools: [
      {
        code: 'LSHS',
        name: 'Lakewood South Corp HQ',
        quotes: [
          {
            id: 'ls-q1',
            quoteNum: '907341',
            price: 18200,
            items: '2,600 Licenses $7.00ea',
            quoteDate: '2025-08-25',
            poNum: '26-41220',
            poDate: '2025-09-11',
            status: 'paid',
          },
          {
            id: 'ls-q2',
            quoteNum: '928405',
            price: 8800,
            items: '8 Check-in Kiosk Units, 200 Badge Cards',
            quoteDate: '2025-10-20',
            poNum: '26-45670',
            poDate: '2025-11-06',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'coral-cove',
    name: 'Nexus South',
    stage: 'Active',
    state: 'FL',
    contact: 'Stacy Ortega',
    contactEmail: 'sortega@nexussouth.com',
    studentCount: 1900,
    arr2526: 13300,
    arr2627: 13965,
    oneTimeRevenue: 4800,
    schools: [
      {
        code: 'CCHS',
        name: 'Nexus South Corp HQ',
        quotes: [
          {
            id: 'cc-q1',
            quoteNum: '143870',
            price: 13300,
            items: '1,900 Licenses $7.00ea',
            quoteDate: '2025-09-08',
            poNum: '26-11540',
            poDate: '2025-09-25',
            status: 'paid',
          },
          {
            id: 'cc-q2',
            quoteNum: '167294',
            price: 4800,
            items: '600 Badge Cards $8.00ea',
            quoteDate: '2025-11-04',
            poNum: '26-15890',
            poDate: '2025-11-21',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'stonegate',
    name: 'Summit West',
    stage: 'Active',
    state: 'AZ',
    contact: 'Chris Navarro',
    contactEmail: 'cnavarro@summitwest.com',
    studentCount: 5500,
    arr2526: 38500,
    arr2627: 40425,
    oneTimeRevenue: 5200,
    schools: [
      {
        code: 'SGHS',
        name: 'Summit West Corp HQ',
        quotes: [
          {
            id: 'sg-q1',
            quoteNum: '254730',
            price: 26600,
            items: '3,800 Licenses $7.00ea',
            quoteDate: '2025-08-10',
            poNum: '26-28300',
            poDate: '2025-08-27',
            status: 'paid',
          },
          {
            id: 'sg-q2',
            quoteNum: '278910',
            price: 5200,
            items: '650 Badge Cards $8.00ea',
            quoteDate: '2025-10-25',
            poNum: '26-32450',
            poDate: '2025-11-11',
            status: 'paid',
          },
        ],
      },
      {
        code: 'SGMS',
        name: 'Summit West Regional Office',
        quotes: [
          {
            id: 'sg-q3',
            quoteNum: '301445',
            price: 11900,
            items: '1,700 Licenses $7.00ea',
            quoteDate: '2025-09-20',
            poNum: '26-30190',
            poDate: '2025-10-07',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'clearwater',
    name: 'Clearwater Bay',
    stage: 'Active',
    state: 'FL',
    contact: 'Tanya Brooks',
    contactEmail: 'tbrooks@clearwaterbay.com',
    studentCount: 5000,
    arr2526: 35000,
    arr2627: 36750,
    oneTimeRevenue: 7200,
    schools: [
      {
        code: 'CWHS',
        name: 'Clearwater Bay Corp HQ',
        quotes: [
          {
            id: 'cw-q1',
            quoteNum: '483021',
            price: 35000,
            items: '5,000 Licenses $7.00ea',
            quoteDate: '2025-07-15',
            poNum: '26-82014',
            poDate: '2025-08-01',
            status: 'paid',
          },
          {
            id: 'cw-q2',
            quoteNum: '508734',
            price: 7200,
            items: '900 Badge Cards $8.00ea',
            quoteDate: '2025-09-06',
            poNum: '26-86230',
            poDate: '2025-09-23',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'sunrise-academy',
    name: 'Sunrise',
    stage: 'At Risk',
    state: 'NV',
    contact: 'Paul Decker',
    contactEmail: 'pdecker@sunrisevg.com',
    studentCount: 100,
    arr2526: 0,
    arr2627: 850,
    oneTimeRevenue: 850,
    boces: 'SMB',
    schools: [
      {
        code: 'SunAcad',
        name: 'Sunrise Ventures Group',
        quotes: [
          {
            id: 'sa-q1',
            quoteNum: '943299',
            price: 850,
            items: '100 Badge Cards $8.50ea',
            quoteDate: '2025-11-14',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'foxhill',
    name: 'Crestline East',
    stage: 'Pending PO',
    state: 'PA',
    contact: 'Gretchen Holt',
    contactEmail: 'gholt@crestlineeast.com',
    studentCount: 2000,
    arr2526: 14260,
    arr2627: 14973,
    oneTimeRevenue: 9025,
    hardware: { poeReaders: 140 },
    schools: [
      {
        code: 'FHHS',
        name: 'Crestline East Corp HQ',
        quotes: [
          {
            id: 'fh-q1',
            quoteNum: '403630',
            price: 14260,
            items: '2,000 Licenses $7.13ea',
            quoteDate: '2025-09-28',
            poNum: '26-89488',
            poDate: '2025-10-15',
            status: 'paid',
          },
          {
            id: 'fh-q2',
            quoteNum: '559940',
            price: 9025,
            items: '140 PoE Scanners',
            quoteDate: '2025-11-20',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'meadowbrook',
    name: 'Bay State',
    stage: 'Active',
    state: 'OH',
    contact: 'Justin Pierce',
    contactEmail: 'jpierce@baystateco.com',
    studentCount: 4100,
    arr2526: 28700,
    arr2627: 30135,
    oneTimeRevenue: 6400,
    schools: [
      {
        code: 'MBHS',
        name: 'Bay State Corp HQ',
        quotes: [
          {
            id: 'mb-q1',
            quoteNum: '615892',
            price: 19600,
            items: '2,800 Licenses $7.00ea',
            quoteDate: '2025-08-22',
            poNum: '26-25018',
            poDate: '2025-09-08',
            status: 'paid',
          },
          {
            id: 'mb-q2',
            quoteNum: '639104',
            price: 6400,
            items: '800 Badge Cards $8.00ea',
            quoteDate: '2025-10-16',
            poNum: '26-28904',
            poDate: '2025-11-02',
            status: 'paid',
          },
        ],
      },
      {
        code: 'MBMS',
        name: 'Bay State Regional Office',
        quotes: [
          {
            id: 'mb-q3',
            quoteNum: '662318',
            price: 9100,
            items: '1,300 Licenses $7.00ea',
            quoteDate: '2025-09-30',
            poNum: '26-26780',
            poDate: '2025-10-17',
            status: 'paid',
          },
        ],
      },
    ],
  },
  {
    id: 'suncoast',
    name: 'Suncoast',
    stage: 'Pending PO',
    state: 'FL',
    contact: 'Angela Moore',
    contactEmail: 'amoore@suncoastgroup.com',
    studentCount: 1450,
    arr2526: 10175,
    arr2627: 10684,
    oneTimeRevenue: 1875,
    schools: [
      {
        code: 'SCA',
        name: 'Suncoast Group HQ',
        quotes: [
          {
            id: 'sc-q1',
            quoteNum: '278009',
            price: 10175,
            items: '1,450 Licenses $7.02ea',
            quoteDate: '2025-10-10',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
      {
        code: 'BCA',
        name: 'Suncoast Bay Office',
        quotes: [
          {
            id: 'sc-q2',
            quoteNum: '328996',
            price: 1875,
            items: '250 Badge Cards $7.50ea',
            quoteDate: '2025-10-25',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'bay-state',
    name: 'Bay State Ventures',
    stage: 'New',
    state: 'MA',
    contact: 'Richard Chen',
    contactEmail: 'rchen@baystatevg.com',
    studentCount: 75,
    arr2526: 0,
    arr2627: 675,
    oneTimeRevenue: 675,
    boces: 'Enterprise',
    schools: [
      {
        code: 'HTVTHS',
        name: 'Bay State Ventures HQ',
        quotes: [
          {
            id: 'bs-q1',
            quoteNum: '643516',
            price: 675,
            items: '75 Badge Cards $9.00ea',
            quoteDate: '2025-11-18',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
  {
    id: 'lone-star',
    name: 'Lone Star',
    stage: 'Pending PO',
    state: 'TX',
    contact: 'Carlos Vega',
    contactEmail: 'cvega@lonestartech.com',
    studentCount: 1250,
    arr2526: 8910,
    arr2627: 9356,
    oneTimeRevenue: 0,
    hardware: { handhelds: 75 },
    schools: [
      {
        code: 'LPA',
        name: 'Lone Star Tech HQ',
        quotes: [
          {
            id: 'ls2-q1',
            quoteNum: '792052',
            price: 11225,
            items: '1,250 Licenses $7.13ea, 75 Mobile Readers',
            quoteDate: '2025-11-05',
            poNum: null,
            poDate: null,
            status: 'noPO',
          },
        ],
      },
    ],
  },
];

export const activities: Activity[] = [
  {
    id: 'act-1',
    type: 'po_received',
    district: 'Crestline East',
    description: 'PO 26-89488 received for 2,000 Licenses — Q 403630 closed.',
    date: '2025-10-15',
    amount: 14260,
  },
  {
    id: 'act-2',
    type: 'quote_sent',
    district: 'Lone Star',
    description: 'Sent Q 792052 ($11,225) to Carlos Vega at Lone Star Tech.',
    date: '2025-11-05',
    amount: 11225,
  },
  {
    id: 'act-3',
    type: 'follow_up',
    district: 'Sunrise',
    description: 'Followed up with Diana Calloway on Q 809415 ($34,875) — no PO yet.',
    date: '2025-11-12',
    amount: 34875,
  },
  {
    id: 'act-4',
    type: 'quote_sent',
    district: 'Crestline East',
    description: 'Sent Q 559940 ($9,025) for 140 PoE Scanners.',
    date: '2025-11-20',
    amount: 9025,
  },
  {
    id: 'act-5',
    type: 'meeting',
    district: 'Bay State Ventures',
    description: 'Intro call with Richard Chen — small pilot opportunity, Q 643516 sent.',
    date: '2025-11-18',
  },
  {
    id: 'act-6',
    type: 'quote_sent',
    district: 'Suncoast',
    description: 'Sent Q 278009 ($10,175) to Suncoast Group HQ and Q 328996 ($1,875) to Suncoast Bay Office.',
    date: '2025-10-25',
    amount: 12050,
  },
  {
    id: 'act-7',
    type: 'follow_up',
    district: 'Ironwood',
    description: 'Second follow-up on Q 227406 ($3,950) — Rebecca Torres unresponsive.',
    date: '2025-11-22',
    amount: 3950,
  },
  {
    id: 'act-8',
    type: 'po_received',
    district: 'Clearwater Bay',
    description: 'PO 26-86230 received for 900 Badge Cards — Q 508734 closed.',
    date: '2025-09-23',
    amount: 7200,
  },
  {
    id: 'act-9',
    type: 'install',
    district: 'Harborview',
    description: 'On-site install completed at Harborview Corp HQ — 4,000 licenses activated.',
    date: '2025-08-20',
    amount: 28000,
  },
  {
    id: 'act-10',
    type: 'follow_up',
    district: 'Sunrise',
    description: 'Sent pricing reminder on Q 943299 ($850) — deal at risk.',
    date: '2025-11-25',
    amount: 850,
  },
  {
    id: 'act-11',
    type: 'meeting',
    district: 'Nexus',
    description: 'Budget review call with James Whitfield — 3 quotes still pending PO.',
    date: '2025-11-19',
    amount: 29425,
  },
  {
    id: 'act-12',
    type: 'po_received',
    district: 'Nexus',
    description: 'PO 26-40373 received for Q 978608 ($44,775).',
    date: '2025-10-10',
    amount: 44775,
  },
];

export function totalValue(d: District): number {
  return d.schools.reduce((acc, school) => {
    return acc + school.quotes.reduce((qAcc, q) => qAcc + q.price, 0);
  }, 0);
}

export function outstanding(d: District): number {
  return d.schools.reduce((acc, school) => {
    return acc + school.quotes
      .filter(q => q.status === 'noPO' || q.status === 'pending')
      .reduce((qAcc, q) => qAcc + q.price, 0);
  }, 0);
}

export function allQuotes(dists: District[]): Array<Quote & { districtName: string; districtId: string }> {
  return dists.flatMap(d =>
    d.schools.flatMap(s =>
      s.quotes.map(q => ({ ...q, districtName: d.name, districtId: d.id }))
    )
  );
}

export function stageColor(stage: Stage): string {
  switch (stage) {
    case 'Active':
      return 'text-[#22c55e] bg-[#22c55e]/10';
    case 'Pending PO':
      return 'text-[#f59e0b] bg-[#f59e0b]/10';
    case 'At Risk':
      return 'text-[#ef4444] bg-[#ef4444]/10';
    case 'New':
      return 'text-[#3b82f6] bg-[#3b82f6]/10';
    default:
      return 'text-[#71717a] bg-[#71717a]/10';
  }
}

// Lat/lng for deal heatmap — approximate account locations by state
export const districtCoords: Record<string, [number, number]> = {
  'riverside':        [33.98, -117.37],
  'oakwood':          [29.19, -82.13],
  'maple-creek':      [41.48, -81.80],
  'cedar-falls':      [42.52, -92.44],
  'blue-lake':        [45.55, -94.00],
  'pinehurst':        [35.19, -79.47],
  'elmwood':          [32.75, -97.33],
  'sycamore-hills':   [42.00, -88.33],
  'forest-glen':      [44.52, -88.02],
  'harborview':       [47.60, -122.33],
  'willowbrook':      [40.74, -74.20],
  'valley-ridge':     [39.73, -104.98],
  'birchwood':        [43.00, -83.69],
  'north-riverside':  [33.95, -117.54],
  'lakeside':         [33.95, -84.18],
  'coral-cove':       [25.77, -80.19],
  'stonegate':        [33.45, -112.07],
  'clearwater':       [27.96, -82.80],
  'sunrise-academy':  [36.17, -115.14],
  'foxhill':          [39.95, -75.16],
  'meadowbrook':      [40.02, -83.06],
  'suncoast':         [26.12, -80.14],
  'bay-state':        [42.36, -71.06],
  'lone-star':        [30.27, -97.74],
};

export function statusColor(s: QuoteStatus): { text: string; bg: string } {
  switch (s) {
    case 'paid':
      return { text: '#22c55e', bg: 'rgba(34,197,94,0.10)' };
    case 'noPO':
      return { text: '#f59e0b', bg: 'rgba(245,158,11,0.10)' };
    case 'pending':
      return { text: '#3b82f6', bg: 'rgba(59,130,246,0.10)' };
    case 'unknown':
    default:
      return { text: '#71717a', bg: 'rgba(113,113,122,0.10)' };
  }
}
