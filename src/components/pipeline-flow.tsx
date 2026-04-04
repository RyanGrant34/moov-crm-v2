'use client';

import { useMemo, useState } from 'react';
import { districts, totalValue, type District } from '@/lib/data';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSource(d: District): string {
  if (d.boces === 'Enterprise') return 'es';
  if (d.boces === 'SMB') return 'nas';
  return 'ind';
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v}`;
}

// ── Colour palette ────────────────────────────────────────────────────────────

const SOURCE_META: Record<string, { label: string; color: string }> = {
  es:  { label: 'BOCES ES',     color: '#22d3ee' },
  nas: { label: 'BOCES NAS',    color: '#818cf8' },
  ind: { label: 'Independent',  color: '#34d399' },
};

const TARGET_META: Record<string, { label: string; color: string }> = {
  Active:      { label: 'Active',      color: '#22c55e' },
  'Pending PO':{ label: 'Pending PO',  color: '#f59e0b' },
  'At Risk':   { label: 'At Risk',     color: '#ef4444' },
  New:         { label: 'New',         color: '#3b82f6' },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface NodeLayout {
  id: string;
  label: string;
  color: string;
  value: number;
  x: number;
  y: number;
  h: number;
}

interface LinkLayout {
  sourceId: string;
  targetId: string;
  srcColor: string;
  tgtColor: string;
  value: number;
  x1: number; y1: number;   // top-left of band at source
  x2: number; y2: number;   // top-left of band at target
  bh: number;               // band height
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PipelineFlow() {
  const [hovered, setHovered] = useState<{ label: string; value: number; x: number; y: number } | null>(null);

  // ── Data aggregation ────────────────────────────────────────────────────────
  const { srcTotals, tgtTotals, linkTotals, grandTotal } = useMemo(() => {
    const srcTotals: Record<string, number> = {};
    const tgtTotals: Record<string, number> = {};
    const linkTotals: Record<string, number> = {};

    for (const d of districts) {
      const src = getSource(d);
      const tgt = d.stage;
      const val = totalValue(d);
      if (val === 0) continue;

      srcTotals[src] = (srcTotals[src] || 0) + val;
      tgtTotals[tgt] = (tgtTotals[tgt] || 0) + val;
      const key = `${src}→${tgt}`;
      linkTotals[key] = (linkTotals[key] || 0) + val;
    }

    const grandTotal = Object.values(tgtTotals).reduce((a, b) => a + b, 0);
    return { srcTotals, tgtTotals, linkTotals, grandTotal };
  }, []);

  // ── SVG layout ──────────────────────────────────────────────────────────────
  const W = 680;
  const H = 380;
  const NODE_W = 18;
  const GAP = 14;
  const PAD_TOP = 14;
  const LEFT_X = 148;    // right edge of left nodes
  const RIGHT_X = W - 148; // left edge of right nodes

  const { leftNodes, rightNodes, linkLayouts } = useMemo(() => {
    if (grandTotal === 0) return { leftNodes: [], rightNodes: [], linkLayouts: [] };

    // Filter and order
    const srcIds = ['es', 'nas', 'ind'].filter(id => (srcTotals[id] || 0) > 0);
    const tgtIds = ['Active', 'Pending PO', 'At Risk', 'New'].filter(id => (tgtTotals[id] || 0) > 0);

    // Height scale: fit the taller column
    const maxNodes = Math.max(srcIds.length, tgtIds.length);
    const usableH = H - PAD_TOP * 2 - GAP * (maxNodes - 1);
    const scale = usableH / grandTotal;

    // Layout helper: centre the column vertically
    const layoutCol = (
      ids: string[],
      meta: Record<string, { label: string; color: string }>,
      totals: Record<string, number>,
      nodeX: number,
    ): NodeLayout[] => {
      const colH = grandTotal * scale + GAP * (ids.length - 1);
      const startY = (H - colH) / 2;
      let y = startY;
      return ids.map(id => {
        const h = totals[id] * scale;
        const node: NodeLayout = { id, ...meta[id], value: totals[id], x: nodeX, y, h };
        y += h + GAP;
        return node;
      });
    };

    const leftNodes = layoutCol(srcIds, SOURCE_META, srcTotals, LEFT_X - NODE_W);
    const rightNodes = layoutCol(tgtIds, TARGET_META, tgtTotals, RIGHT_X);

    // Build link bands (sorted: for each src, iterate tgts in order)
    const srcOffset: Record<string, number> = Object.fromEntries(leftNodes.map(n => [n.id, 0]));
    const tgtOffset: Record<string, number> = Object.fromEntries(rightNodes.map(n => [n.id, 0]));

    const linkLayouts: LinkLayout[] = [];
    for (const src of leftNodes) {
      for (const tgt of rightNodes) {
        const key = `${src.id}→${tgt.id}`;
        const val = linkTotals[key] || 0;
        if (val === 0) continue;

        const bh = val * scale;
        linkLayouts.push({
          sourceId: src.id,
          targetId: tgt.id,
          srcColor: src.color,
          tgtColor: tgt.color,
          value: val,
          x1: src.x + NODE_W,
          y1: src.y + srcOffset[src.id],
          x2: tgt.x,
          y2: tgt.y + tgtOffset[tgt.id],
          bh,
        });
        srcOffset[src.id] += bh;
        tgtOffset[tgt.id] += bh;
      }
    }

    return { leftNodes, rightNodes, linkLayouts };
  }, [grandTotal, srcTotals, tgtTotals, linkTotals]);

  // ── Path builder ────────────────────────────────────────────────────────────
  function makePath(l: LinkLayout): string {
    const cpx = (l.x2 - l.x1) * 0.55;
    return [
      `M${l.x1},${l.y1}`,
      `C${l.x1 + cpx},${l.y1} ${l.x2 - cpx},${l.y2} ${l.x2},${l.y2}`,
      `L${l.x2},${l.y2 + l.bh}`,
      `C${l.x2 - cpx},${l.y2 + l.bh} ${l.x1 + cpx},${l.y1 + l.bh} ${l.x1},${l.y1 + l.bh}`,
      'Z',
    ].join(' ');
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-[#52525b] uppercase tracking-widest font-semibold">Pipeline Flow</p>
          <p className="text-lg font-bold text-white mt-0.5">{fmt(grandTotal)} total pipeline</p>
        </div>
        <div className="flex gap-6 text-xs text-[#71717a]">
          <span>Source → Stage</span>
        </div>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {linkLayouts.map((l, i) => (
            <linearGradient
              key={i}
              id={`pf-grad-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={l.x1} y1="0"
              x2={l.x2} y2="0"
            >
              <stop offset="0%"   stopColor={l.srcColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={l.tgtColor} stopOpacity="0.5" />
            </linearGradient>
          ))}
        </defs>

        {/* ── Links ── */}
        {linkLayouts.map((l, i) => (
          <path
            key={i}
            d={makePath(l)}
            fill={`url(#pf-grad-${i})`}
            stroke="none"
            style={{ cursor: 'pointer', transition: 'opacity 150ms' }}
            onMouseEnter={e => {
              const svg = (e.currentTarget as SVGElement).closest('svg')!;
              const rect = svg.getBoundingClientRect();
              const vbW = W / rect.width;
              setHovered({
                label: `${SOURCE_META[l.sourceId].label} → ${TARGET_META[l.targetId]?.label ?? l.targetId}`,
                value: l.value,
                x: (e.clientX - rect.left) * vbW,
                y: l.y1 + l.bh / 2,
              });
            }}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* ── Left nodes + labels ── */}
        {leftNodes.map(n => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={NODE_W} height={Math.max(n.h, 2)} fill={n.color} rx={3} />
            {/* Name */}
            <text
              x={n.x - 10}
              y={n.y + n.h / 2 - 7}
              textAnchor="end"
              fill="#e4e4e7"
              fontSize="12"
              fontFamily="system-ui, -apple-system, sans-serif"
              dominantBaseline="middle"
              fontWeight="500"
            >
              {n.label}
            </text>
            {/* Value */}
            <text
              x={n.x - 10}
              y={n.y + n.h / 2 + 9}
              textAnchor="end"
              fill="#71717a"
              fontSize="11"
              fontFamily="system-ui, -apple-system, sans-serif"
              dominantBaseline="middle"
            >
              {fmt(n.value)}
            </text>
          </g>
        ))}

        {/* ── Right nodes + labels ── */}
        {rightNodes.map(n => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={NODE_W} height={Math.max(n.h, 2)} fill={n.color} rx={3} />
            {/* Name */}
            <text
              x={n.x + NODE_W + 10}
              y={n.y + n.h / 2 - 7}
              textAnchor="start"
              fill="#e4e4e7"
              fontSize="12"
              fontFamily="system-ui, -apple-system, sans-serif"
              dominantBaseline="middle"
              fontWeight="500"
            >
              {n.label}
            </text>
            {/* Value */}
            <text
              x={n.x + NODE_W + 10}
              y={n.y + n.h / 2 + 9}
              textAnchor="start"
              fill="#71717a"
              fontSize="11"
              fontFamily="system-ui, -apple-system, sans-serif"
              dominantBaseline="middle"
            >
              {fmt(n.value)}
            </text>
          </g>
        ))}

        {/* ── Tooltip (in SVG space) ── */}
        {hovered && (
          <g transform={`translate(${hovered.x + 12}, ${hovered.y})`}>
            <rect x={0} y={-18} width={170} height={40} rx={6} fill="#18181b" stroke="#27272a" strokeWidth={1} />
            <text x={10} y={-3} fill="#e4e4e7" fontSize="11" fontWeight="500" fontFamily="system-ui, sans-serif">
              {hovered.label}
            </text>
            <text x={10} y={14} fill="#22d3ee" fontSize="11" fontFamily="system-ui, sans-serif">
              {fmt(hovered.value)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend row */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#1c1c1e]">
        <span className="text-xs text-[#52525b] font-medium">Sources</span>
        {Object.entries(SOURCE_META).map(([id, m]) => (
          <div key={id} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: m.color }} />
            <span className="text-xs text-[#71717a]">{m.label}</span>
          </div>
        ))}
        <span className="text-[#27272a]">|</span>
        <span className="text-xs text-[#52525b] font-medium">Stages</span>
        {Object.entries(TARGET_META).map(([id, m]) => (
          <div key={id} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: m.color }} />
            <span className="text-xs text-[#71717a]">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
