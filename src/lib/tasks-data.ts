export type TaskType = 'call' | 'email' | 'follow_up' | 'meeting' | 'quote' | 'admin';
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  districtId?: string;
  districtName?: string;
  dueDate: string;
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
    districtName: 'James Whitfield',
    dueDate: '2025-11-25',
    priority: 'urgent',
    done: false,
    type: 'call',
    notes: 'He connected with 2 rival reps this week. Do not let the proposal go cold.',
  },
  {
    id: 't2',
    title: 'Get Diana Calloway\'s proposal on Dec 10 board meeting agenda',
    districtId: 'willowbrook',
    districtName: 'Diana Calloway',
    dueDate: '2025-11-25',
    priority: 'urgent',
    done: false,
    type: 'email',
    notes: 'Email Diana Calloway — ask her to add the $34,875 proposal to Dec 10 board agenda. Under $50K threshold.',
  },
  {
    id: 't3',
    title: 'Send funding eligibility note to Gretchen Holt',
    districtId: 'foxhill',
    districtName: 'Gretchen Holt',
    dueDate: '2025-11-26',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'Relevant line items on the proposal are grant-eligible. $48K allocation just confirmed.',
  },
  {
    id: 't4',
    title: 'Follow up Carlos Vega — open proposal',
    districtId: 'lone-star',
    districtName: 'Carlos Vega',
    dueDate: '2025-11-26',
    priority: 'high',
    done: false,
    type: 'follow_up',
    notes: 'He posted publicly about evaluating systems. Warm moment. Reply to his LinkedIn post first.',
  },
  {
    id: 't5',
    title: 'Re-introduce platform to Rebecca Torres — new contact at Elmwood',
    districtId: 'elmwood',
    districtName: 'Rebecca Torres',
    dueDate: '2025-11-27',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'Leadership changed. Proposal at risk. Need to rebuild the contact relationship.',
  },
  {
    id: 't6',
    title: 'Send compliance deadline email to Angela Moore',
    districtId: 'suncoast',
    districtName: 'Angela Moore',
    dueDate: '2025-11-27',
    priority: 'high',
    done: false,
    type: 'email',
    notes: 'New compliance mandate by March 2026 creates urgency for the open proposal.',
  },
  {
    id: 't7',
    title: 'Prep demo for Gretchen Holt regional showcase',
    districtId: 'foxhill',
    districtName: 'Gretchen Holt',
    dueDate: '2025-12-01',
    priority: 'high',
    done: false,
    type: 'meeting',
    notes: 'Showcase is Jan 14. 12 organizations attending. Ask Gretchen for a 10-min slot.',
  },
  {
    id: 't8',
    title: 'Upsell Paul Decker from pilot to full engagement package',
    districtId: 'sunrise-academy',
    districtName: 'Paul Decker',
    dueDate: '2025-12-02',
    priority: 'normal',
    done: false,
    type: 'quote',
    notes: 'Open enrollment Dec 3 — contact Paul about new bundle before the event.',
  },
  {
    id: 't9',
    title: 'Send Richard Chen follow-up on pilot proposal',
    districtId: 'bay-state',
    districtName: 'Richard Chen',
    dueDate: '2025-12-03',
    priority: 'normal',
    done: false,
    type: 'follow_up',
    notes: 'Small pilot. Close it quickly to establish the relationship.',
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
    title: 'PO logged — confirm James Whitfield install date',
    districtId: 'oakwood',
    districtName: 'James Whitfield',
    dueDate: '2025-10-12',
    priority: 'low',
    done: true,
    type: 'call',
  },
  {
    id: 't12',
    title: 'Harborview engagement completed — send thank you + review ask',
    districtId: 'harborview',
    districtName: 'Harborview',
    dueDate: '2025-08-22',
    priority: 'low',
    done: true,
    type: 'email',
  },
];
