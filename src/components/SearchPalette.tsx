'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, FileText, Activity, X, ArrowRight, Hash } from 'lucide-react';
import { districts, allQuotes } from '@/lib/data';

type ResultType = 'district' | 'quote' | 'page';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
}

const PAGES: SearchResult[] = [
  { id: 'p-dashboard', type: 'page', title: 'Dashboard', subtitle: 'Overview & KPIs', href: '/', meta: 'page' },
  { id: 'p-pipeline', type: 'page', title: 'Lead Mapper', subtitle: 'Kanban pipeline', href: '/pipeline', meta: 'page' },
  { id: 'p-contacts', type: 'page', title: 'Contacts', subtitle: 'All districts', href: '/contacts', meta: 'page' },
  { id: 'p-activity', type: 'page', title: 'Activity', subtitle: 'Timeline feed', href: '/activity', meta: 'page' },
  { id: 'p-analytics', type: 'page', title: 'Analytics', subtitle: 'Revenue charts', href: '/analytics', meta: 'page' },
  { id: 'p-pulse', type: 'page', title: 'Company Pulse', subtitle: 'News & signals', href: '/pulse', meta: 'page' },
  { id: 'p-map', type: 'page', title: 'Deal Heatmap', subtitle: 'Geographic view', href: '/map', meta: 'page' },
  { id: 'p-calculator', type: 'page', title: 'ROI Calculator', subtitle: 'Value estimator', href: '/calculator', meta: 'page' },
  { id: 'p-tasks', type: 'page', title: 'Tasks', subtitle: 'Reminders & todos', href: '/tasks', meta: 'page' },
  { id: 'p-templates', type: 'page', title: 'Email Templates', subtitle: 'Outreach templates', href: '/templates', meta: 'page' },
];

function buildResults(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return PAGES.slice(0, 5);

  const results: SearchResult[] = [];

  // Pages
  PAGES.forEach(p => {
    if (p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
      results.push(p);
    }
  });

  // Districts
  districts.forEach(d => {
    if (
      d.name.toLowerCase().includes(q) ||
      (d.state ?? '').toLowerCase().includes(q) ||
      (d.contact ?? '').toLowerCase().includes(q) ||
      d.stage.toLowerCase().includes(q)
    ) {
      results.push({
        id: `d-${d.id}`,
        type: 'district',
        title: d.name,
        subtitle: `${d.stage} · ${d.state ?? ''} · ${d.contact ?? ''}`,
        href: '/contacts',
        meta: d.stage,
      });
    }
  });

  // Quotes
  const quotes = allQuotes(districts);
  quotes.forEach(q2 => {
    if (
      q2.quoteNum.toLowerCase().includes(q) ||
      q2.items.toLowerCase().includes(q) ||
      q2.districtName.toLowerCase().includes(q) ||
      `$${q2.price}`.includes(q)
    ) {
      results.push({
        id: `q-${q2.id}`,
        type: 'quote',
        title: `Q ${q2.quoteNum}`,
        subtitle: `${q2.districtName} · ${q2.items.slice(0, 50)}`,
        href: '/contacts',
        meta: `$${q2.price.toLocaleString()}`,
      });
    }
  });

  return results.slice(0, 8);
}

const TYPE_ICON: Record<ResultType, typeof Search> = {
  district: Building2,
  quote: FileText,
  page: Activity,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = buildResults(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); if (results[selected]) navigate(results[selected].href); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-xl mx-4 bg-[#111113] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#27272a]">
          <Search className="w-4 h-4 text-[#52525b] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search districts, quotes, pages…"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#52525b]"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="w-3.5 h-3.5 text-[#52525b] hover:text-[#a1a1aa]" />
            </button>
          )}
          <kbd className="text-[10px] text-[#52525b] bg-[#27272a] px-1.5 py-0.5 rounded font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-1.5 max-h-80 overflow-y-auto">
          {!query && (
            <p className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-wider px-4 py-2">Quick Navigation</p>
          )}
          {results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#52525b]">No results for &quot;{query}&quot;</div>
          )}
          {results.map((r, i) => {
            const Icon = TYPE_ICON[r.type];
            const isSelected = i === selected;
            return (
              <button
                key={r.id}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isSelected ? 'bg-[#1c1c1f]' : 'hover:bg-[#18181b]'
                }`}
                onClick={() => navigate(r.href)}
                onMouseEnter={() => setSelected(i)}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                  r.type === 'district' ? 'bg-[#22c55e]/10' :
                  r.type === 'quote' ? 'bg-[#3b82f6]/10' : 'bg-[#27272a]'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${
                    r.type === 'district' ? 'text-[#22c55e]' :
                    r.type === 'quote' ? 'text-[#3b82f6]' : 'text-[#71717a]'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{r.title}</p>
                  <p className="text-xs text-[#71717a] truncate">{r.subtitle}</p>
                </div>
                {r.meta && (
                  <span className="text-xs text-[#52525b] flex-shrink-0">{r.meta}</span>
                )}
                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#52525b] flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#27272a] px-4 py-2 flex items-center gap-4 text-[10px] text-[#52525b]">
          <span className="flex items-center gap-1"><kbd className="bg-[#27272a] px-1 rounded font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-[#27272a] px-1 rounded font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="bg-[#27272a] px-1 rounded font-mono">esc</kbd> close</span>
          <span className="ml-auto flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
