'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Upload, FileText, Image, Sparkles,
  CheckCircle2, Loader2, X, DollarSign, Calendar,
  Building2, Tag,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { financeCategories, financeProjects } from '@/lib/finance-data';

type UploadState = 'idle' | 'uploading' | 'extracting' | 'done' | 'error';

interface ExtractedData {
  vendor: string;
  date: string;
  amount: string;
  currency: string;
  category: string;
  description: string;
}

// Simulates AI extraction from a receipt
function simulateExtraction(): Promise<ExtractedData> {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      vendor: 'Southwest Airlines',
      date: '2026-04-01',
      amount: '287.40',
      currency: 'USD',
      category: 'travel',
      description: 'Flight — ATL → CLT, sales visit',
    }), 2200)
  );
}

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [form, setForm] = useState<ExtractedData>({
    vendor: '', date: '', amount: '', currency: 'USD', category: '', description: '',
  });
  const [selectedProject, setSelectedProject] = useState('');
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    await new Promise(r => setTimeout(r, 800));
    setUploadState('extracting');
    const data = await simulateExtraction();
    setExtracted(data);
    setForm(data);
    setUploadState('done');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((field: keyof ExtractedData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = () => {
    setUploadState('idle');
    setFileName('');
    setExtracted(null);
    setForm({ vendor: '', date: '', amount: '', currency: 'USD', category: '', description: '' });
    setSelectedProject('');
    setSaved(false);
  };

  const handleSave = () => {
    // In production: POST to API, create transaction record
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/finance">
          <button className="p-1.5 rounded-md text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f] transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Upload Receipt</h1>
          <p className="text-[#a1a1aa] text-sm mt-0.5">AI extracts vendor, amount, date automatically</p>
        </div>
      </div>

      {/* Success state */}
      {saved && (
        <Card className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg p-4">
          <div className="flex items-center gap-2.5 text-[#22c55e]">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Transaction saved successfully</p>
              <p className="text-xs text-[#22c55e]/70 mt-0.5">Added to your finance records</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={handleReset} className="text-xs px-3 py-1.5 rounded-md bg-[#22c55e]/20 hover:bg-[#22c55e]/30 transition-colors">
                Upload another
              </button>
              <Link href="/finance/transactions">
                <button className="text-xs px-3 py-1.5 rounded-md bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-colors">
                  View transactions
                </button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Upload zone */}
      {uploadState === 'idle' && !saved && (
        <Card
          className={`bg-[#111113] border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            dragOver ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-[#27272a] hover:border-[#3f3f46]'
          }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Drop your receipt here</p>
              <p className="text-[#71717a] text-sm mt-1">or click to browse — supports JPG, PNG, PDF</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
              AI automatically extracts vendor, amount, date, and category
            </div>
          </div>
        </Card>
      )}

      {/* Processing states */}
      {(uploadState === 'uploading' || uploadState === 'extracting') && (
        <Card className="bg-[#111113] border border-[#27272a] rounded-xl p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/10 flex items-center justify-center">
              {uploadState === 'uploading'
                ? <FileText className="w-6 h-6 text-[#a855f7]" />
                : <Sparkles className="w-6 h-6 text-[#a855f7]" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center text-white font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadState === 'uploading' ? 'Uploading receipt...' : 'AI extracting data...'}
              </div>
              <p className="text-[#71717a] text-sm mt-1">
                {uploadState === 'uploading'
                  ? `Processing ${fileName}`
                  : 'Reading vendor, amount, date, and category'
                }
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-48 h-1 bg-[#27272a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: uploadState === 'uploading' ? '35%' : '85%' }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Extracted data form */}
      {uploadState === 'done' && extracted && !saved && (
        <>
          {/* AI banner */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/20">
            <Sparkles className="w-4 h-4 text-[#a855f7] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-[#a855f7] font-medium">AI extraction complete</p>
              <p className="text-xs text-[#a855f7]/70">Review and edit the fields below before saving.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <FileText className="w-3.5 h-3.5" />
              {fileName}
            </div>
            <button onClick={handleReset} className="p-1 rounded text-[#52525b] hover:text-[#a1a1aa]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <Card className="bg-[#111113] border border-[#27272a] rounded-xl p-6 space-y-5">
            <h3 className="text-white font-semibold text-base">Transaction Details</h3>

            {/* Vendor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Vendor
              </label>
              <Input
                value={form.vendor}
                onChange={e => handleInputChange('vendor', e.target.value)}
                className="bg-[#09090b] border-[#27272a] text-[#e4e4e7] focus-visible:ring-[#22c55e]/30 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa]">Description</label>
              <Input
                value={form.description}
                onChange={e => handleInputChange('description', e.target.value)}
                className="bg-[#09090b] border-[#27272a] text-[#e4e4e7] focus-visible:ring-[#22c55e]/30 text-sm"
              />
            </div>

            {/* Amount + currency row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b] text-sm">$</span>
                  <Input
                    value={form.amount}
                    onChange={e => handleInputChange('amount', e.target.value)}
                    className="pl-7 bg-[#09090b] border-[#27272a] text-[#e4e4e7] focus-visible:ring-[#22c55e]/30 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1aa]">Currency</label>
                <select
                  value={form.currency}
                  onChange={e => handleInputChange('currency', e.target.value)}
                  className="w-full text-sm bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30 h-9"
                >
                  {['USD', 'CAD', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={e => handleInputChange('date', e.target.value)}
                className="bg-[#09090b] border-[#27272a] text-[#e4e4e7] focus-visible:ring-[#22c55e]/30 text-sm"
              />
            </div>

            <Separator className="bg-[#27272a]" />

            {/* Category + Project */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1aa] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </label>
                <select
                  value={form.category}
                  onChange={e => handleInputChange('category', e.target.value)}
                  className="w-full text-sm bg-[#09090b] border border-[#27272a] text-[#a1a1aa] rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30 h-9"
                >
                  <option value="">Select category</option>
                  {financeCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a1a1aa]">Project</label>
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full text-sm bg-[#09090b] border border-[#27272a] text-[#a1a1aa] rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30 h-9"
                >
                  <option value="">Select project</option>
                  {financeProjects.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold flex items-center gap-2 flex-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Transaction
              </Button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f] rounded-md transition-all"
              >
                Discard
              </button>
            </div>
          </Card>
        </>
      )}

      {/* Supported formats info */}
      {uploadState === 'idle' && (
        <Card className="bg-[#111113] border border-[#27272a] rounded-lg p-4">
          <p className="text-xs font-semibold text-[#52525b] uppercase tracking-wider mb-3">Supported document types</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Image, label: 'Photos', sub: 'JPG, PNG, HEIC' },
              { icon: FileText, label: 'PDFs', sub: 'Invoices, statements' },
              { icon: FileText, label: 'Receipts', sub: 'Any currency' },
              { icon: FileText, label: 'Bank export', sub: 'CSV (coming soon)', dim: true },
            ].map(({ icon: Icon, label, sub, dim }) => (
              <div key={label} className={`flex items-start gap-2.5 p-3 rounded-lg bg-[#09090b] ${dim ? 'opacity-40' : ''}`}>
                <Icon className="w-4 h-4 text-[#a1a1aa] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#e4e4e7]">{label}</p>
                  <p className="text-[10px] text-[#52525b]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
