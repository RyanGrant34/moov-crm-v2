"use client"

import { useState, useMemo } from "react"
import { Search, GitBranch, X, Crown, ShieldCheck, Lock, UserCheck, Plus, type LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { districts, totalValue, outstanding, stageColor, type Stage, type District } from "@/lib/data"

type FilterTab = "All" | "Active" | "Pending PO" | "At Risk"
const TABS: FilterTab[] = ["All", "Active", "Pending PO", "At Risk"]

function formatK(val: number): string {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
  return `$${val}`
}

// ─── Relationship Web Data ────────────────────────────────────────────────────

type StakeholderRole = 'champion' | 'decision_maker' | 'gatekeeper' | 'influencer'

interface Stakeholder {
  name: string
  title: string
  role: StakeholderRole
  email?: string
  notes?: string
  sentiment: 'warm' | 'neutral' | 'cold'
}

const ROLE_CONFIG: Record<StakeholderRole, { label: string; color: string; bg: string; icon: LucideIcon }> = {
  champion: { label: 'Champion', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: Crown },
  decision_maker: { label: 'Decision Maker', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: ShieldCheck },
  gatekeeper: { label: 'Gatekeeper', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Lock },
  influencer: { label: 'Influencer', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: UserCheck },
}

const SENTIMENT_CONFIG = {
  warm: { label: 'Warm', color: '#22c55e', dot: 'bg-[#22c55e]' },
  neutral: { label: 'Neutral', color: '#71717a', dot: 'bg-[#71717a]' },
  cold: { label: 'Cold', color: '#ef4444', dot: 'bg-[#ef4444]' },
}

// Mock stakeholder map per district
const stakeholderMap: Record<string, Stakeholder[]> = {
  'oakwood': [
    { name: 'James Whitfield', title: 'Dir. of Technology', role: 'decision_maker', email: 'jwhitfield@oakwood.edu', notes: 'Budget holder. Needs board approval for >$20K.', sentiment: 'warm' },
    { name: 'Karen Hsu', title: 'Principal, Oakwood HS', role: 'champion', notes: 'Loves the kiosk demo. Strong internal advocate.', sentiment: 'warm' },
    { name: 'Bob Crane', title: 'CFO', role: 'gatekeeper', notes: 'Approves all tech contracts. Very cost-focused.', sentiment: 'cold' },
    { name: 'Sarah Diaz', title: 'VP Operations', role: 'influencer', notes: 'Sits in on budget reviews.', sentiment: 'neutral' },
  ],
  'willowbrook': [
    { name: 'Diana Calloway', title: 'Asst. Superintendent', role: 'decision_maker', email: 'dcalloway@willowbrook.edu', notes: 'Final sign-off on $34K PO. Board meeting Dec 10.', sentiment: 'neutral' },
    { name: 'Tom Ferris', title: 'Dir. of Security', role: 'champion', notes: 'Pushed this deal internally. Wants it closed.', sentiment: 'warm' },
    { name: 'Linda Park', title: 'School Board Treasurer', role: 'gatekeeper', notes: 'Requires 3 competitive quotes.', sentiment: 'cold' },
  ],
  'foxhill': [
    { name: 'Gretchen Holt', title: 'Technology Coordinator', role: 'champion', email: 'gholt@foxhill.edu', notes: 'Runs the district summit. Key referral potential.', sentiment: 'warm' },
    { name: 'Mark Sullivan', title: 'Superintendent', role: 'decision_maker', notes: 'Delegated to Gretchen but has final say.', sentiment: 'neutral' },
    { name: 'Finance Dept.', title: 'Purchasing Team', role: 'gatekeeper', notes: 'E-Rate paperwork required.', sentiment: 'neutral' },
  ],
  'lone-star': [
    { name: 'Carlos Vega', title: 'Operations Director', role: 'decision_maker', email: 'cvega@lonestar.edu', notes: 'Publicly looking at ID systems on LinkedIn.', sentiment: 'warm' },
    { name: 'Jennifer Cruz', title: 'Principal', role: 'champion', notes: 'Wants modern ID system before semester ends.', sentiment: 'warm' },
    { name: 'District Legal', title: 'Compliance Officer', role: 'gatekeeper', notes: 'Reviewing vendor contract terms.', sentiment: 'neutral' },
  ],
  'default': [
    { name: 'Primary Contact', title: 'Administrator', role: 'champion', notes: 'Main point of contact.', sentiment: 'neutral' },
    { name: 'Budget Authority', title: 'Finance', role: 'decision_maker', notes: 'Approves spend.', sentiment: 'neutral' },
    { name: 'Procurement', title: 'Purchasing', role: 'gatekeeper', notes: 'Processes POs.', sentiment: 'neutral' },
  ],
}

function getStakeholders(district: District): Stakeholder[] {
  return stakeholderMap[district.id] ?? [
    { name: district.contact ?? 'Primary Contact', title: 'Administrator', role: 'champion', email: district.contactEmail, notes: 'Main point of contact.', sentiment: 'neutral' },
    { name: 'Budget Authority', title: 'Finance', role: 'decision_maker', notes: 'Approves spend.', sentiment: 'neutral' },
    { name: 'Procurement', title: 'Purchasing', role: 'gatekeeper', notes: 'Processes POs.', sentiment: 'neutral' },
  ]
}

// ─── Relationship Web Modal ──────────────────────────────────────────────────

function RelationshipWeb({ district, onClose }: { district: District; onClose: () => void }) {
  const stakeholders = getStakeholders(district)
  const [selected, setSelected] = useState<Stakeholder | null>(null)

  const byRole = (role: StakeholderRole) => stakeholders.filter(s => s.role === role)

  const rows: Array<{ role: StakeholderRole; width: string }> = [
    { role: 'decision_maker', width: 'w-48' },
    { role: 'champion', width: 'w-44' },
    { role: 'gatekeeper', width: 'w-44' },
    { role: 'influencer', width: 'w-40' },
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111113] border border-[#27272a] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <GitBranch className="w-4 h-4 text-[#22c55e]" />
            Stakeholder Map — {district.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {/* Tree */}
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#27272a] -translate-x-1/2" />

            <div className="space-y-4 relative z-10">
              {rows.map(({ role, width }) => {
                const nodes = byRole(role)
                if (nodes.length === 0) return null
                const cfg = ROLE_CONFIG[role]
                const Icon = cfg.icon
                return (
                  <div key={role}>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                        {cfg.label}{nodes.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {nodes.map(s => {
                        const sent = SENTIMENT_CONFIG[s.sentiment]
                        const isSelected = selected?.name === s.name
                        return (
                          <button
                            key={s.name}
                            onClick={() => setSelected(isSelected ? null : s)}
                            className={`${width} bg-[#0f0f10] border rounded-lg px-3 py-2.5 text-left transition-all hover:border-[#3f3f46] ${
                              isSelected ? 'border-[#22c55e]/50' : 'border-[#27272a]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-0.5">
                              <span className="text-sm font-semibold text-white text-xs leading-tight">{s.name}</span>
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${sent.dot}`} />
                            </div>
                            <div className="text-[10px] text-[#71717a]">{s.title}</div>
                            <div
                              className="mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded inline-block"
                              style={{ color: cfg.color, background: cfg.bg }}
                            >
                              {cfg.label}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected detail */}
          {selected && (
            <div className="mt-4 bg-[#0f0f10] border border-[#27272a] rounded-lg p-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{selected.name}</p>
                  <p className="text-xs text-[#71717a]">{selected.title}</p>
                  {selected.email && <p className="text-xs text-[#22c55e] mt-0.5">{selected.email}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: SENTIMENT_CONFIG[selected.sentiment].color }}>
                    {SENTIMENT_CONFIG[selected.sentiment].label}
                  </span>
                  <button onClick={() => setSelected(null)}>
                    <X className="w-3.5 h-3.5 text-[#52525b] hover:text-[#a1a1aa]" />
                  </button>
                </div>
              </div>
              {selected.notes && (
                <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed border-t border-[#27272a] pt-2">{selected.notes}</p>
              )}
            </div>
          )}

          {/* Sentiment key */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#27272a]">
            <span className="text-[10px] text-[#52525b] font-medium">Sentiment:</span>
            {Object.entries(SENTIMENT_CONFIG).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${val.dot}`} />
                <span className="text-[10px] text-[#71717a]">{val.label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-[#52525b]">
              <Plus className="w-3 h-3" />
              Click any node to see notes
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContactsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("All")
  const [orgDistrict, setOrgDistrict] = useState<District | null>(null)

  const filtered = useMemo(() => {
    return districts.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
      const matchesTab = activeTab === "All" || d.stage === activeTab
      return matchesSearch && matchesTab
    })
  }, [search, activeTab])

  const totalPipeline = filtered.reduce((acc, d) => acc + totalValue(d), 0)
  const totalOutstanding = filtered.reduce((acc, d) => acc + outstanding(d), 0)

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <span className="inline-flex items-center rounded-full bg-[#27272a] px-2.5 py-0.5 text-xs font-medium text-[#a1a1aa]">
            {filtered.length}
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
          <Input
            placeholder="Search districts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#111113] border-[#27272a] text-white placeholder:text-[#71717a] focus-visible:ring-[#22c55e]/30"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#27272a]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#22c55e] text-white"
                : "border-transparent text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#27272a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#27272a] hover:bg-transparent">
              <TableHead className="text-[#71717a] font-medium">Name</TableHead>
              <TableHead className="text-[#71717a] font-medium">Schools</TableHead>
              <TableHead className="text-[#71717a] font-medium">Stage</TableHead>
              <TableHead className="text-[#71717a] font-medium text-right">Total Value</TableHead>
              <TableHead className="text-[#71717a] font-medium text-right">Outstanding</TableHead>
              <TableHead className="text-[#71717a] font-medium">Last Activity</TableHead>
              <TableHead className="text-[#71717a] font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#71717a]">
                  No districts found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => {
                const tv = totalValue(d)
                const owed = outstanding(d)
                const latestQuoteDate = d.schools
                  .flatMap((s) => s.quotes)
                  .map((q) => q.poDate ?? q.quoteDate)
                  .sort()
                  .reverse()[0]

                return (
                  <TableRow key={d.id} className="border-[#27272a] hover:bg-[#18181b] transition-colors">
                    <TableCell className="font-medium text-white">
                      <div>{d.name}</div>
                      {d.state && <div className="text-xs text-[#71717a]">{d.state}</div>}
                    </TableCell>
                    <TableCell className="text-[#a1a1aa]">{d.schools.length}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColor(d.stage as Stage)}`}>
                        {d.stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-[#a1a1aa]">{formatK(tv)}</TableCell>
                    <TableCell className="text-right">
                      {owed > 0
                        ? <span className="text-[#ef4444] font-medium">{formatK(owed)}</span>
                        : <span className="text-[#52525b]">—</span>}
                    </TableCell>
                    <TableCell className="text-[#71717a] text-sm">{latestQuoteDate ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setOrgDistrict(d)}
                          className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium flex items-center gap-1"
                        >
                          <GitBranch className="w-3 h-3" />
                          Org
                        </button>
                        <span className="text-[#3f3f46]">·</span>
                        <button
                          onClick={() => {}}
                          className="text-sm text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary footer */}
      <div className="mt-4 flex items-center gap-4 text-sm text-[#71717a]">
        <span>{filtered.length} districts</span>
        <span className="text-[#3f3f46]">·</span>
        <span>{formatK(totalPipeline)} total</span>
        <span className="text-[#3f3f46]">·</span>
        <span className={totalOutstanding > 0 ? "text-[#ef4444]" : ""}>
          {formatK(totalOutstanding)} outstanding
        </span>
      </div>

      {/* Relationship Web Modal */}
      {orgDistrict && (
        <RelationshipWeb district={orgDistrict} onClose={() => setOrgDistrict(null)} />
      )}
    </div>
  )
}
