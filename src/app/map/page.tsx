'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { districts, totalValue, outstanding } from '@/lib/data';
import { MapPin, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0f0f10] rounded-lg">
      <div className="text-[#52525b] text-sm">Loading map…</div>
    </div>
  ),
});

const STAGE_FILTERS = [
  { id: 'all', label: 'All Districts' },
  { id: 'Active', label: 'Active' },
  { id: 'Pending PO', label: 'Pending PO' },
  { id: 'At Risk', label: 'At Risk' },
  { id: 'New', label: 'New' },
];

// State-level revenue rollup
function stateRollup() {
  const map: Record<string, { total: number; count: number; outstanding: number }> = {};
  districts.forEach(d => {
    const state = d.state ?? 'Unknown';
    if (!map[state]) map[state] = { total: 0, count: 0, outstanding: 0 };
    map[state].total += totalValue(d);
    map[state].count += 1;
    map[state].outstanding += outstanding(d);
  });
  return Object.entries(map)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 8);
}

function fmtK(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

export default function MapPage() {
  const [filter, setFilter] = useState('all');
  const stateData = stateRollup();
  const maxTotal = stateData[0]?.[1].total ?? 1;

  const totalRev = districts.reduce((s, d) => s + totalValue(d), 0);
  const totalOut = districts.reduce((s, d) => s + outstanding(d), 0);
  const activeCount = districts.filter(d => d.stage === 'Active').length;
  const pendingCount = districts.filter(d => d.stage === 'Pending PO' || d.stage === 'At Risk').length;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#22c55e]" />
          Deal Heatmap
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-0.5">Revenue concentration by geography — hot zones vs. opportunity gaps</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Revenue', val: fmtK(totalRev), icon: DollarSign, color: '#22c55e' },
          { label: 'Outstanding', val: fmtK(totalOut), icon: AlertCircle, color: '#f59e0b' },
          { label: 'Active Districts', val: String(activeCount), icon: TrendingUp, color: '#22c55e' },
          { label: 'Needs Attention', val: String(pendingCount), icon: AlertCircle, color: '#ef4444' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-[#111113] border border-[#27272a] rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-xs text-[#71717a] font-medium">{label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-[#52525b] font-medium mr-1">Filter:</span>
        {STAGE_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f.id
                ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                : 'text-[#71717a] bg-[#111113] border border-[#27272a] hover:text-[#a1a1aa]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="flex gap-4" style={{ height: 480 }}>
        {/* Map */}
        <div className="flex-1 rounded-lg overflow-hidden border border-[#27272a]">
          <LeafletMap filter={filter} />
        </div>

        {/* State leaderboard */}
        <div className="w-64 bg-[#111113] border border-[#27272a] rounded-lg p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-3">
            Revenue by State
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {stateData.map(([state, data], i) => {
              const pct = (data.total / maxTotal) * 100;
              return (
                <div key={state}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#52525b] font-mono w-4">{i + 1}</span>
                      <span className="text-sm font-semibold text-white">{state}</span>
                      <span className="text-[10px] text-[#52525b]">{data.count}d</span>
                    </div>
                    <span className="text-xs font-bold text-[#22c55e]">{fmtK(data.total)}</span>
                  </div>
                  <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#22c55e] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {data.outstanding > 0 && (
                    <div className="text-[10px] text-[#f59e0b] mt-0.5">{fmtK(data.outstanding)} outstanding</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-[#27272a]">
            <p className="text-[10px] text-[#52525b] font-semibold uppercase tracking-wider mb-2">Legend</p>
            {[
              { color: '#22c55e', label: 'Active' },
              { color: '#f59e0b', label: 'Pending PO' },
              { color: '#ef4444', label: 'At Risk' },
              { color: '#3b82f6', label: 'New' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-[#71717a]">{label}</span>
              </div>
            ))}
            <p className="text-[10px] text-[#52525b] mt-2">Bubble size = deal value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
