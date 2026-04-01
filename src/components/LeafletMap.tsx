'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { districts, districtCoords, totalValue, outstanding } from '@/lib/data';
import type { District } from '@/lib/data';

function formatK(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function getRadius(v: number): number {
  if (v >= 50000) return 22;
  if (v >= 30000) return 18;
  if (v >= 20000) return 14;
  if (v >= 10000) return 10;
  return 7;
}

function getColor(d: District): string {
  if (d.stage === 'Active') return '#22c55e';
  if (d.stage === 'Pending PO') return '#f59e0b';
  if (d.stage === 'At Risk') return '#ef4444';
  return '#3b82f6';
}

interface Props {
  filter: string;
}

export default function LeafletMap({ filter }: Props) {
  // Suppress leaflet "window is not defined" errors on mount
  useEffect(() => {}, []);

  const visible = districts.filter(d => {
    if (filter === 'all') return true;
    return d.stage === filter;
  });

  return (
    <MapContainer
      center={[38.5, -95.0]}
      zoom={4}
      style={{ height: '100%', width: '100%', borderRadius: '8px', background: '#111113' }}
      className="leaflet-dark"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {visible.map(d => {
        const coords = districtCoords[d.id];
        if (!coords) return null;
        const val = totalValue(d);
        const out = outstanding(d);
        const color = getColor(d);
        const radius = getRadius(val);

        return (
          <CircleMarker
            key={d.id}
            center={coords}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.85,
              color: color,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -radius]}
              opacity={1}
              className="leaflet-tooltip-dark"
            >
              <div style={{
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: 6,
                padding: '8px 12px',
                minWidth: 160,
                color: '#fafafa',
                fontSize: 12,
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.name}</div>
                <div style={{ color: '#a1a1aa', marginBottom: 2 }}>{d.state} · {d.stage}</div>
                <div style={{ color: '#22c55e', fontWeight: 600 }}>Total: {formatK(val)}</div>
                {out > 0 && (
                  <div style={{ color: '#f59e0b', fontWeight: 500 }}>Outstanding: {formatK(out)}</div>
                )}
                <div style={{ color: '#71717a', marginTop: 2 }}>
                  {d.schools.length} school{d.schools.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
