'use client';

import { useState } from 'react';
import { emailTemplates } from '@/lib/templates-data';
import { Copy, CheckCheck, Mail, Tag, ChevronDown, ChevronRight, Zap } from 'lucide-react';

const SCENARIO_COLORS: Record<string, string> = {
  'cold': '#3b82f6',
  'follow-up': '#f59e0b',
  'PO': '#ef4444',
  'finance': '#ef4444',
  'post-install': '#22c55e',
  'retention': '#22c55e',
  'upsell': '#8b5cf6',
  'renewal': '#8b5cf6',
  'budget': '#0ea5e9',
  'E-Rate': '#0ea5e9',
  'compliance': '#fb923c',
  'urgency': '#fb923c',
  'deadline': '#fb923c',
};

function tagColor(tag: string): string {
  return SCENARIO_COLORS[tag] ?? '#71717a';
}

export default function TemplatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);
  const [expanded, setExpanded] = useState<string>(emailTemplates[0].id);
  const [filter, setFilter] = useState('all');

  const allTags = Array.from(new Set(emailTemplates.flatMap(t => t.tags)));

  const filtered = filter === 'all'
    ? emailTemplates
    : emailTemplates.filter(t => t.tags.includes(filter));

  function copy(id: string, field: 'subject' | 'body', text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);
    setTimeout(() => { setCopiedId(null); setCopiedField(null); }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#22c55e]" />
          Email Templates
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-0.5">
          Pre-written outreach for every scenario — click to copy subject or body
        </p>
      </div>

      {/* Tag filter */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e]'
              : 'bg-[#111113] border border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          All ({emailTemplates.length})
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === tag
                ? 'bg-[#27272a] border border-[#3f3f46] text-white'
                : 'bg-[#111113] border border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {filtered.map(tmpl => {
          const isExpanded = expanded === tmpl.id;
          const copiedThis = copiedId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`bg-[#111113] border rounded-xl overflow-hidden transition-all ${
                isExpanded ? 'border-[#3f3f46]' : 'border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              {/* Header row */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setExpanded(isExpanded ? '' : tmpl.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{tmpl.name}</p>
                    <p className="text-xs text-[#71717a] truncate">{tmpl.scenario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  {/* Tags */}
                  <div className="hidden sm:flex gap-1.5">
                    {tmpl.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ color: tagColor(tag), background: `${tagColor(tag)}15` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-[#52525b]" />
                    : <ChevronRight className="w-4 h-4 text-[#52525b]" />
                  }
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="h-px bg-[#27272a]" />

                  {/* Subject line */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-semibold text-[#52525b] uppercase tracking-wider">Subject Line</label>
                      <button
                        onClick={() => copy(tmpl.id, 'subject', tmpl.subject)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                          copiedThis && copiedField === 'subject'
                            ? 'bg-[#22c55e]/15 text-[#22c55e]'
                            : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46]'
                        }`}
                      >
                        {copiedThis && copiedField === 'subject'
                          ? <><CheckCheck className="w-3 h-3" /> Copied!</>
                          : <><Copy className="w-3 h-3" /> Copy</>
                        }
                      </button>
                    </div>
                    <div className="bg-[#0f0f10] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-[#e4e4e7] font-medium">
                      {tmpl.subject}
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-semibold text-[#52525b] uppercase tracking-wider">Email Body</label>
                      <button
                        onClick={() => copy(tmpl.id, 'body', tmpl.body)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                          copiedThis && copiedField === 'body'
                            ? 'bg-[#22c55e]/15 text-[#22c55e]'
                            : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46]'
                        }`}
                      >
                        {copiedThis && copiedField === 'body'
                          ? <><CheckCheck className="w-3 h-3" /> Copied!</>
                          : <><Copy className="w-3 h-3" /> Copy</>
                        }
                      </button>
                    </div>
                    <div className="bg-[#0f0f10] border border-[#27272a] rounded-lg px-4 py-3.5">
                      <pre className="text-sm text-[#a1a1aa] whitespace-pre-wrap font-sans leading-relaxed">{tmpl.body}</pre>
                    </div>
                  </div>

                  {/* Placeholders hint */}
                  <div className="flex items-start gap-2 bg-[#0f0f10] border border-[#27272a] rounded-lg px-3 py-2.5">
                    <Zap className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-[#f59e0b] mb-0.5">Fill in placeholders</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(tmpl.body + tmpl.subject)
                          .match(/\{\{[^}]+\}\}/g)
                          ?.filter((v, i, a) => a.indexOf(v) === i)
                          .map(ph => (
                            <span key={ph} className="text-[10px] bg-[#27272a] text-[#a1a1aa] px-1.5 py-0.5 rounded font-mono">
                              {ph}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  </div>

                  {/* All tags */}
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-[#52525b]" />
                    <div className="flex gap-1.5 flex-wrap">
                      {tmpl.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer hover:opacity-80"
                          style={{ color: tagColor(tag), background: `${tagColor(tag)}15` }}
                          onClick={() => setFilter(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
