'use client';

import { useState } from 'react';
import { pulseItems, pulseTypeConfig } from '@/lib/pulse-data';
import type { PulseType } from '@/lib/pulse-data';
import { Zap, ExternalLink, ChevronRight, Search, AlertTriangle } from 'lucide-react';

const TYPE_FILTERS: Array<{ id: 'all' | PulseType; label: string }> = [
  { id: 'all', label: 'All Signals' },
  { id: 'budget', label: 'Budget' },
  { id: 'news', label: 'News' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'press_release', label: 'Press' },
  { id: 'event', label: 'Events' },
];

function timeAgo(dateStr: string): string {
  const diff = Math.floor((new Date('2025-11-25').getTime() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

export default function PulsePage() {
  const [typeFilter, setTypeFilter] = useState<'all' | PulseType>('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const urgentCount = pulseItems.filter(p => p.urgent).length;

  const districts = Array.from(new Set(pulseItems.map(p => p.districtName))).sort();

  const filtered = pulseItems.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (districtFilter !== 'all' && p.districtName !== districtFilter) return false;
    if (search && !p.headline.toLowerCase().includes(search.toLowerCase()) &&
        !p.districtName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sort urgent first
  const sorted = [...filtered].sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#22c55e]" />
          Company Pulse
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-0.5">
          News, budget signals, and LinkedIn activity from your target accounts — your &quot;reason to reach out&quot; feed
        </p>
      </div>

      {/* Alert banner */}
      {urgentCount > 0 && (
        <div className="flex items-center gap-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-4 py-3 mb-5">
          <AlertTriangle className="w-4 h-4 text-[#ef4444] flex-shrink-0" />
          <span className="text-sm text-[#fca5a5] font-medium">
            {urgentCount} urgent signal{urgentCount !== 1 ? 's' : ''} require immediate follow-up
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        {/* Type filter tabs */}
        <div className="flex gap-1.5 bg-[#111113] border border-[#27272a] rounded-lg p-1">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                typeFilter === f.id
                  ? 'bg-[#1c1c1f] text-white border border-[#3f3f46]'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* District filter */}
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="bg-[#111113] border border-[#27272a] text-[#a1a1aa] text-xs rounded-md px-2.5 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#52525b] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search signals…"
              className="bg-[#111113] border border-[#27272a] text-[#a1a1aa] text-xs rounded-md pl-8 pr-3 py-2 w-44 outline-none placeholder:text-[#52525b]"
            />
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-[#52525b] mb-3">{sorted.length} signal{sorted.length !== 1 ? 's' : ''}</p>

      {/* Feed */}
      <div className="space-y-3">
        {sorted.map(item => {
          const cfg = pulseTypeConfig[item.type];
          const isExpanded = expanded === item.id;

          return (
            <div
              key={item.id}
              className={`bg-[#111113] border rounded-lg transition-all cursor-pointer ${
                item.urgent
                  ? 'border-[#ef4444]/40 hover:border-[#ef4444]/60'
                  : 'border-[#27272a] hover:border-[#3f3f46]'
              }`}
              onClick={() => setExpanded(isExpanded ? null : item.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {item.urgent && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Urgent
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs font-medium text-[#22c55e]">{item.districtName}</span>
                      <span className="text-[11px] text-[#52525b]">{timeAgo(item.date)}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm font-semibold text-[#e4e4e7] leading-snug mb-1">
                      {item.headline}
                    </h3>

                    {/* Source */}
                    <div className="flex items-center gap-1 text-[11px] text-[#52525b]">
                      <ExternalLink className="w-3 h-3" />
                      {item.source}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-[#52525b] flex-shrink-0 transition-transform mt-0.5 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#27272a] space-y-3">
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{item.summary}</p>

                    {/* Reach out hint */}
                    <div className="flex items-start gap-2 bg-[#22c55e]/8 border border-[#22c55e]/20 rounded-md px-3 py-2.5">
                      <Zap className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#22c55e] uppercase tracking-wider mb-0.5">
                          Reach Out Hook
                        </p>
                        <p className="text-sm text-[#d4d4d8]">{item.reachOutHint}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs font-medium rounded-md hover:bg-[#22c55e]/20 transition-all">
                        Log Follow-up
                      </button>
                      <button className="px-3 py-1.5 bg-[#111113] border border-[#27272a] text-[#71717a] text-xs font-medium rounded-md hover:text-[#a1a1aa] transition-all">
                        Dismiss Signal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-16 text-[#52525b]">
            <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No signals match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
