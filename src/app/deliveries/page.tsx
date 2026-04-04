'use client';

import { useState, useMemo } from 'react';
import { deliveries, statusConfig } from '@/lib/deliveries-data';
import type { Delivery } from '@/lib/deliveries-data';
import { Search, Copy, Check } from 'lucide-react';

type StatusFilter = 'all' | Delivery['status'];

function fmtDate(d: string | null) {
  if (!d) return <span className="text-[#3f3f46]">—</span>;
  const [y, m, day] = d.split('-');
  return <span className="tabular-nums">{m}/{day}/{y.slice(2)}</span>;
}

function TrackingCell({ tracking }: { tracking?: string }) {
  const [copied, setCopied] = useState(false);
  if (!tracking) return <span className="text-[#3f3f46]">—</span>;
  async function copy() {
    await navigator.clipboard.writeText(tracking!);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-[#a1a1aa] truncate max-w-[120px]">{tracking}</span>
      <button onClick={copy} className="text-[#3f3f46] hover:text-[#71717a] transition-colors flex-shrink-0">
        {copied ? <Check size={11} className="text-[#22c55e]" /> : <Copy size={11} />}
      </button>
    </div>
  );
}

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'shipped', label: 'Assigned' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'installed', label: 'Installed' },
  { key: 'confirmed', label: 'Confirmed' },
];

export default function DeliveriesPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return deliveries
      .filter((d) => {
        if (filter !== 'all' && d.status !== filter) return false;
        if (q) {
          return (
            d.district.toLowerCase().includes(q) ||
            d.school.toLowerCase().includes(q) ||
            d.items.toLowerCase().includes(q) ||
            (d.quoteNum ?? '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const da = a.dateAssigned ?? '0000-00-00';
        const db = b.dateAssigned ?? '0000-00-00';
        return db.localeCompare(da);
      });
  }, [filter, search]);

  const counts = useMemo(() => {
    const total = deliveries.length;
    const confirmed = deliveries.filter((d) => d.alexConfirmed).length;
    const pending = deliveries.filter((d) => d.status === 'pending').length;
    const inProgress = deliveries.filter((d) =>
      ['shipped', 'delivered', 'installed'].includes(d.status)
    ).length;
    return { total, confirmed, pending, inProgress };
  }, []);

  return (
    <div className="flex-1 bg-[#09090b] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Delivery Tracker</h1>
          <p className="text-sm text-[#71717a] mt-0.5">Hardware shipments, installs, and confirmation status</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <div className="text-xs text-[#52525b] mb-1">Total Deliveries</div>
            <div className="text-2xl font-bold text-white tabular-nums">{counts.total}</div>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <div className="text-xs text-[#52525b] mb-1">Confirmed</div>
            <div className="text-2xl font-bold text-[#22c55e] tabular-nums">{counts.confirmed}</div>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <div className="text-xs text-[#52525b] mb-1">Pending</div>
            <div className="text-2xl font-bold text-[#f59e0b] tabular-nums">{counts.pending}</div>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <div className="text-xs text-[#52525b] mb-1">In Progress</div>
            <div className="text-2xl font-bold text-[#3b82f6] tabular-nums">{counts.inProgress}</div>
          </div>
        </div>

        {/* Filter tabs + search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="flex gap-0.5 border-b border-[#27272a] w-full sm:w-auto">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                  filter === t.key
                    ? 'border-[#22c55e] text-[#22c55e]'
                    : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0 sm:max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3f3f46]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, site, items..."
              className="w-full bg-[#111113] border border-[#27272a] rounded-md pl-8 pr-3 py-2 text-sm text-[#d4d4d8] placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/60"
            />
          </div>
        </div>

        {/* Count */}
        <div className="text-xs text-[#52525b] mb-3">{filtered.length} deliveries</div>

        {/* Table */}
        <div className="bg-[#111113] border border-[#27272a] rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/40">
                <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Site</th>
                <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Quote #</th>
                <th className="text-center px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Assigned</th>
                <th className="text-center px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Delivered</th>
                <th className="text-center px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Installed</th>
                <th className="text-left px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Who</th>
                <th className="text-left px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Tracking</th>
                <th className="text-center px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Confirmed</th>
                <th className="text-left px-3 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const sCfg = statusConfig[d.status];
                return (
                  <tr
                    key={d.id}
                    className={`border-b border-[#27272a] last:border-0 ${
                      i % 2 === 0 ? 'bg-[#09090b]' : 'bg-[#111113]/40'
                    } hover:bg-[#111113] transition-colors`}
                  >
                    <td className="px-4 py-2.5 text-[#d4d4d8] font-medium whitespace-nowrap">{d.district}</td>
                    <td className="px-4 py-2.5 text-[#a1a1aa] whitespace-nowrap">{d.school}</td>
                    <td className="px-4 py-2.5 text-[#a1a1aa] max-w-[200px]">
                      <span className="line-clamp-2">{d.items}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-[#71717a] whitespace-nowrap">
                      {d.quoteNum ?? <span className="text-[#3f3f46]">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs text-[#71717a]">{fmtDate(d.dateAssigned)}</td>
                    <td className="px-3 py-2.5 text-center text-xs text-[#71717a]">{fmtDate(d.dateDelivered)}</td>
                    <td className="px-3 py-2.5 text-center text-xs text-[#71717a]">{fmtDate(d.installDate)}</td>
                    <td className="px-3 py-2.5 text-xs text-[#71717a] whitespace-nowrap">
                      {d.who || <span className="text-[#3f3f46]">—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <TrackingCell tracking={d.tracking} />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {d.alexConfirmed ? (
                        <span className="text-[#22c55e] font-bold text-sm">✓</span>
                      ) : (
                        <span className="text-[#3f3f46]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                        style={{ color: sCfg.color, background: sCfg.bg }}
                      >
                        {sCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#52525b] text-sm">No deliveries match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
