'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Upload, ArrowUpDown, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  transactions,
  financeCategories,
  financeProjects,
  type Transaction,
  type TransactionType,
  type TransactionStatus,
} from '@/lib/finance-data';

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const typeStyles: Record<TransactionType, string> = {
  expense: 'text-[#ef4444] bg-[#ef4444]/10',
  income: 'text-[#22c55e] bg-[#22c55e]/10',
  refund: 'text-[#3b82f6] bg-[#3b82f6]/10',
};

const statusStyles: Record<TransactionStatus, string> = {
  cleared: 'text-[#22c55e] bg-[#22c55e]/10',
  pending: 'text-[#f59e0b] bg-[#f59e0b]/10',
  review: 'text-[#ef4444] bg-[#ef4444]/10',
};

type SortField = 'date' | 'amount' | 'vendor';
type SortDir = 'asc' | 'desc';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.vendor.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus);
    if (filterCategory !== 'all') result = result.filter(t => t.category === filterCategory);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'amount') cmp = a.amountUSD - b.amountUSD;
      else if (sortField === 'vendor') cmp = a.vendor.localeCompare(b.vendor);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [search, filterType, filterStatus, filterCategory, sortField, sortDir]);

  const totalFiltered = useMemo(() =>
    filtered.reduce((sum, t) => t.type === 'income' ? sum + t.amountUSD : sum - t.amountUSD, 0)
  , [filtered]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/finance">
            <button className="p-1.5 rounded-md text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f] transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <p className="text-[#a1a1aa] text-sm mt-0.5">{transactions.length} total records</p>
          </div>
        </div>
        <Link href="/finance/upload">
          <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Receipt
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525b]" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search vendor, description..."
              className="pl-9 bg-[#09090b] border-[#27272a] text-[#e4e4e7] placeholder:text-[#52525b] text-sm h-8 focus-visible:ring-[#22c55e]/30"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1">
            {(['all', 'income', 'expense'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterType === t
                    ? 'bg-[#22c55e]/10 text-[#22c55e]'
                    : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f]'
                }`}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            {(['all', 'cleared', 'pending', 'review'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-[#22c55e]/10 text-[#22c55e]'
                    : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f]'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs bg-[#09090b] border border-[#27272a] text-[#a1a1aa] rounded-md px-2 py-1.5 h-8 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"
          >
            <option value="all">All Categories</option>
            {financeCategories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Summary bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-[#71717a]">
          <span className="text-[#a1a1aa] font-medium">{filtered.length}</span> transactions shown
        </p>
        <p className={`text-sm font-semibold ${totalFiltered >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
          Net: {totalFiltered >= 0 ? '+' : ''}{formatUSD(totalFiltered)}
        </p>
      </div>

      {/* Table */}
      <Card className="bg-[#111113] border border-[#27272a] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 text-[#71717a] text-xs uppercase tracking-wider hover:text-[#a1a1aa] transition-colors"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => toggleSort('vendor')}
                    className="flex items-center gap-1 text-[#71717a] text-xs uppercase tracking-wider hover:text-[#a1a1aa] transition-colors"
                  >
                    Vendor <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 hidden md:table-cell">
                  <span className="text-[#71717a] text-xs uppercase tracking-wider">Category</span>
                </th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">
                  <span className="text-[#71717a] text-xs uppercase tracking-wider">Project</span>
                </th>
                <th className="text-center py-3 px-4 hidden sm:table-cell">
                  <span className="text-[#71717a] text-xs uppercase tracking-wider">Status</span>
                </th>
                <th className="text-right py-3 px-4">
                  <button
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 text-[#71717a] text-xs uppercase tracking-wider hover:text-[#a1a1aa] transition-colors ml-auto"
                  >
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#52525b] text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
              {filtered.map(tx => {
                const cat = financeCategories.find(c => c.id === tx.category);
                const proj = financeProjects.find(p => p.id === tx.project);
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-[#1c1c1f]/50 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#71717a] text-xs whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Vendor + description */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: `${cat?.color ?? '#71717a'}15`, color: cat?.color ?? '#71717a' }}
                        >
                          {tx.vendor.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[#e4e4e7] font-medium text-sm truncate max-w-[160px]">{tx.vendor}</p>
                            {tx.aiExtracted && (
                              <Sparkles className="w-3 h-3 text-[#a855f7] flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[#71717a] text-xs truncate max-w-[200px]">{tx.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: cat?.color ?? '#71717a', backgroundColor: `${cat?.color ?? '#71717a'}15` }}
                      >
                        {cat?.label ?? tx.category}
                      </span>
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: proj?.color ?? '#71717a', backgroundColor: `${proj?.color ?? '#71717a'}15` }}
                      >
                        {proj?.label ?? tx.project}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <p className={`text-sm font-semibold ${isIncome ? 'text-[#22c55e]' : 'text-[#e4e4e7]'}`}>
                        {isIncome ? '+' : '-'}{formatUSD(tx.amountUSD)}
                      </p>
                      {tx.currency !== 'USD' && (
                        <p className="text-[10px] text-[#52525b]">{tx.currency} {tx.amount.toLocaleString()}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
