export type TaskType = 'call' | 'email' | 'follow_up' | 'meeting' | 'quote' | 'admin';
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  districtId?: string;
  districtName?: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  done: boolean;
  type: TaskType;
  notes?: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string; order: number }> = {
  urgent: { label: 'Urgent', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', order: 0 },
  high:   { label: 'High',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', order: 1 },
  normal: { label: 'Normal', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', order: 2 },
  low:    { label: 'Low',    color: '#71717a', bg: 'rgba(113,113,122,0.12)', order: 3 },
};

export const TYPE_CONFIG: Record<TaskType, { label: string; icon: string }> = {
  call:      { label: 'Call',      icon: '📞' },
  email:     { label: 'Email',     icon: '✉️' },
  follow_up: { label: 'Follow-up', icon: '🔁' },
  meeting:   { label: 'Meeting',   icon: '📅' },
  quote:     { label: 'Quote',     icon: '📄' },
  admin:     { label: 'Admin',     icon: '🗂️' },
};

export const defaultTasks: Task[] = [
  {
    id: 't1',
    title: 'Call James Whitfield — competitor activity detected on LinkedIn',
    districtId: 'oakwood',
    districtName: 'Oakwood',
    dueDate: '2025-11-25',
    priority: 'urgent',
    done: false,
    type: 'call',
    notes: 'He connected with 2 rival reps this week. Do not let Q 341813 go cold.',
  },
  {
    id: 't2',
    title: 'Get Willowbrook Q 809415 on Dec 10 board meeting agenda',
    districtId: 'willowbrook',
    districtName: 'Willowbrook',
    dueDate: '2025-11-25',
    priority: 'urgent',
    done: false,
    type: 'email',
    notes: 'Email Diana Calloway — ask her to add $34,875 PO to Dec 10 board agenda. Under $50K threshold.',
  },
  {
    id: 't3',
    title: 'Send E-Rate eligibility note to Gretchen Holt (Foxhill)',
    districtId: 'foxhill',
    districtName: 'Foxhill',
    dueDate: '2025-11-26',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'PoE Readers on Q 559940 are E-Rate eligible. $48K allocation just confirmed.',
  },
  {
    id: 't4',
    title: 'Follow up Carlos Vega — Lone Star Q 792052',
    districtId: 'lone-star',
    districtName: 'Lone Star',
    dueDate: '2025-11-26',
    priority: 'high',
    done: false,
    type: 'follow_up',
    notes: 'He posted publicly about ID systems. Warm moment. Reply to his LinkedIn post first.',
  },
  {
    id: 't5',
    title: 'Re-intro MOOV to new Elmwood interim superintendent',
    districtId: 'elmwood',
    districtName: 'Elmwood',
    dueDate: '2025-11-27',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'Old superintendent replaced. Q 227406 at risk. Need new contact relationship.',
  },
  {
    id: 't6',
    title: 'Send compliance deadline email to Angela Moore (Suncoast)',
    districtId: 'suncoast',
    districtName: 'Suncoast',
    dueDate: '2025-11-27',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'FL DOE mandates digital tracking by March 2026. Creates urgency for Q 278009.',
  },
  {
    id: 't7',
    title: 'Prep demo for Foxhill regional principals summit',
    districtId: 'foxhill',
    districtName: 'Foxhill',
    dueDate: '2025-12-01',
    priority: 'high',
    done: false,
    type: 'meeting',
    notes: 'Summit is Jan 14. 12 districts attending. Ask Gretchen for a 10-min slot.',
  },
  {
    id: 't8',
    title: 'Upsell Sunrise Academy from $850 pilot to full enrollment package',
    districtId: 'sunrise-academy',
    districtName: 'Sunrise Academy',
    dueDate: '2025-12-02',
    priority: 'normal',
    done: false,
    type: 'quote',
    notes: 'Open enrollment Dec 3 — contact Paul Decker about new student ID bundle.',
  },
  {
    id: 't9',
    title: 'Send Bay State Q 643516 follow-up',
    districtId: 'bay-state',
    districtName: 'Bay State',
    dueDate: '2025-12-03',
    priority: 'normal',
    done: false,
    type: 'follow_up',
    notes: 'Small $675 pilot. Close it quickly to establish the relationship.',
  },
  {
    id: 't10',
    title: 'Update Q2 pipeline forecast for board review',
    dueDate: '2025-11-28',
    priority: 'normal',
    done: false,
    type: 'admin',
    notes: 'Pull numbers from Finance tab. Include weighted close probabilities.',
  },
  {
    id: 't11',
    title: 'PO 26-40373 logged — confirm Oakwood install date',
    districtId: 'oakwood',
    districtName: 'Oakwood',
    dueDate: '2025-10-12',
    priority: 'low',
    done: true,
    type: 'call',
  },
  {
    id: 't12',
    title: 'Harborview install completed — send thank you + review ask',
    districtId: 'harborview',
    districtName: 'Harborview',
    dueDate: '2025-08-22',
    priority: 'low',
    done: true,
    type: 'email',
  },
];
