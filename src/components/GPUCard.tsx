import React from 'react';
import { GPUDetail } from '../types';
import { X, Calendar, Zap, Layers, Activity, History, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GPUCardProps {
  gpu: GPUDetail;
  onRemove: () => void;
}

export const GPUCard: React.FC<GPUCardProps> = ({ gpu, onRemove }) => {
  const brandClasses = {
    AMD: 'bg-brand-amd/5 border-brand-amd/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]',
    NVIDIA: 'bg-brand-nvidia/5 border-brand-nvidia/20 shadow-[0_0_40px_rgba(34,197,94,0.05)]',
    Intel: 'bg-brand-intel/5 border-brand-intel/20 shadow-[0_0_40px_rgba(96,165,250,0.05)]',
  };

  const SpecRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: any }) => (
    <div className="p-3 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-semibold text-white truncate">{value || 'N/A'}</div>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "frosted-panel overflow-hidden relative p-6 flex flex-col group min-h-[450px]",
        brandClasses[gpu.brand]
      )}
    >
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl z-10 transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-6">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
          gpu.brand === 'AMD' ? "bg-brand-amd/20 text-brand-amd" :
          gpu.brand === 'NVIDIA' ? "bg-brand-nvidia/20 text-brand-nvidia" :
          "bg-brand-intel/20 text-brand-intel"
        )}>
          {gpu.releaseYear} • {gpu.brand}
        </span>
        <h3 className="text-xl font-bold text-white mt-1 leading-tight">{gpu.modelName}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-slate-500 font-mono tracking-tight">{gpu.architecture}</p>
          <div className="text-sm font-bold text-white font-mono">{gpu.priceMSRP || 'N/A'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <SpecRow icon={Layers} label="VRAM" value={gpu.vram} />
        <SpecRow icon={Layers} label="Bus" value={gpu.memoryBus} />
        <SpecRow icon={Activity} label="Clock" value={gpu.boostClock} />
        <SpecRow icon={Zap} label="TDP" value={gpu.powerTDP} />
      </div>

    {gpu.compatibleCPUs && (
      <div className="mb-8 space-y-3">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          Recommended CPUs
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="text-[8px] text-blue-400 font-bold uppercase tracking-tighter mb-1">Intel Pairings</div>
            <ul className="space-y-1">
              {gpu.compatibleCPUs.intel?.slice(0, 3)?.map((cpu, i) => (
                <li key={i} className="text-[10px] text-slate-300 truncate">{cpu}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="text-[8px] text-red-400 font-bold uppercase tracking-tighter mb-1">AMD Pairings</div>
            <ul className="space-y-1">
              {gpu.compatibleCPUs.amd?.slice(0, 3)?.map((cpu, i) => (
                <li key={i} className="text-[10px] text-slate-300 truncate">{cpu}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-[9px] text-center text-slate-600 font-medium italic">
          Tier: {gpu.compatibleCPUs.tier}
        </div>
      </div>
    )}

    {gpu.partners && gpu.partners.length > 0 && (
      <div className="mb-8 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Partner Manufacturers
        </div>
        <div className="flex flex-wrap gap-1">
          {gpu.partners?.map((partner) => (
            <span key={partner} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-slate-400">
              {partner}
            </span>
          ))}
        </div>
      </div>
    )}

    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <History className="w-3 h-3" />
          Driver Stability
        </div>
      </div>
      
      <div className="space-y-3">
        {gpu.drivers?.slice(0, 3)?.map((driver, idx) => (
          <div key={`${gpu.modelName}-${driver.version}-${idx}`} className="bg-white/5 p-3 rounded-2xl border border-white/5 relative overflow-hidden group/item">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[11px] font-bold text-white leading-none">{driver.version}</div>
                <div className="text-[9px] text-slate-500 mt-1">{driver.releaseDate}</div>
              </div>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                idx === 0 ? "bg-blue-400" : "bg-slate-700"
              )} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </motion.div>
  );
};
