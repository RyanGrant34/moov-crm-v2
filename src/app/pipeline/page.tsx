'use client';

import { useMemo, useState, useCallback } from 'react';
import { AlertTriangle, School, DollarSign, Calendar, Zap, CheckCircle2, Clock, Radio, Flame } from 'lucide-react';
import { PipelineFlow } from '@/components/pipeline-flow';
import { leadScore } from '@/lib/scoring';
import {
  districts,
  totalValue,
  outstanding,
  type District,
  type Stage,
} from '@/lib/data';

interface KanbanColumn {
  id: string;
  label: string;
  accentColor: string;
  districts: District[];
}

function formatK(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

function lastActivityDate(d: District): string | null {
  const allDates = d.schools.flatMap(s =>
    s.quotes.flatMap(q => [q.poDate ?? q.quoteDate])
  );
  if (allDates.length === 0) return null;
  const sorted = allDates.filter((x): x is string => Boolean(x)).sort((a, b) => (a > b ? -1 : 1));
  if (!sorted[0]) return null;
  const dt = new Date(sorted[0]);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildColumns(dists: District[]): KanbanColumn[] {
  return [
    { id: 'new', label: 'New', accentColor: '#3b82f6', districts: dists.filter(d => d.stage === 'New') },
    { id: 'contacted', label: 'Contacted', accentColor: '#8b5cf6', districts: [] },
    { id: 'qualified', label: 'Qualified', accentColor: '#f59e0b', districts: dists.filter(d => d.stage === 'At Risk') },
    { id: 'proposal', label: 'Proposal Sent', accentColor: '#fb923c', districts: dists.filter(d => d.stage === 'Pending PO') },
    { id: 'won', label: 'Won', accentColor: '#22c55e', districts: dists.filter(d => d.stage === 'Active') },
  ];
}

const stageTagColors: Record<Stage, { text: string; bg: string }> = {
  Active: { text: '#22c55e', bg: 'rgba(34,197,94,0.10)' },
  'Pending PO': { text: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  'At Risk': { text: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  New: { text: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
};

// Mock sequence definitions per stage
const SEQUENCES: Record<Stage, { name: string; nextAction: string; timer: string }> = {
  New: {
    name: 'Intro Sequence',
    nextAction: 'Intro email',
    timer: '2d 4h',
  },
  'Pending PO': {
    name: 'PO Follow-up',
    nextAction: 'Follow-up call',
    timer: '18h 30m',
  },
  'At Risk': {
    name: 'Re-Engagement',
    nextAction: 'Escalation email',
    timer: '4h 15m',
  },
  Active: {
    name: 'Renewal Prep',
    nextAction: 'Check-in email',
    timer: '28d',
  },
};

interface WebhookToast {
  districtName: string;
  id: string;
}

interface DistrictCardProps {
  district: District;
  isAtRisk: boolean;
  autoPilotOn: boolean;
  onToggleAutoPilot: (id: string) => void;
  onWebhookFired: (name: string) => void;
}

function DistrictCard({ district, isAtRisk, autoPilotOn, onToggleAutoPilot, onWebhookFired }: DistrictCardProps) {
  const value = totalValue(district);
  const schoolCount = district.schools.length;
  const lastDate = lastActivityDate(district);
  const stageTag = stageTagColors[district.stage];
  const outstandingVal = outstanding(district);
  const seq = SEQUENCES[district.stage];
  const score = leadScore(district);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAutoPilot(district.id);
    if (!autoPilotOn) {
      onWebhookFired(district.name);
    }
  };

  return (
    <div className={`relative bg-[#111113] border rounded-lg p-3.5 cursor-pointer transition-all group ${
      autoPilotOn
        ? 'border-[#22c55e]/40 shadow-[0_0_12px_rgba(34,197,94,0.08)]'
        : 'border-[#27272a] hover:border-[#3f3f46]'
    }`}>
      {/* Auto-pilot live indicator */}
      {autoPilotOn && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
          </span>
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isAtRisk && <AlertTriangle className="w-3.5 h-3.5 text-[#fb923c] flex-shrink-0" />}
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#e4e4e7]">
            {district.name}
          </h3>
          {district.state && (
            <span className="text-xs text-[#52525b] flex-shrink-0">{district.state}</span>
          )}
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ color: stageTag.text, backgroundColor: stageTag.bg }}
        >
          {district.stage}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-center gap-1 mb-2">
        <DollarSign className="w-3 h-3 text-[#a1a1aa]" />
        <span className="text-sm font-bold text-[#22c55e]">{formatK(value)}</span>
        {outstandingVal > 0 && (
          <span className="text-xs text-[#f59e0b] ml-1">({formatK(outstandingVal)} open)</span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-[#71717a] mb-2.5">
        <div className="flex items-center gap-1">
          <School className="w-3 h-3" />
          <span>{schoolCount} {schoolCount === 1 ? 'school' : 'schools'}</span>
        </div>
        {lastDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{lastDate}</span>
          </div>
        )}
      </div>

      {/* Auto-Pilot toggle */}
      <div
        className={`border rounded-md px-2.5 py-1.5 transition-all ${
          autoPilotOn
            ? 'border-[#22c55e]/30 bg-[#22c55e]/8'
            : 'border-[#27272a] bg-[#0f0f10]'
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Radio className={`w-3 h-3 ${autoPilotOn ? 'text-[#22c55e]' : 'text-[#3f3f46]'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${autoPilotOn ? 'text-[#22c55e]' : 'text-[#52525b]'}`}>
              Auto-Pilot
            </span>
          </div>
          {/* Toggle switch */}
          <div className={`w-7 h-4 rounded-full relative transition-colors ${autoPilotOn ? 'bg-[#22c55e]' : 'bg-[#27272a]'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoPilotOn ? 'left-3.5' : 'left-0.5'}`} />
          </div>
        </div>

        {autoPilotOn && (
          <div className="space-y-0.5 mt-1">
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#22c55e]" />
              <span className="text-[10px] text-[#a1a1aa] font-medium">{seq.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-[#f59e0b]" />
              <span className="text-[10px] text-[#f59e0b]">{seq.nextAction} in {seq.timer}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#52525b]" />
              <span className="text-[10px] text-[#52525b]">Webhook → n8n active</span>
            </div>
          </div>
        )}
      </div>

      {/* Lead score + contact */}
      <div className="mt-2 pt-2 border-t border-[#27272a] flex items-center justify-between">
        {district.contact
          ? <p className="text-xs text-[#52525b] truncate">{district.contact}</p>
          : <span />
        }
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
          style={{ color: score.color, background: score.bg }}
          title={score.factors.map(f => `${f.label}: ${f.delta > 0 ? '+' : ''}${f.delta}`).join(' | ')}
        >
          <Flame className="w-2.5 h-2.5" />
          {score.total} {score.label}
        </div>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [autoPilotSet, setAutoPilotSet] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<WebhookToast[]>([]);

  const columns = useMemo(() => buildColumns(districts), []);
  const totalDistricts = districts.length;
  const autoPilotCount = autoPilotSet.size;

  const atRiskIds = useMemo(
    () => new Set(districts.filter(d => d.stage === 'At Risk').map(d => d.id)),
    []
  );

  const handleToggleAutoPilot = useCallback((id: string) => {
    setAutoPilotSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleWebhookFired = useCallback((name: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { districtName: name, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Mapper</h1>
          <p className="text-[#a1a1aa] text-sm mt-0.5">
            {totalDistricts} districts across pipeline
            {autoPilotCount > 0 && (
              <span className="ml-2 text-[#22c55e]">· {autoPilotCount} on Auto-Pilot</span>
            )}
          </p>
        </div>

        {/* Ghost Protocol legend */}
        <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
            </span>
            <span className="text-xs text-[#a1a1aa] font-medium">Ghost Protocol</span>
          </div>
          <span className="text-[#27272a]">|</span>
          <span className="text-xs text-[#52525b]">Toggle Auto-Pilot on any card to activate n8n sequences</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colTotal = col.districts.reduce((sum, d) => sum + totalValue(d), 0);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-64 bg-[#0f0f10] rounded-lg overflow-hidden"
              style={{ borderTop: `2px solid ${col.accentColor}` }}
            >
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-[#e4e4e7]">{col.label}</h2>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ color: col.accentColor, backgroundColor: `${col.accentColor}18` }}
                  >
                    {col.districts.length}
                  </span>
                </div>
                <p className="text-xs text-[#52525b] font-medium">{formatK(colTotal)}</p>
              </div>

              <div className="h-px bg-[#27272a] mx-3" />

              <div className="p-3 space-y-2 min-h-[120px]">
                {col.districts.length === 0 ? (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-[#3f3f46]">No districts</p>
                  </div>
                ) : (
                  col.districts.map(district => (
                    <DistrictCard
                      key={district.id}
                      district={district}
                      isAtRisk={atRiskIds.has(district.id)}
                      autoPilotOn={autoPilotSet.has(district.id)}
                      onToggleAutoPilot={handleToggleAutoPilot}
                      onWebhookFired={handleWebhookFired}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Flow Chart */}
      <div className="bg-[#0f0f10] border border-[#1c1c1e] rounded-xl p-6 mt-6">
        <PipelineFlow />
      </div>

      {/* Webhook toast notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 bg-[#111113] border border-[#22c55e]/40 rounded-lg px-4 py-3 shadow-xl animate-in fade-in slide-in-from-bottom-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">{toast.districtName} — Auto-Pilot Activated</p>
              <p className="text-[10px] text-[#52525b]">Webhook fired → n8n sequence started</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
