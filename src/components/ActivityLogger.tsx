'use client';

import { useState } from 'react';
import { X, CheckCircle2, Phone, Mail, MessageSquare, FileText, Users, Mic } from 'lucide-react';
import { districts } from '@/lib/data';

type LogType = 'call' | 'email' | 'voicemail' | 'quote' | 'meeting' | 'demo';

const LOG_TYPES: Array<{ id: LogType; label: string; icon: typeof Phone; color: string }> = [
  { id: 'call',      label: 'Called',       icon: Phone,         color: '#22c55e' },
  { id: 'email',     label: 'Emailed',      icon: Mail,          color: '#3b82f6' },
  { id: 'voicemail', label: 'Left VM',      icon: Mic,           color: '#8b5cf6' },
  { id: 'quote',     label: 'Sent Quote',   icon: FileText,      color: '#f59e0b' },
  { id: 'meeting',   label: 'Met In Person',icon: Users,         color: '#fb923c' },
  { id: 'demo',      label: 'Demo',         icon: MessageSquare, color: '#0ea5e9' },
];

interface Toast {
  id: string;
  message: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ActivityLogger({ open, onClose }: Props) {
  const [logType, setLogType] = useState<LogType>('call');
  const [districtId, setDistrictId] = useState('');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const selectedDistrict = districts.find(d => d.id === districtId);
  const cfg = LOG_TYPES.find(t => t.id === logType)!;

  function handleSave() {
    if (!districtId) return;
    setSaved(true);

    const id = Math.random().toString(36).slice(2);
    const district = districts.find(d => d.id === districtId);
    const typeLabel = LOG_TYPES.find(t => t.id === logType)?.label ?? logType;
    setToasts(prev => [...prev, {
      id,
      message: `${typeLabel} logged for ${district?.name ?? ''}`,
    }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);

    // Reset
    setTimeout(() => {
      setSaved(false);
      setDistrictId('');
      setNotes('');
      setOutcome('');
      onClose();
    }, 800);
  }

  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-md mx-4 bg-[#111113] border border-[#27272a] rounded-xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
            <h2 className="text-sm font-semibold text-white">Log Activity</h2>
            <button onClick={onClose}>
              <X className="w-4 h-4 text-[#52525b] hover:text-[#a1a1aa] transition-colors" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Type selector */}
            <div>
              <label className="text-xs font-medium text-[#71717a] block mb-2">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {LOG_TYPES.map(t => {
                  const Icon = t.icon;
                  const active = logType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setLogType(t.id)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        active
                          ? 'border-opacity-40 border-current'
                          : 'border-[#27272a] text-[#71717a] hover:border-[#3f3f46] hover:text-[#a1a1aa]'
                      }`}
                      style={active ? { borderColor: t.color, color: t.color, background: `${t.color}12` } : {}}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-xs font-medium text-[#71717a] block mb-1.5">Client *</label>
              <select
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
                className="w-full bg-[#0f0f10] border border-[#27272a] text-sm text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#3f3f46]"
              >
                <option value="">Select client…</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.stage}</option>
                ))}
              </select>
              {selectedDistrict?.contact && (
                <p className="text-xs text-[#52525b] mt-1">Contact: {selectedDistrict.contact}</p>
              )}
            </div>

            {/* Outcome */}
            <div>
              <label className="text-xs font-medium text-[#71717a] block mb-1.5">Outcome</label>
              <select
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                className="w-full bg-[#0f0f10] border border-[#27272a] text-sm text-[#a1a1aa] rounded-lg px-3 py-2.5 outline-none focus:border-[#3f3f46]"
              >
                <option value="">Select outcome…</option>
                <option>Connected — interested</option>
                <option>Connected — not interested</option>
                <option>Connected — follow-up scheduled</option>
                <option>No answer — left message</option>
                <option>No answer — will try again</option>
                <option>PO promised — coming soon</option>
                <option>Budget blocked — try Q2</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-[#71717a] block mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What happened? Key details, next steps…"
                rows={3}
                className="w-full bg-[#0f0f10] border border-[#27272a] text-sm text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#3f3f46] resize-none placeholder:text-[#3f3f46]"
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!districtId || saved}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-[#22c55e]/20 text-[#22c55e]'
                  : districtId
                  ? 'bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/25'
                  : 'bg-[#27272a] text-[#52525b] cursor-not-allowed'
              }`}
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Logged!</>
              ) : (
                <>Log {cfg.label}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="fixed bottom-5 right-5 space-y-2 z-[60]">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 bg-[#111113] border border-[#22c55e]/40 rounded-lg px-4 py-3 shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
            <p className="text-xs font-medium text-white">{t.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
