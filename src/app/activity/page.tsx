"use client"

import { useState, useMemo } from "react"
import { activities, type Activity } from "@/lib/data"

type FilterType = "All" | "quote_sent" | "po_received" | "meeting" | "install"

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "Quote Sent", value: "quote_sent" },
  { label: "PO Received", value: "po_received" },
  { label: "Meeting", value: "meeting" },
  { label: "Install", value: "install" },
]

function activityLabel(type: Activity["type"]): string {
  switch (type) {
    case "quote_sent": return "Quote Sent"
    case "po_received": return "PO Received"
    case "follow_up": return "Follow-Up"
    case "meeting": return "Meeting"
    case "install": return "Install"
    default: return type
  }
}

function activityBadgeStyle(type: Activity["type"]): string {
  switch (type) {
    case "install":
    case "po_received":
      return "bg-[#22c55e]/10 text-[#22c55e]"
    case "meeting":
      return "bg-[#3b82f6]/10 text-[#3b82f6]"
    case "quote_sent":
      return "bg-[#f59e0b]/10 text-[#f59e0b]"
    case "follow_up":
      return "bg-[#a855f7]/10 text-[#a855f7]"
    default:
      return "bg-[#27272a] text-[#71717a]"
  }
}

function dotColor(type: Activity["type"]): string {
  switch (type) {
    case "install":
    case "po_received":
      return "bg-[#22c55e]"
    case "meeting":
      return "bg-[#3b82f6]"
    case "quote_sent":
    case "follow_up":
      return "bg-[#f59e0b]"
    default:
      return "bg-[#52525b]"
  }
}

function formatAmount(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
  return `$${amount}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All")

  const sorted = useMemo(() => {
    return [...activities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === "All") return sorted
    return sorted.filter((a) => a.type === activeFilter)
  }, [sorted, activeFilter])

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Activity Feed</h1>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeFilter === f.value
                  ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30"
                  : "bg-[#111113] border border-[#27272a] text-[#71717a] hover:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {filtered.length === 0 ? (
          <p className="text-[#71717a] py-12 text-center">No activities found</p>
        ) : (
          <div className="flex flex-col gap-0">
            {filtered.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-5 shrink-0 ${dotColor(activity.type)}`} />
                  {index < filtered.length - 1 && (
                    <div className="w-px flex-1 bg-[#27272a] mt-1" />
                  )}
                </div>

                {/* Content card */}
                <div className="flex-1 mb-4">
                  <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${activityBadgeStyle(activity.type)}`}
                      >
                        {activityLabel(activity.type)}
                      </span>
                      <span className="font-semibold text-white text-sm">{activity.district}</span>
                      {activity.amount !== undefined && (
                        <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[#22c55e]/10 text-[#22c55e]">
                          {formatAmount(activity.amount)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{activity.description}</p>
                    <p className="text-xs text-[#52525b] mt-2">{formatDate(activity.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load more */}
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 rounded-md text-sm font-medium text-[#71717a] border border-[#27272a] hover:text-[#a1a1aa] hover:border-[#3f3f46] transition-colors bg-transparent">
          Load more
        </button>
      </div>
    </div>
  )
}
