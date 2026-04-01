'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Receipt,
  ArrowUpRight, Upload, ChevronRight, Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  transactions,
  financeCategories,
  getTotalExpenses,
  getTotalIncome,
  getNetCashflow,
  getExpensesByCategory,
  getMonthlyTrend,
  type Transaction,
} from '@/lib/finance-data';

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111113] border border-[#27272a] rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-[#a1a1aa] mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name === 'income' ? 'Income' : 'Expenses'}: {formatUSD(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const statusStyles: Record<Transaction['status'], string> = {
  cleared: 'text-[#22c55e] bg-[#22c55e]/10',
  pending: 'text-[#f59e0b] bg-[#f59e0b]/10',
  review: 'text-[#ef4444] bg-[#ef4444]/10',
};

export default function FinancePage() {
  const totalExpenses = useMemo(() => getTotalExpenses(transactions), []);
  const totalIncome = useMemo(() => getTotalIncome(transactions), []);
  const netCashflow = useMemo(() => getNetCashflow(transactions), []);
  const byCategory = useMemo(() => getExpensesByCategory(transactions), []);
  const monthlyTrend = useMemo(() => getMonthlyTrend(), []);
  const recent = useMemo(() => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6), []);
  const pendingReview = useMemo(() => transactions.filter(t => t.status === 'review').length, []);
  const aiExtractedCount = useMemo(() => transactions.filter(t => t.aiExtracted).length, []);

  const categoryBreakdown = useMemo(() =>
    financeCategories
      .filter(c => c.id !== 'revenue' && byCategory[c.id])
      .map(c => ({ ...c, spent: byCategory[c.id] ?? 0 }))
      .sort((a, b) => b.spent - a.spent)
  , [byCategory]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance</h1>
          <p className="text-[#a1a1aa] text-sm mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/finance/transactions">
            <Button variant="outline" className="border-[#27272a] bg-transparent text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white text-sm gap-2">
              <Receipt className="w-4 h-4" />
              All Transactions
            </Button>
          </Link>
          <Link href="/finance/upload">
            <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Receipt
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert banner */}
      {pendingReview > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
          <div className="flex items-center gap-2.5 text-sm text-[#f59e0b]">
            <Receipt className="w-4 h-4 flex-shrink-0" />
            <span>{pendingReview} transaction{pendingReview > 1 ? 's' : ''} need review — receipt or category missing.</span>
          </div>
          <Link href="/finance/transactions" className="text-xs text-[#f59e0b] hover:underline flex items-center gap-1">
            Review <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Total Income</p>
            <div className="p-2 rounded-md bg-[#22c55e]/10">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatUSD(totalIncome)}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Cleared revenue this period</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Total Expenses</p>
            <div className="p-2 rounded-md bg-[#ef4444]/10">
              <TrendingDown className="w-4 h-4 text-[#ef4444]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatUSD(totalExpenses)}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">All cleared expenses</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Net Cashflow</p>
            <div className={`p-2 rounded-md ${netCashflow >= 0 ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
              <DollarSign className={`w-4 h-4 ${netCashflow >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-white' : 'text-[#ef4444]'}`}>
            {formatUSD(netCashflow)}
          </p>
          <p className="text-[#a1a1aa] text-xs mt-1">Income minus expenses</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">AI Extracted</p>
            <div className="p-2 rounded-md bg-[#a855f7]/10">
              <Sparkles className="w-4 h-4 text-[#a855f7]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{aiExtractedCount}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Receipts auto-processed</p>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash flow trend — 2/3 */}
        <Card className="lg:col-span-2 bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Cash Flow Trend</h2>
            <p className="text-[#a1a1aa] text-xs mt-0.5">Income vs expenses — last 5 months</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="income" name="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="expenses" name="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Income
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Expenses
            </div>
          </div>
        </Card>

        {/* Category breakdown — 1/3 */}
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">By Category</h2>
            <p className="text-[#a1a1aa] text-xs mt-0.5">Expense breakdown this period</p>
          </div>
          <div className="h-36 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 4, left: -8, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip
                  formatter={(value: number) => [formatUSD(value), 'Spent']}
                  contentStyle={{ background: '#111113', border: '1px solid #27272a', borderRadius: '6px', fontSize: '12px' }}
                  labelStyle={{ color: '#a1a1aa' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Bar dataKey="spent" radius={[0, 3, 3, 0]} maxBarSize={14}>
                  {categoryBreakdown.slice(0, 5).map(c => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryBreakdown.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[#a1a1aa]">{c.label}</span>
                </div>
                <span className="text-[#e4e4e7] font-medium">{formatUSD(c.spent)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#a1a1aa]" />
            <h2 className="text-white font-semibold text-base">Recent Transactions</h2>
          </div>
          <Link href="/finance/transactions" className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1 transition-colors">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div>
          {recent.map((tx, idx) => {
            const cat = financeCategories.find(c => c.id === tx.category);
            const isIncome = tx.type === 'income';
            return (
              <div key={tx.id}>
                <div className="flex items-center gap-3 py-3">
                  {/* Category dot */}
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ backgroundColor: `${cat?.color ?? '#71717a'}15`, color: cat?.color ?? '#71717a' }}
                  >
                    {tx.vendor.charAt(0)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#e4e4e7] font-medium truncate">{tx.vendor}</p>
                      {tx.aiExtracted && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a855f7]/10 text-[#a855f7] flex-shrink-0">AI</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#71717a] truncate">{tx.description}</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-sm font-semibold ${isIncome ? 'text-[#22c55e]' : 'text-[#e4e4e7]'}`}>
                      {isIncome ? '+' : '-'}{formatUSD(tx.amountUSD)}
                      {tx.currency !== 'USD' && <span className="text-[#71717a] text-xs ml-1">{tx.currency}</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                      <span className="text-xs text-[#71717a]">{formatDate(tx.date)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusStyles[tx.status]}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
                {idx < recent.length - 1 && <Separator className="bg-[#27272a]" />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
