export type DeployPhase = 'confirmed' | 'hardware_ready' | 'onsite_ready' | 'installed' | 'live';

export interface SummerDeployment {
  id: string;
  district: string;
  school: string;
  installWeek: string;
  owner: string;
  hardware: { kiosks: number; readers: number; handhelds: number };
  itContact: string;
  principalContact: string;
  phase: DeployPhase;
  notes?: string;
}

export const PHASES: DeployPhase[] = [
  'confirmed',
  'hardware_ready',
  'onsite_ready',
  'installed',
  'live',
];

export const PHASE_META: Record<DeployPhase, {
  label: string;
  color: string;
  bg: string;
  borderColor: string;
  description: string;
}> = {
  confirmed: {
    label: 'Confirmed',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    borderColor: '#3b82f6',
    description: 'Signed & scheduled',
  },
  hardware_ready: {
    label: 'Hardware Ready',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    borderColor: '#8b5cf6',
    description: 'Staged & shipping',
  },
  onsite_ready: {
    label: 'On-Site Ready',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    borderColor: '#f59e0b',
    description: 'Delivered & prepped',
  },
  installed: {
    label: 'Installed',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    borderColor: '#fb923c',
    description: 'Hardware live, training pending',
  },
  live: {
    label: 'Live',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    borderColor: '#22c55e',
    description: 'Fully operational',
  },
};

export const PHASE_ORDER: Record<DeployPhase, number> = {
  confirmed: 0,
  hardware_ready: 1,
  onsite_ready: 2,
  installed: 3,
  live: 4,
};

export const PHASE_CHECKLIST: Record<DeployPhase, string[]> = {
  confirmed: [
    'Agreement signed and on file',
    'Hardware order placed — counts confirmed',
    'Install window confirmed with client contact',
    'IT contact identified',
    'Credentials requested',
  ],
  hardware_ready: [
    'Serial numbers logged per client',
    'Hardware staged and labeled',
    'Shipping label generated',
    'Tracking number recorded',
    'Expected delivery confirmed against install window',
  ],
  onsite_ready: [
    'Delivery confirmed by client contact (not just carrier)',
    'Network access confirmed by IT — ports open',
    'Mounting locations confirmed — power and placement',
    'Install date locked with on-site contact',
  ],
  installed: [
    'All readers showing online in dashboard',
    'Sync confirmed and pulling correctly',
    'Admin accounts created',
    'Test passes completed successfully',
    'Any hardware issues logged and flagged',
  ],
  live: [
    'Admin training completed',
    'Staff materials sent',
    'Client ran a test day before go-live',
    'Support contact info left with primary and IT contact',
    'Go-live date recorded',
  ],
};

export const deployments: SummerDeployment[] = [
  {
    id: 's1',
    district: 'Northfield',
    school: 'Account — 4 locations',
    installWeek: 'Jul 7',
    owner: 'Morgan',
    hardware: { kiosks: 8, readers: 24, handhelds: 12 },
    itContact: 'Dave Russo',
    principalContact: 'K. Alvarez',
    phase: 'confirmed',
  },
  {
    id: 's2',
    district: 'Blue Lake',
    school: 'Account — 2 locations',
    installWeek: 'Jul 14',
    owner: 'Jordan',
    hardware: { kiosks: 4, readers: 16, handhelds: 8 },
    itContact: 'Pending',
    principalContact: 'T. Monroe',
    phase: 'confirmed',
    notes: 'IT contact not yet identified — need to follow up',
  },
  {
    id: 's3',
    district: 'Harborview',
    school: 'Account — 5 locations',
    installWeek: 'Jul 7',
    owner: 'Taylor & Alex',
    hardware: { kiosks: 6, readers: 20, handhelds: 10 },
    itContact: 'S. Park',
    principalContact: 'R. Chen',
    phase: 'hardware_ready',
    notes: 'Shipping week of Jun 23',
  },
  {
    id: 's4',
    district: 'Creekstone',
    school: 'Account — 2 locations',
    installWeek: 'Jul 21',
    owner: 'Casey',
    hardware: { kiosks: 3, readers: 12, handhelds: 6 },
    itContact: 'M. Torres',
    principalContact: 'J. Williams',
    phase: 'hardware_ready',
  },
  {
    id: 's5',
    district: 'Lakewood',
    school: 'Account — 3 locations',
    installWeek: 'Jun 30',
    owner: 'Morgan',
    hardware: { kiosks: 5, readers: 18, handhelds: 8 },
    itContact: 'B. Kim',
    principalContact: 'A. Singh',
    phase: 'onsite_ready',
  },
  {
    id: 's6',
    district: 'Valley Ridge',
    school: 'Account — 1 location',
    installWeek: 'Jun 30',
    owner: 'Jordan',
    hardware: { kiosks: 2, readers: 8, handhelds: 4 },
    itContact: 'C. Nguyen',
    principalContact: 'P. Davis',
    phase: 'onsite_ready',
    notes: 'Network config still pending — IT has not confirmed port access',
  },
  {
    id: 's7',
    district: 'Foxhill',
    school: 'Account — 2 locations',
    installWeek: 'Jun 23',
    owner: 'Taylor & Alex',
    hardware: { kiosks: 4, readers: 14, handhelds: 6 },
    itContact: 'L. Martin',
    principalContact: 'D. Brown',
    phase: 'installed',
  },
  {
    id: 's8',
    district: 'Maple Creek',
    school: 'Account — 3 locations',
    installWeek: 'Jun 23',
    owner: 'Morgan',
    hardware: { kiosks: 3, readers: 10, handhelds: 5 },
    itContact: 'H. Wilson',
    principalContact: 'S. Garcia',
    phase: 'installed',
    notes: '1 reader offline — replacement shipped Jun 25',
  },
  {
    id: 's9',
    district: 'Greenfield',
    school: 'Account — 1 location',
    installWeek: 'Jun 16',
    owner: 'Casey',
    hardware: { kiosks: 2, readers: 8, handhelds: 4 },
    itContact: 'T. Lee',
    principalContact: 'N. Johnson',
    phase: 'live',
  },
  {
    id: 's10',
    district: 'Pinehurst',
    school: 'Account — 2 locations',
    installWeek: 'Jun 16',
    owner: 'Jordan',
    hardware: { kiosks: 3, readers: 12, handhelds: 6 },
    itContact: 'F. Adams',
    principalContact: 'L. Thompson',
    phase: 'live',
  },
];
