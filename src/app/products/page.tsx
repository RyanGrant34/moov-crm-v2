'use client';

import { useState, useMemo } from 'react';
import { districts } from '@/lib/data';
import { products, categoryConfig, billingConfig, Product, ProductCategory } from '@/lib/products-data';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

interface LineItem {
  productId: string;
  qty: number;
  unitPrice: number;
}

function formatPrice(n: number) {
  if (n === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const CATEGORIES: ProductCategory[] = ['software', 'hardware', 'consumables', 'services', 'support'];

export default function ProductsPage() {
  const [tab, setTab] = useState<'catalog' | 'quote'>('catalog');

  // Quote builder state
  const [districtId, setDistrictId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [quoteNum, setQuoteNum] = useState(() => `Q-${Date.now().toString().slice(-6)}`);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { productId: '', qty: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedDistrict = districts.find((d) => d.id === districtId);

  function addLine() {
    setLineItems((prev) => [...prev, { productId: '', qty: 1, unitPrice: 0 }]);
  }

  function removeLine(i: number) {
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateLine(i: number, patch: Partial<LineItem>) {
    setLineItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== i) return item;
        const updated = { ...item, ...patch };
        // Auto-fill price when product changes
        if (patch.productId !== undefined) {
          const p = products.find((p) => p.id === patch.productId);
          updated.unitPrice = p ? p.unitPrice : 0;
        }
        return updated;
      })
    );
  }

  const subtotal = useMemo(
    () => lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0),
    [lineItems]
  );

  function buildInvoiceText() {
    const distName = selectedDistrict?.name ?? districtId;
    const lines = lineItems
      .filter((li) => li.productId)
      .map((li) => {
        const p = products.find((x) => x.id === li.productId);
        const name = p ? p.name : li.productId;
        const total = li.qty * li.unitPrice;
        return `  ${name} x${li.qty} @ ${formatPrice(li.unitPrice)} = ${formatPrice(total)}`;
      })
      .join('\n');
    return `QUOTE — ${quoteNum}
Date: ${formatDate(new Date())}

Bill To:
${distName}${schoolName ? '\n' + schoolName : ''}

LINE ITEMS:
${lines}

SUBTOTAL: ${formatPrice(subtotal)}
${notes ? '\nNotes: ' + notes : ''}`;
  }

  async function copyInvoice() {
    await navigator.clipboard.writeText(buildInvoiceText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 bg-[#09090b] min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Product Catalog</h1>
          <p className="text-sm text-[#71717a] mt-0.5">Pricing sheet and quote builder</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#27272a]">
          {(['catalog', 'quote'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'border-[#22c55e] text-[#22c55e]'
                  : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              {t === 'catalog' ? 'Catalog' : 'Quote Builder'}
            </button>
          ))}
        </div>

        {/* CATALOG TAB */}
        {tab === 'catalog' && (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat);
              if (!catProducts.length) return null;
              const cfg = categoryConfig[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[#3f3f46] text-xs">{catProducts.length} items</span>
                  </div>
                  <div className="rounded-lg border border-[#27272a] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#27272a] bg-[#111113]">
                          <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">SKU</th>
                          <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Name</th>
                          <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Billing</th>
                          <th className="text-right px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Unit Price</th>
                          <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider">Unit</th>
                          <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catProducts.map((p, i) => {
                          const bCfg = billingConfig[p.billing];
                          return (
                            <tr
                              key={p.id}
                              className={`border-b border-[#27272a] last:border-0 ${
                                i % 2 === 0 ? 'bg-[#09090b]' : 'bg-[#111113]/40'
                              } hover:bg-[#111113] transition-colors`}
                            >
                              <td className="px-4 py-3 font-mono text-xs text-[#52525b]">{p.sku}</td>
                              <td className="px-4 py-3">
                                <span className="text-[#d4d4d8] font-medium">{p.name}</span>
                                {p.note && (
                                  <span className="ml-2 text-[10px] text-[#71717a] bg-[#27272a] px-1.5 py-0.5 rounded">
                                    {p.note}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{ color: bCfg.color, background: `${bCfg.color}18` }}
                                >
                                  {bCfg.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-white tabular-nums">
                                {formatPrice(p.unitPrice)}
                              </td>
                              <td className="px-4 py-3 text-[#71717a] text-xs">{p.unit}</td>
                              <td className="px-4 py-3 text-[#52525b] text-xs hidden lg:table-cell max-w-xs truncate">
                                {p.description}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QUOTE BUILDER TAB */}
        {tab === 'quote' && (
          <div className="space-y-6">
            {/* Quote header fields */}
            <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Quote Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">District</label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#d4d4d8] focus:outline-none focus:border-[#22c55e]/60"
                  >
                    <option value="">Select district...</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">School / Site</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. West Field High School"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#d4d4d8] placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/60"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">Quote #</label>
                  <input
                    type="text"
                    value={quoteNum}
                    onChange={(e) => setQuoteNum(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#d4d4d8] font-mono focus:outline-none focus:border-[#22c55e]/60"
                  />
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="bg-[#111113] border border-[#27272a] rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-[#27272a] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Line Items</h2>
                <button
                  onClick={addLine}
                  className="flex items-center gap-1.5 text-xs text-[#22c55e] hover:text-[#16a34a] transition-colors"
                >
                  <Plus size={13} />
                  Add Line Item
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#27272a] bg-[#09090b]/40">
                    <th className="text-left px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider w-1/2">Product</th>
                    <th className="text-right px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider w-24">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider w-32">Unit Price</th>
                    <th className="text-right px-4 py-2.5 text-[#52525b] font-medium text-xs uppercase tracking-wider w-32">Total</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li, i) => {
                    const lineTotal = li.qty * li.unitPrice;
                    return (
                      <tr key={i} className="border-b border-[#27272a] last:border-0">
                        <td className="px-4 py-2.5">
                          <select
                            value={li.productId}
                            onChange={(e) => updateLine(i, { productId: e.target.value })}
                            className="w-full bg-[#09090b] border border-[#27272a] rounded px-2 py-1.5 text-sm text-[#d4d4d8] focus:outline-none focus:border-[#22c55e]/60"
                          >
                            <option value="">Select product...</option>
                            {CATEGORIES.map((cat) => (
                              <optgroup key={cat} label={categoryConfig[cat].label}>
                                {products
                                  .filter((p) => p.category === cat)
                                  .map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name} ({p.sku})
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min={1}
                            value={li.qty}
                            onChange={(e) => updateLine(i, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-full bg-[#09090b] border border-[#27272a] rounded px-2 py-1.5 text-sm text-right text-[#d4d4d8] focus:outline-none focus:border-[#22c55e]/60 tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={li.unitPrice}
                            onChange={(e) => updateLine(i, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#09090b] border border-[#27272a] rounded px-2 py-1.5 text-sm text-right text-[#d4d4d8] focus:outline-none focus:border-[#22c55e]/60 tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-white tabular-nums">
                          {formatPrice(lineTotal)}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <button
                            onClick={() => removeLine(i)}
                            className="text-[#3f3f46] hover:text-[#ef4444] transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#27272a] bg-[#09090b]/40">
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-[#a1a1aa]">
                      Subtotal
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-white tabular-nums text-base">
                      {formatPrice(subtotal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5">
              <label className="block text-xs text-[#71717a] mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes for this quote..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#d4d4d8] placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/60 resize-none"
              />
            </div>

            {/* Preview button */}
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="w-full py-2.5 rounded-md bg-[#22c55e]/10 text-[#22c55e] text-sm font-semibold border border-[#22c55e]/20 hover:bg-[#22c55e]/20 transition-all"
            >
              {showPreview ? 'Hide' : 'Preview'} Invoice
            </button>

            {/* Invoice preview */}
            {showPreview && (
              <div className="bg-[#111113] border border-[#27272a] rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272a]">
                  <span className="text-xs text-[#71717a]">Invoice Preview</span>
                  <button
                    onClick={copyInvoice}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-[#1c1c1f] border border-[#27272a] text-[#a1a1aa] hover:text-white transition-colors"
                  >
                    {copied ? <Check size={12} className="text-[#22c55e]" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-5 font-mono text-sm">
                  {/* Invoice header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded bg-[#22c55e] flex items-center justify-center">
                          <span className="text-[#09090b] font-bold text-xs">M</span>
                        </div>
                        <span className="text-white font-bold text-base tracking-tight">RG</span>
                      </div>
                      <div className="text-[#52525b] text-xs"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-base">QUOTE</div>
                      <div className="text-[#22c55e] text-sm font-mono">{quoteNum}</div>
                      <div className="text-[#71717a] text-xs mt-1">{formatDate(new Date())}</div>
                    </div>
                  </div>

                  {/* Bill to */}
                  <div className="mb-6">
                    <div className="text-[#52525b] text-xs uppercase tracking-wider mb-1">Bill To</div>
                    <div className="text-white font-medium">{(selectedDistrict?.name ?? districtId) || 'District'}</div>
                    {schoolName && <div className="text-[#a1a1aa] text-sm">{schoolName}</div>}
                    {selectedDistrict?.contactEmail && (
                      <div className="text-[#52525b] text-xs mt-0.5">{selectedDistrict.contactEmail}</div>
                    )}
                  </div>

                  {/* Line items table */}
                  <table className="w-full text-sm mb-6">
                    <thead>
                      <tr className="border-b border-[#27272a]">
                        <th className="text-left pb-2 text-[#52525b] text-xs font-medium uppercase tracking-wider">Item</th>
                        <th className="text-right pb-2 text-[#52525b] text-xs font-medium uppercase tracking-wider">Qty</th>
                        <th className="text-right pb-2 text-[#52525b] text-xs font-medium uppercase tracking-wider">Unit Price</th>
                        <th className="text-right pb-2 text-[#52525b] text-xs font-medium uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems
                        .filter((li) => li.productId)
                        .map((li, i) => {
                          const p = products.find((x) => x.id === li.productId);
                          return (
                            <tr key={i} className="border-b border-[#27272a]/60">
                              <td className="py-2.5">
                                <div className="text-[#d4d4d8]">{p?.name ?? li.productId}</div>
                                {p && <div className="text-[#52525b] text-xs">{p.sku} · {p.unit}</div>}
                              </td>
                              <td className="py-2.5 text-right text-[#a1a1aa] tabular-nums">{li.qty}</td>
                              <td className="py-2.5 text-right text-[#a1a1aa] tabular-nums">{formatPrice(li.unitPrice)}</td>
                              <td className="py-2.5 text-right text-white font-medium tabular-nums">{formatPrice(li.qty * li.unitPrice)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="pt-3 text-right text-[#a1a1aa] text-sm font-semibold pr-4">
                          TOTAL
                        </td>
                        <td className="pt-3 text-right text-white font-bold text-lg tabular-nums">
                          {formatPrice(subtotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Notes */}
                  {notes && (
                    <div className="border-t border-[#27272a] pt-4">
                      <div className="text-[#52525b] text-xs uppercase tracking-wider mb-1">Notes</div>
                      <div className="text-[#a1a1aa] text-sm whitespace-pre-wrap">{notes}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
