import React from 'react';
import { Box, Cpu } from 'lucide-react';
import { GPUBrand } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  onVendorSelect: (vendor: GPUBrand | 'All') => void;
  activeVendor: GPUBrand | 'All';
}

export function Sidebar({ onVendorSelect, activeVendor }: SidebarProps) {
  const vendors: (GPUBrand | 'All')[] = ['All', 'NVIDIA', 'AMD', 'Intel'];

  return (
    <aside className="w-64 sidebar-glass p-6 flex flex-col gap-8 hidden lg:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-white italic">
          G
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white italic">GPUPULSE<span className="text-slate-500 font-light">.COM</span></h1>
      </div>

      <nav className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-2">Vendors</div>
        {vendors.map((vendor) => (
          <button
            key={vendor}
            onClick={() => onVendorSelect(vendor)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group",
              activeVendor === vendor 
                ? "bg-white/10 border border-white/10 text-white" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full transition-transform group-hover:scale-125",
              vendor === 'NVIDIA' ? "bg-brand-nvidia shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
              vendor === 'AMD' ? "bg-brand-amd shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
              vendor === 'Intel' ? "bg-brand-intel shadow-[0_0_8px_rgba(96,165,250,0.4)]" :
              "bg-slate-500"
            )} />
            {vendor}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Architecture Tracking</div>
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
             <Box className="w-3.5 h-3.5" />
             Specs & Drivers 2.4
          </div>
        </div>
      </div>
    </aside>
  );
}
