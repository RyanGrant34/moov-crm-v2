'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Kanban, Users, Activity, BarChart3, Zap, MapPin, Radio, Calculator, CheckSquare, Mail, Package, Truck, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Lead Mapper', icon: Kanban },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const intelligenceNav = [
  { href: '/pulse', label: 'Company Pulse', icon: Radio },
  { href: '/map', label: 'Deal Heatmap', icon: MapPin },
  { href: '/calculator', label: 'ROI Calculator', icon: Calculator },
];

const toolsNav = [
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/templates', label: 'Templates', icon: Mail },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/deliveries', label: 'Deliveries', icon: Truck },
  { href: '/summer', label: 'Summer Prep', icon: Layers },
];


export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[200px] flex-shrink-0 bg-[#111113] border-r border-[#27272a] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 pb-3 border-b border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#22c55e] flex items-center justify-center">
            <span className="text-[#09090b] font-bold text-sm">M</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm tracking-tight">RG</div>
            <div className="text-[#52525b] text-[10px]">District CRM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 pt-3 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-wider px-2 mb-2">Pipeline</p>
        {mainNav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm mb-0.5 transition-all',
                active
                  ? 'bg-[#22c55e]/10 text-[#22c55e] font-medium'
                  : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f]'
              )}>
              <Icon size={14} />
              {label}
            </Link>
          );
        })}

        {/* Divider + Intelligence section */}
        <div className="h-px bg-[#27272a] mx-2 my-3" />
        <p className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-wider px-2 mb-2">Intelligence</p>
        {intelligenceNav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm mb-0.5 transition-all',
                active
                  ? 'bg-[#22c55e]/10 text-[#22c55e] font-medium'
                  : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f]'
              )}>
              <Icon size={14} />
              {label}
            </Link>
          );
        })}

        {/* Tools section */}
        <div className="h-px bg-[#27272a] mx-2 my-3" />
        <p className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-wider px-2 mb-2">Tools</p>
        {toolsNav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm mb-0.5 transition-all',
                active
                  ? 'bg-[#22c55e]/10 text-[#22c55e] font-medium'
                  : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#1c1c1f]'
              )}>
              <Icon size={14} />
              {label}
            </Link>
          );
        })}

      </nav>

      {/* Quick action */}
      <div className="p-3 border-t border-[#27272a]">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium hover:bg-[#22c55e]/20 transition-all">
          <Zap size={13} />
          New Lead
        </button>
      </div>

      {/* User */}
      <div className="p-3 border-t border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">RG</div>
          <div>
            <div className="text-[#d4d4d8] text-xs font-medium">Ryan Grant</div>
            <div className="text-[#52525b] text-[10px]">CS & Marketing</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
