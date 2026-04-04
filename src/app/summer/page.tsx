'use client';

import { useState, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  Calendar,
  User,
  Cpu,
  Monitor,
  Smartphone,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
} from 'lucide-react';
import {
  deployments,
  PHASES,
  PHASE_META,
  PHASE_ORDER,
  PHASE_CHECKLIST,
  type SummerDeployment,
  type DeployPhase,
} from '@/lib/summer-data';

// ── Checklist state helpers ────────────────────────────────────────────────

type CheckState = Record<string, Record<DeployPhase, boolean[]>>;

function buildInitialCheckState(): CheckState {
  const state: CheckState = {};
  for (const d of deployments) {
    const currentIdx = PHASE_ORDER[d.phase];
    state[d.id] = {} as Record<DeployPhase, boolean[]>;
    for (const phase of PHASES) {
      const phaseIdx = PHASE_ORDER[phase];
      const items = PHASE_CHECKLIST[phase];
      // Phases before current = all done; current + future = none done
      state[d.id][phase] = items.map(() => phaseIdx < currentIdx);
    }
  }
  return state;
}

function countChecked(state: CheckState, id: string): { done: number; total: number } {
  const all = PHASES.flatMap(p => state[id]?.[p] ?? []);
  return { done: all.filter(Boolean).length, total: all.length };
}

// ── Owner initials ─────────────────────────────────────────────────────────

function ownerColor(name: string): string {
  const map: Record<string, string> = {
    Morgan: '#22d3ee',
    Jordan: '#818cf8',
    Casey:  '#fb923c',
    Alex:   '#34d399',
    Taylor: '#f472b6',
  };
  const first = name.split(/[\s&]+/)[0];
  return map[first] ?? '#a1a1aa';
}

function OwnerBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s&]+/)
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('');
  const color = ownerColor(name);
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold flex-shrink-0"
      style={{ backgroundColor: `${color}22`, color }}
      title={name}
    >
      {initials}
    </span>
  );
}

// ── Deployment card ────────────────────────────────────────────────────────

interface CardProps {
  deployment: SummerDeployment;
  checkState: CheckState;
  onClick: () => void;
}

function DeployCard({ deployment: d, checkState, onClick }: CardProps) {
  const meta = PHASE_META[d.phase];
  const { done, total } = countChecked(checkState, d.id);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const hasNotes = Boolean(d.notes);

  return (
    <div
      onClick={onClick}
      className="bg-[#111113] border border-[#27272a] rounded-lg p-3 cursor-pointer hover:border-[#3f3f46] transition-all group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate group-hover:text-[#e4e4e7]">
            {d.district}
          </p>
          <p className="text-xs text-[#71717a] truncate">{d.school}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasNotes && (
            <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />
          )}
          <ChevronRight className="w-3 h-3 text-[#3f3f46] group-hover:text-[#71717a]" />
        </div>
      </div>

      {/* Install week + owner */}
      <div className="flex items-center gap-2 mb-2.5 text-[#52525b]">
        <div className="flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          <span className="text-[10px]">Week of {d.installWeek}</span>
        </div>
        <span className="text-[#27272a]">·</span>
        <OwnerBadge name={d.owner} />
        <span className="text-[10px] text-[#52525b] truncate">{d.owner}</span>
      </div>

      {/* Hardware badges */}
      <div className="flex items-center gap-1.5 mb-2.5">
        {d.hardware.kiosks > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-[#71717a] bg-[#1c1c1f] px-1.5 py-0.5 rounded">
            <Monitor className="w-2.5 h-2.5" />
            {d.hardware.kiosks}K
          </span>
        )}
        {d.hardware.readers > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-[#71717a] bg-[#1c1c1f] px-1.5 py-0.5 rounded">
            <Cpu className="w-2.5 h-2.5" />
            {d.hardware.readers}R
          </span>
        )}
        {d.hardware.handhelds > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-[#71717a] bg-[#1c1c1f] px-1.5 py-0.5 rounded">
            <Smartphone className="w-2.5 h-2.5" />
            {d.hardware.handhelds}HH
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#27272a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: meta.color }}
          />
        </div>
        <span className="text-[10px] text-[#52525b] tabular-nums flex-shrink-0">{done}/{total}</span>
      </div>
    </div>
  );
}

// ── Detail drawer ──────────────────────────────────────────────────────────

interface DrawerProps {
  deployment: SummerDeployment;
  checkState: CheckState;
  onToggle: (id: string, phase: DeployPhase, idx: number) => void;
  onClose: () => void;
}

function DeployDrawer({ deployment: d, checkState, onToggle, onClose }: DrawerProps) {
  const meta = PHASE_META[d.phase];
  const currentIdx = PHASE_ORDER[d.phase];
  const { done, total } = countChecked(checkState, d.id);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-[420px] bg-[#111113] border-l border-[#27272a] h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#27272a] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">{d.district}</h2>
              <p className="text-sm text-[#71717a] mt-0.5">{d.school}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#52525b] hover:text-[#a1a1aa] transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current phase badge */}
          <div
            className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ color: meta.color, backgroundColor: meta.bg }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[#09090b] rounded-md px-3 py-2">
              <p className="text-[10px] text-[#52525b] mb-0.5">Install Week</p>
              <p className="text-xs font-medium text-[#d4d4d8]">{d.installWeek}</p>
            </div>
            <div className="bg-[#09090b] rounded-md px-3 py-2">
              <p className="text-[10px] text-[#52525b] mb-0.5">Owner</p>
              <div className="flex items-center gap-1.5">
                <OwnerBadge name={d.owner} />
                <p className="text-xs font-medium text-[#d4d4d8]">{d.owner}</p>
              </div>
            </div>
            <div className="bg-[#09090b] rounded-md px-3 py-2">
              <p className="text-[10px] text-[#52525b] mb-0.5">IT Contact</p>
              <p className="text-xs font-medium text-[#d4d4d8]">{d.itContact}</p>
            </div>
            <div className="bg-[#09090b] rounded-md px-3 py-2">
              <p className="text-[10px] text-[#52525b] mb-0.5">Principal Contact</p>
              <p className="text-xs font-medium text-[#d4d4d8]">{d.principalContact}</p>
            </div>
          </div>

          {/* Hardware */}
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-xs text-[#71717a] bg-[#1c1c1f] border border-[#27272a] px-2 py-1 rounded">
              <Monitor className="w-3 h-3" />
              {d.hardware.kiosks} Kiosks
            </span>
            <span className="flex items-center gap-1 text-xs text-[#71717a] bg-[#1c1c1f] border border-[#27272a] px-2 py-1 rounded">
              <Cpu className="w-3 h-3" />
              {d.hardware.readers} Readers
            </span>
            <span className="flex items-center gap-1 text-xs text-[#71717a] bg-[#1c1c1f] border border-[#27272a] px-2 py-1 rounded">
              <Smartphone className="w-3 h-3" />
              {d.hardware.handhelds} Handhelds
            </span>
          </div>

          {/* Notes */}
          {d.notes && (
            <div className="mt-3 flex items-start gap-2 bg-[#f59e0b]/8 border border-[#f59e0b]/20 rounded-md px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#d4d4d8]">{d.notes}</p>
            </div>
          )}

          {/* Overall progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#52525b]">Overall progress</span>
              <span className="text-[10px] font-medium text-[#a1a1aa]">{pct}%</span>
            </div>
            <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: meta.color }}
              />
            </div>
          </div>
        </div>

        {/* Checklist sections */}
        <div className="flex-1 p-5 space-y-5">
          {PHASES.map((phase) => {
            const phaseMeta = PHASE_META[phase];
            const phaseIdx = PHASE_ORDER[phase];
            const items = PHASE_CHECKLIST[phase];
            const checks = checkState[d.id]?.[phase] ?? items.map(() => false);
            const isCompleted = phaseIdx < currentIdx;
            const isCurrent = phaseIdx === currentIdx;
            const isFuture = phaseIdx > currentIdx;
            const sectionDone = checks.filter(Boolean).length;

            return (
              <div key={phase}>
                {/* Section header */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isCompleted || isCurrent ? phaseMeta.color : '#3f3f46' }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isCompleted ? '#52525b' : isCurrent ? '#e4e4e7' : '#3f3f46' }}
                  >
                    {phaseMeta.label}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-[#52525b] ml-auto">Done</span>
                  )}
                  {isCurrent && (
                    <span
                      className="text-[10px] ml-auto font-medium"
                      style={{ color: phaseMeta.color }}
                    >
                      {sectionDone}/{items.length}
                    </span>
                  )}
                  {isFuture && (
                    <Lock className="w-3 h-3 text-[#3f3f46] ml-auto" />
                  )}
                </div>

                {/* Checklist items */}
                <div className="space-y-1 ml-3">
                  {items.map((label, idx) => {
                    const checked = checks[idx] ?? false;

                    return (
                      <button
                        key={idx}
                        onClick={() => !isFuture && onToggle(d.id, phase, idx)}
                        disabled={isFuture}
                        className={`w-full flex items-start gap-2.5 text-left px-2.5 py-1.5 rounded transition-colors ${
                          isFuture
                            ? 'cursor-default opacity-40'
                            : 'hover:bg-[#1c1c1f] cursor-pointer'
                        }`}
                      >
                        {checked ? (
                          <CheckCircle2
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: phaseMeta.color }}
                          />
                        ) : isFuture ? (
                          <Circle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#27272a]" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#3f3f46]" />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${
                            checked
                              ? 'text-[#52525b] line-through'
                              : isFuture
                              ? 'text-[#3f3f46]'
                              : 'text-[#a1a1aa]'
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function SummerPage() {
  const [checkState, setCheckState] = useState<CheckState>(() =>
    buildInitialCheckState()
  );
  const [selected, setSelected] = useState<SummerDeployment | null>(null);

  function handleToggle(id: string, phase: DeployPhase, idx: number) {
    setCheckState(prev => {
      const current = prev[id]?.[phase] ?? [];
      const next = [...current];
      next[idx] = !next[idx];
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [phase]: next,
        },
      };
    });
  }

  const columns = useMemo(() =>
    PHASES.map(phase => ({
      phase,
      meta: PHASE_META[phase],
      deployments: deployments.filter(d => d.phase === phase),
    })),
  []);

  const stats = useMemo(() => {
    const total = deployments.length;
    const live = deployments.filter(d => d.phase === 'live').length;
    const atRisk = deployments.filter(d => d.notes).length;
    const inProgress = deployments.filter(
      d => d.phase !== 'live' && d.phase !== 'confirmed'
    ).length;
    return { total, live, atRisk, inProgress };
  }, []);

  const totalHardware = useMemo(() => ({
    kiosks: deployments.reduce((s, d) => s + d.hardware.kiosks, 0),
    readers: deployments.reduce((s, d) => s + d.hardware.readers, 0),
    handhelds: deployments.reduce((s, d) => s + d.hardware.handhelds, 0),
  }), []);

  return (
    <div className="flex-1 bg-[#09090b] min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Summer Deployments</h1>
            <p className="text-sm text-[#71717a] mt-0.5">
              {stats.total} schools scheduled · {stats.live} live · {stats.atRisk > 0 ? `${stats.atRisk} flagged` : 'none flagged'}
            </p>
          </div>

          {/* Hardware totals */}
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-2.5 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
              <Monitor className="w-3 h-3 text-[#52525b]" />
              <span className="font-semibold text-[#a1a1aa]">{totalHardware.kiosks}</span> kiosks
            </div>
            <div className="w-px h-3 bg-[#27272a]" />
            <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
              <Cpu className="w-3 h-3 text-[#52525b]" />
              <span className="font-semibold text-[#a1a1aa]">{totalHardware.readers}</span> readers
            </div>
            <div className="w-px h-3 bg-[#27272a]" />
            <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
              <Smartphone className="w-3 h-3 text-[#52525b]" />
              <span className="font-semibold text-[#a1a1aa]">{totalHardware.handhelds}</span> handhelds
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#52525b] mb-1">Total Schools</p>
            <p className="text-2xl font-bold text-white tabular-nums">{stats.total}</p>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#52525b] mb-1">Live</p>
            <p className="text-2xl font-bold text-[#22c55e] tabular-nums">{stats.live}</p>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#52525b] mb-1">In Progress</p>
            <p className="text-2xl font-bold text-[#3b82f6] tabular-nums">{stats.inProgress}</p>
          </div>
          <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3">
            <p className="text-xs text-[#52525b] mb-1">Flagged</p>
            <p className={`text-2xl font-bold tabular-nums ${stats.atRisk > 0 ? 'text-[#f59e0b]' : 'text-[#3f3f46]'}`}>
              {stats.atRisk}
            </p>
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(({ phase, meta, deployments: colDeployments }) => (
            <div
              key={phase}
              className="flex-shrink-0 w-64 bg-[#0f0f10] rounded-lg overflow-hidden"
              style={{ borderTop: `2px solid ${meta.color}` }}
            >
              {/* Column header */}
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h2 className="text-sm font-semibold text-[#e4e4e7]">{meta.label}</h2>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ color: meta.color, backgroundColor: meta.bg }}
                  >
                    {colDeployments.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#3f3f46]">{meta.description}</p>
              </div>

              <div className="h-px bg-[#27272a] mx-3" />

              {/* Cards */}
              <div className="p-3 space-y-2 min-h-[120px]">
                {colDeployments.length === 0 ? (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-xs text-[#3f3f46]">No deployments</p>
                  </div>
                ) : (
                  colDeployments.map(d => (
                    <DeployCard
                      key={d.id}
                      deployment={d}
                      checkState={checkState}
                      onClick={() => setSelected(d)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 text-[10px] text-[#52525b]">
          <Monitor className="w-3 h-3" /> K = Kiosks
          <span className="mx-1 text-[#27272a]">·</span>
          <Cpu className="w-3 h-3" /> R = Readers
          <span className="mx-1 text-[#27272a]">·</span>
          <Smartphone className="w-3 h-3" /> HH = Handhelds
          <span className="mx-1 text-[#27272a]">·</span>
          <AlertTriangle className="w-3 h-3 text-[#f59e0b]" /> = Open issue
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <DeployDrawer
          deployment={selected}
          checkState={checkState}
          onToggle={handleToggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
