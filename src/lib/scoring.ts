import type { District } from './data';
import { pulseItems } from './pulse-data';

export interface ScoreBreakdown {
  total: number;
  label: 'Hot' | 'Warm' | 'Lukewarm' | 'Cold';
  color: string;
  bg: string;
  factors: Array<{ label: string; delta: number }>;
}

const REF_DATE = new Date('2025-11-25');

function daysSince(dateStr: string): number {
  return Math.floor((REF_DATE.getTime() - new Date(dateStr).getTime()) / 86400000);
}

export function leadScore(d: District): ScoreBreakdown {
  const factors: Array<{ label: string; delta: number }> = [];

  // Stage base
  const stageBase: Record<string, number> = {
    Active: 75,
    'Pending PO': 55,
    'At Risk': 25,
    New: 40,
  };
  const base = stageBase[d.stage] ?? 40;
  factors.push({ label: `Stage (${d.stage})`, delta: base });

  // Quote engagement
  const quotes = d.schools.flatMap(s => s.quotes);
  const paidCount = quotes.filter(q => q.status === 'paid').length;
  if (paidCount > 0) {
    const bonus = Math.min(paidCount * 3, 12);
    factors.push({ label: `${paidCount} paid quote${paidCount > 1 ? 's' : ''}`, delta: bonus });
  }

  // Outstanding penalty
  const noPOCount = quotes.filter(q => q.status === 'noPO').length;
  if (noPOCount > 0) {
    const penalty = -(noPOCount * 6);
    factors.push({ label: `${noPOCount} unpaid quote${noPOCount > 1 ? 's' : ''}`, delta: penalty });
  }

  // Recency
  const dates = quotes.map(q => q.poDate ?? q.quoteDate).filter(Boolean) as string[];
  if (dates.length > 0) {
    const latest = dates.sort().reverse()[0];
    const days = daysSince(latest);
    if (days <= 14) {
      factors.push({ label: 'Active last 2 weeks', delta: 12 });
    } else if (days <= 30) {
      factors.push({ label: 'Active last month', delta: 6 });
    } else if (days > 60) {
      factors.push({ label: 'No activity 60d+', delta: -10 });
    }
  }

  // Pulse signals
  const urgentSignals = pulseItems.filter(p => p.districtId === d.id && p.urgent).length;
  if (urgentSignals > 0) {
    factors.push({ label: `${urgentSignals} urgent signal${urgentSignals > 1 ? 's' : ''}`, delta: urgentSignals * 5 });
  }

  const total = Math.max(0, Math.min(100, factors.reduce((s, f) => s + f.delta, 0)));

  let label: ScoreBreakdown['label'];
  let color: string;
  let bg: string;

  if (total >= 75) { label = 'Hot'; color = '#22c55e'; bg = 'rgba(34,197,94,0.12)'; }
  else if (total >= 55) { label = 'Warm'; color = '#f59e0b'; bg = 'rgba(245,158,11,0.12)'; }
  else if (total >= 35) { label = 'Lukewarm'; color = '#fb923c'; bg = 'rgba(251,146,60,0.12)'; }
  else { label = 'Cold'; color = '#ef4444'; bg = 'rgba(239,68,68,0.12)'; }

  return { total, label, color, bg, factors };
}
