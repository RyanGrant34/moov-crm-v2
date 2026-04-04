'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Calculator, TrendingUp, DollarSign, Clock, CheckCircle, ChevronRight } from 'lucide-react';

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

function platformCostEstimate(students: number): number {
  // Tier pricing: $7.13/student for licenses + $8.50/student for IDs
  const licenseRate = students <= 1000 ? 7.50 : students <= 3000 ? 7.13 : 7.00;
  return Math.round(students * licenseRate);
}

export default function CalculatorPage() {
  const [students, setStudents] = useState(1500);
  const [adminHours, setAdminHours] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(22);
  const [incidentSavings, setIncidentSavings] = useState(3);

  const results = useMemo(() => {
    const platformCost = platformCostEstimate(students);
    const weeklyAdminLabor = adminHours * hourlyRate;
    const annualAdminLabor = weeklyAdminLabor * 52;
    // Platform reduces manual admin time by ~40%
    const laborSaved = annualAdminLabor * 0.40;
    // Incidents: avg $4,200 per incident (detention, substitute, parent calls)
    const incidentCostSaved = incidentSavings * 4200;
    const totalAnnualSavings = laborSaved + incidentCostSaved;
    const netAnnualBenefit = totalAnnualSavings - platformCost;
    const roi = platformCost > 0 ? ((netAnnualBenefit / platformCost) * 100) : 0;
    const paybackMonths = totalAnnualSavings > 0 ? (platformCost / (totalAnnualSavings / 12)) : 0;

    // 18-month cashflow
    const monthly = totalAnnualSavings / 12;
    const data = Array.from({ length: 18 }, (_, i) => {
      const month = i + 1;
      const cumulativeSavings = monthly * month;
      const netPosition = cumulativeSavings - platformCost;
      return {
        month: `M${month}`,
        savings: Math.round(cumulativeSavings),
        cost: platformCost,
        net: Math.round(netPosition),
      };
    });

    return { platformCost, laborSaved, incidentCostSaved, totalAnnualSavings, netAnnualBenefit, roi, paybackMonths, data, weeklyAdminLabor };
  }, [students, adminHours, hourlyRate, incidentSavings]);

  const paybackReached = results.paybackMonths <= 18;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#22c55e]" />
          ROI Estimator
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-0.5">
          Turn &quot;selling a product&quot; into &quot;selling a financial outcome&quot; — build a value story for every proposal
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
            <h2 className="text-sm font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#22c55e]/15 flex items-center justify-center text-[#22c55e] text-[10px] font-bold">1</span>
              School Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#71717a] font-medium block mb-1.5">
                  Total Students Enrolled
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={200} max={8000} step={100}
                    value={students}
                    onChange={e => setStudents(+e.target.value)}
                    className="flex-1 accent-[#22c55e]"
                  />
                  <span className="text-white font-bold w-16 text-right text-sm">{students.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-medium block mb-1.5">
                  Admin Hours Spent on Attendance/Week
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={2} max={40} step={1}
                    value={adminHours}
                    onChange={e => setAdminHours(+e.target.value)}
                    className="flex-1 accent-[#22c55e]"
                  />
                  <span className="text-white font-bold w-16 text-right text-sm">{adminHours}h/wk</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-medium block mb-1.5">
                  Average Admin Hourly Rate (USD)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={15} max={55} step={1}
                    value={hourlyRate}
                    onChange={e => setHourlyRate(+e.target.value)}
                    className="flex-1 accent-[#22c55e]"
                  />
                  <span className="text-white font-bold w-16 text-right text-sm">${hourlyRate}/hr</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-medium block mb-1.5">
                  Avg. Preventable Incidents Avoided Per Month
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={0} max={20} step={1}
                    value={incidentSavings}
                    onChange={e => setIncidentSavings(+e.target.value)}
                    className="flex-1 accent-[#22c55e]"
                  />
                  <span className="text-white font-bold w-16 text-right text-sm">{incidentSavings}/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="bg-[#0f0f10] border border-[#27272a] rounded-lg p-4">
            <p className="text-[10px] font-semibold text-[#52525b] uppercase tracking-wider mb-2">Model Assumptions</p>
            <ul className="space-y-1.5">
              {[
                'Platform reduces admin time by 40%',
                `Avg incident cost: $4,200 (sub + admin + parent engagement)`,
                `License rate: ${students <= 1000 ? '$7.50' : students <= 3000 ? '$7.13' : '$7.00'}/student (volume tier)`,
                '5-year system lifespan assumed',
              ].map(a => (
                <li key={a} className="flex items-start gap-1.5 text-xs text-[#71717a]">
                  <CheckCircle className="w-3 h-3 text-[#3f3f46] flex-shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {/* Value story cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Platform Investment', val: fmt(results.platformCost), sub: 'one-time', icon: DollarSign, color: '#3b82f6' },
              { label: 'Annual Savings', val: fmt(results.totalAnnualSavings), sub: 'labor + incidents', icon: TrendingUp, color: '#22c55e' },
              { label: 'ROI', val: `${Math.round(results.roi)}%`, sub: 'year 1', icon: TrendingUp, color: results.roi > 0 ? '#22c55e' : '#ef4444' },
              { label: 'Payback Period', val: paybackReached ? `${results.paybackMonths.toFixed(1)} mo` : '>18 mo', sub: 'break-even', icon: Clock, color: results.paybackMonths <= 6 ? '#22c55e' : results.paybackMonths <= 12 ? '#f59e0b' : '#ef4444' },
            ].map(({ label, val, sub, icon: Icon, color }) => (
              <div key={label} className="bg-[#111113] border border-[#27272a] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  <span className="text-[11px] text-[#71717a] font-medium">{label}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color }}>{val}</div>
                <div className="text-[10px] text-[#52525b] mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Value Story */}
          <div className="bg-[#22c55e]/8 border border-[#22c55e]/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-[#22c55e] uppercase tracking-wider mb-2">Value Story</p>
            <p className="text-sm text-[#d4d4d8] leading-relaxed">
              A district with <span className="text-white font-semibold">{students.toLocaleString()} students</span> currently
              spends <span className="text-white font-semibold">{fmt(results.weeklyAdminLabor * 52)}/year</span> in admin labor
              on attendance management. Platform recovers <span className="text-[#22c55e] font-semibold">{fmt(results.laborSaved)}</span> of
              that annually — plus <span className="text-[#22c55e] font-semibold">{fmt(results.incidentCostSaved)}</span> in
              avoided incident costs. The system pays for itself in{' '}
              <span className="text-white font-bold">{results.paybackMonths.toFixed(1)} months</span>.
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-[#111113] border border-[#27272a] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#a1a1aa] mb-3">Annual Savings Breakdown</p>
            <div className="space-y-2">
              {[
                { label: 'Admin Labor Recovered (40%)', val: results.laborSaved, color: '#22c55e' },
                { label: 'Incident Cost Reduction', val: results.incidentCostSaved, color: '#3b82f6' },
              ].map(({ label, val, color }) => {
                const pct = results.totalAnnualSavings > 0 ? (val / results.totalAnnualSavings) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#71717a]">{label}</span>
                      <span className="text-xs font-bold" style={{ color }}>{fmt(val)}</span>
                    </div>
                    <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow chart */}
      <div className="mt-5 bg-[#111113] border border-[#27272a] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#e4e4e7]">18-Month Cumulative Value Chart</h3>
          <div className="flex items-center gap-3 text-xs text-[#71717a]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]" />
              Cumulative Savings
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]/60" />
              Investment
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={results.data} margin={{ left: 10, right: 10, top: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: '#a1a1aa' }}
              formatter={(val) => [fmt(Number(val)), '']}
            />
            <ReferenceLine
              y={results.platformCost}
              stroke="#3b82f6"
              strokeDasharray="4 4"
              label={{ value: 'Break-even', fill: '#3b82f6', fontSize: 10, position: 'right' }}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#savGrad)"
              name="Cumulative Savings"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#52525b] font-medium">Ready to turn this into a proposal?</p>
            <p className="text-[11px] text-[#3f3f46] mt-0.5">Export as PDF or copy the value story to your clipboard</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs font-semibold rounded-md hover:bg-[#22c55e]/20 transition-all">
              Copy Value Story
              <ChevronRight className="w-3 h-3" />
            </button>
            <button className="px-3 py-2 bg-[#111113] border border-[#27272a] text-[#71717a] text-xs font-medium rounded-md hover:text-[#a1a1aa] transition-all">
              Save Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
