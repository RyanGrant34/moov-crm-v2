"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { districts, totalValue, outstanding } from "@/lib/data"

function formatK(val: number): string {
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

function formatKAxis(val: number): string {
  if (val >= 1000) return `$${val / 1000}K`
  return `$${val}`
}

const sourceData = [
  { source: "Referral", value: 85000 },
  { source: "Cold Outreach", value: 42000 },
  { source: "Inbound Web", value: 31000 },
  { source: "Event", value: 18000 },
]

const monthlyData = [
  { month: "Jan", projected: 38000, actual: 41200 },
  { month: "Feb", projected: 42000, actual: 39800 },
  { month: "Mar", projected: 45000, actual: 47300 },
  { month: "Apr", projected: 50000, actual: 48100 },
  { month: "May", projected: 55000, actual: 53400 },
  { month: "Jun", projected: 60000, actual: null },
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number | null; color: string }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm">
        <p className="text-[#a1a1aa] mb-1">{label}</p>
        {payload.map((p) =>
          p.value !== null && p.value !== undefined ? (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: {formatK(p.value)}
            </p>
          ) : null
        )}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { pipeline, avgDeal, ytdCollected, leaderboard } = useMemo(() => {
    const all = districts
    const pipeline = all.reduce((acc, d) => acc + totalValue(d), 0)
    const totalOwed = all.reduce((acc, d) => acc + outstanding(d), 0)
    const ytdCollected = pipeline - totalOwed

    const totalQuotes = all.flatMap((d) => d.schools.flatMap((s) => s.quotes))
    const avgDeal = totalQuotes.length > 0 ? pipeline / totalQuotes.length : 0

    const leaderboard = [...all]
      .map((d) => ({ name: d.name, value: totalValue(d) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    return { pipeline, avgDeal, ytdCollected, leaderboard }
  }, [])

  const { arrData, totalArr2526, totalArr2627, totalStudents, avgArr } = useMemo(() => {
    const withArr = [...districts]
      .filter((d) => (d.arr2526 ?? 0) > 0)
      .sort((a, b) => (b.arr2526 ?? 0) - (a.arr2526 ?? 0))
      .slice(0, 12)

    const arrData = withArr.map((d) => ({
      name: d.name.length > 12 ? d.name.slice(0, 12) : d.name,
      "ARR 25-26": d.arr2526 ?? 0,
      "ARR 26-27": d.arr2627 ?? 0,
    }))

    const totalArr2526 = districts.reduce((acc, d) => acc + (d.arr2526 ?? 0), 0)
    const totalArr2627 = districts.reduce((acc, d) => acc + (d.arr2627 ?? 0), 0)
    const totalStudents = districts.reduce((acc, d) => acc + (d.studentCount ?? 0), 0)
    const activeDistricts = districts.filter((d) => (d.arr2526 ?? 0) > 0)
    const avgArr = activeDistricts.length > 0 ? Math.round(totalArr2526 / activeDistricts.length) : 0

    return { arrData, totalArr2526, totalArr2627, totalStudents, avgArr }
  }, [])

  const maxLeaderValue = leaderboard[0]?.value ?? 1

  const kpiCards = [
    {
      label: "Total Pipeline Value",
      value: formatK(pipeline),
      sub: `${districts.length} districts`,
    },
    {
      label: "YTD Collected",
      value: formatK(ytdCollected),
      sub: `${Math.round((ytdCollected / pipeline) * 100)}% of pipeline`,
    },
    {
      label: "Avg Deal Size",
      value: formatK(Math.round(avgDeal)),
      sub: "per quote",
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <span className="text-sm font-medium text-[#71717a] bg-[#111113] border border-[#27272a] rounded-md px-3 py-1.5">
          Q2 2026
        </span>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#111113] border border-[#27272a] rounded-lg px-5 py-4"
          >
            <p className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-[#52525b] mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Revenue by Source */}
        <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Revenue by Source</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="source"
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatKAxis}
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39,39,42,0.5)" }} />
              <Bar
                dataKey="value"
                name="Revenue"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barCategoryGap="25%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatKAxis}
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39,39,42,0.5)" }} />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#71717a", paddingTop: "8px" }}
              />
              <Bar
                dataKey="projected"
                name="Projected"
                fill="#52525b"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="actual"
                name="Actual"
                fill="#22c55e"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: ARR Breakdown */}
      <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold text-white mb-1">ARR Breakdown</h2>
        <p className="text-xs text-[#71717a] mb-5">Annual recurring revenue — top 12 districts by ARR 25-26</p>

        {/* ARR Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#71717a] uppercase tracking-wider mb-1">Total ARR 25-26</p>
            <p className="text-xl font-bold text-white">{formatK(totalArr2526)}</p>
            <p className="text-xs text-[#22c55e] mt-0.5">
              {formatK(totalArr2627)} projected 26-27
            </p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#71717a] uppercase tracking-wider mb-1">Avg ARR / District</p>
            <p className="text-xl font-bold text-white">{formatK(avgArr)}</p>
            <p className="text-xs text-[#52525b] mt-0.5">Active districts only</p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#71717a] uppercase tracking-wider mb-1">Total Students</p>
            <p className="text-xl font-bold text-white">{totalStudents.toLocaleString()}</p>
            <p className="text-xs text-[#52525b] mt-0.5">Across all districts</p>
          </div>
        </div>

        {/* ARR Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={arrData} barCategoryGap="25%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatKAxis}
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(39,39,42,0.5)" }} />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#71717a", paddingTop: "8px" }}
            />
            <Bar
              dataKey="ARR 25-26"
              fill="#22c55e"
              radius={[3, 3, 0, 0]}
              opacity={0.9}
            />
            <Bar
              dataKey="ARR 26-27"
              fill="#52525b"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4: District Leaderboard */}
      <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-white mb-5">District Leaderboard</h2>
        <div className="flex flex-col gap-3">
          {leaderboard.map((district, i) => {
            const pct = Math.round((district.value / maxLeaderValue) * 100)
            return (
              <div key={district.name} className="flex items-center gap-3">
                <span className="text-xs text-[#52525b] w-4 text-right shrink-0">{i + 1}</span>
                <span className="text-sm text-white w-36 shrink-0 truncate">{district.name}</span>
                <div className="flex-1 bg-[#27272a] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-[#a1a1aa] w-16 text-right shrink-0">
                  {formatK(district.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
