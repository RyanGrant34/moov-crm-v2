'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Briefcase, AlertCircle, BarChart2, Plus, Activity, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  districts,
  activities,
  allQuotes,
  outstanding,
  type Stage,
} from '@/lib/data';

const velocityData = [
  { month: 'Jan', revenue: 42 },
  { month: 'Feb', revenue: 38 },
  { month: 'Mar', revenue: 55 },
  { month: 'Apr', revenue: 61 },
  { month: 'May', revenue: 48 },
  { month: 'Jun', revenue: 73 },
];

const STAGES: Stage[] = ['Active', 'Pending PO', 'At Risk', 'New'];

const stageAccentColor: Record<Stage, string> = {
  Active: '#22c55e',
  'Pending PO': '#f59e0b',
  'At Risk': '#ef4444',
  New: '#3b82f6',
};

const activityDotColor: Record<string, string> = {
  quote_sent: '#3b82f6',
  po_received: '#22c55e',
  follow_up: '#f59e0b',
  meeting: '#a855f7',
  install: '#22c55e',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatK(value: number) {
  return `$${(value / 1000).toFixed(1)}K`;
}

function formatArrK(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111113] border border-[#27272a] rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="text-[#a1a1aa]">{label}</p>
        <p className="text-white font-semibold">${payload[0].value}K</p>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const quotes = useMemo(() => allQuotes(districts), []);

  const totalRevenue = useMemo(
    () => quotes.filter(q => q.status === 'paid').reduce((sum, q) => sum + q.price, 0),
    [quotes]
  );

  const activeDeals = useMemo(
    () => districts.filter(d => d.stage === 'Active').length,
    []
  );

  const totalOutstanding = useMemo(
    () => districts.reduce((sum, d) => sum + outstanding(d), 0),
    []
  );

  const conversionRate = useMemo(() => {
    const paid = quotes.filter(q => q.status === 'paid').length;
    return quotes.length > 0 ? Math.round((paid / quotes.length) * 100) : 0;
  }, [quotes]);

  const totalArr2526 = useMemo(
    () => districts.reduce((sum, d) => sum + (d.arr2526 ?? 0), 0),
    []
  );

  const totalArr2627 = useMemo(
    () => districts.reduce((sum, d) => sum + (d.arr2627 ?? 0), 0),
    []
  );

  const arrGrowthPct = useMemo(() => {
    if (totalArr2526 === 0) return 0;
    return Math.round(((totalArr2627 - totalArr2526) / totalArr2526) * 100);
  }, [totalArr2526, totalArr2627]);

  const topArrDistricts = useMemo(() =>
    [...districts]
      .filter(d => (d.arr2526 ?? 0) > 0)
      .sort((a, b) => (b.arr2526 ?? 0) - (a.arr2526 ?? 0))
      .slice(0, 10),
    []
  );

  const stageCounts = useMemo(() =>
    STAGES.map(stage => ({
      stage,
      count: districts.filter(d => d.stage === stage).length,
    }))
  , []);

  const maxStageCount = Math.max(...stageCounts.map(s => s.count));

  const recentActivities = useMemo(
    () =>
      [...activities]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8),
    []
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#a1a1aa] text-sm mt-0.5">{today}</p>
        </div>
        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          New Lead
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Total Revenue</p>
            <div className="p-2 rounded-md bg-[#22c55e]/10">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatK(totalRevenue)}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">All paid quotes</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Active Deals</p>
            <div className="p-2 rounded-md bg-[#3b82f6]/10">
              <Briefcase className="w-4 h-4 text-[#3b82f6]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{activeDeals}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Active stage districts</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Outstanding</p>
            <div className="p-2 rounded-md bg-[#f59e0b]/10">
              <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatK(totalOutstanding)}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Pending PO quotes</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">Conversion Rate</p>
            <div className="p-2 rounded-md bg-[#a855f7]/10">
              <BarChart2 className="w-4 h-4 text-[#a855f7]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate}%</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Paid / total quotes</p>
        </Card>
      </div>

      {/* ARR Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">ARR 25-26</p>
            <div className="p-2 rounded-md bg-[#22c55e]/10">
              <DollarSign className="w-4 h-4 text-[#22c55e]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatArrK(totalArr2526)}</p>
          <p className="text-[#a1a1aa] text-xs mt-1">Annual recurring revenue 2025-26</p>
        </Card>

        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#a1a1aa] text-sm">ARR 26-27</p>
            <div className="p-2 rounded-md bg-[#22c55e]/10">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatArrK(totalArr2627)}
            <span className="text-sm font-medium text-[#22c55e] ml-2">+{arrGrowthPct}%</span>
          </p>
          <p className="text-[#a1a1aa] text-xs mt-1">Projected annual recurring revenue 2026-27</p>
        </Card>
      </div>

      {/* ARR by District */}
      <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
        <div className="mb-4">
          <h2 className="text-white font-semibold text-base">ARR by District</h2>
          <p className="text-[#a1a1aa] text-xs mt-0.5">Top 10 districts by ARR 25-26</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#71717a] text-xs uppercase tracking-wider">
                <th className="text-left pb-3 pr-4 font-medium">District</th>
                <th className="text-right pb-3 pr-4 font-medium">Students</th>
                <th className="text-right pb-3 pr-4 font-medium">ARR 25-26</th>
                <th className="text-right pb-3 pr-4 font-medium">ARR 26-27</th>
                <th className="text-right pb-3 pr-4 font-medium">Growth</th>
                <th className="text-left pb-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {topArrDistricts.map(d => {
                const arr25 = d.arr2526 ?? 0;
                const arr26 = d.arr2627 ?? 0;
                const growth = arr25 > 0 ? Math.round(((arr26 - arr25) / arr25) * 100) : 0;
                const stageColors: Record<string, string> = {
                  Active: 'text-[#22c55e] bg-[#22c55e]/10',
                  'Pending PO': 'text-[#f59e0b] bg-[#f59e0b]/10',
                  'At Risk': 'text-[#ef4444] bg-[#ef4444]/10',
                  New: 'text-[#3b82f6] bg-[#3b82f6]/10',
                };
                return (
                  <tr key={d.id} className="text-[#e4e4e7]">
                    <td className="py-3 pr-4 font-medium">{d.name}</td>
                    <td className="py-3 pr-4 text-right text-[#a1a1aa]">
                      {(d.studentCount ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold">{formatArrK(arr25)}</td>
                    <td className="py-3 pr-4 text-right text-[#a1a1aa]">{formatArrK(arr26)}</td>
                    <td className="py-3 pr-4 text-right text-[#22c55e]">+{growth}%</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${stageColors[d.stage] ?? 'text-[#71717a] bg-[#71717a]/10'}`}
                      >
                        {d.stage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Velocity Chart — 2/3 */}
        <Card className="lg:col-span-2 bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Sales Velocity</h2>
            <p className="text-[#a1a1aa] text-xs mt-0.5">Monthly revenue trend — last 6 months</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}K`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pipeline Status — 1/3 */}
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Pipeline Status</h2>
            <p className="text-[#a1a1aa] text-xs mt-0.5">Districts by stage</p>
          </div>
          <div className="space-y-4">
            {stageCounts.map(({ stage, count }) => {
              const color = stageAccentColor[stage];
              const pct = maxStageCount > 0 ? Math.round((count / maxStageCount) * 100) : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#e4e4e7]">{stage}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ color, backgroundColor: `${color}18` }}
                    >
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#a1a1aa]" />
          <h2 className="text-white font-semibold text-base">Recent Activity</h2>
        </div>
        <div>
          {recentActivities.map((act, idx) => {
            const dotColor = activityDotColor[act.type] ?? '#71717a';
            return (
              <div key={act.id}>
                <div className="flex items-start gap-3 py-3">
                  <div className="mt-[7px] flex-shrink-0">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#e4e4e7] leading-snug">{act.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#a1a1aa]">{act.district}</span>
                      <span className="text-[#3f3f46] text-xs">·</span>
                      <span className="text-xs text-[#a1a1aa]">{formatDate(act.date)}</span>
                    </div>
                  </div>
                  {act.amount !== undefined && (
                    <div className="flex-shrink-0 text-sm font-semibold text-[#22c55e]">
                      {formatK(act.amount)}
                    </div>
                  )}
                </div>
                {idx < recentActivities.length - 1 && (
                  <Separator className="bg-[#27272a]" />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
