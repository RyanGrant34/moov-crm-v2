'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import SearchPalette from './SearchPalette';
import ActivityLogger from './ActivityLogger';

export default function GlobalUI() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  // Cmd+K / Ctrl+K → open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Cmd+K search button in top bar */}
      <button
        onClick={() => setSearchOpen(true)}
        className="fixed top-3.5 right-5 z-40 flex items-center gap-2 bg-[#111113] border border-[#27272a] hover:border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-[#71717a] transition-all group"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Search…</span>
        <kbd className="hidden sm:block bg-[#27272a] group-hover:bg-[#3f3f46] px-1 rounded font-mono text-[10px] ml-1">⌘K</kbd>
      </button>

      {/* Floating Log button */}
      <button
        onClick={() => setLogOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-[#09090b] font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-[#22c55e]/20 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Log Activity
      </button>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ActivityLogger open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
