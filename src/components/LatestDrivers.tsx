import React, { useEffect, useState } from 'react';
import { getLatestDriverUpdates } from '../services/gpuService';
import { LatestDriverUpdate } from '../types';
import { ExternalLink, RefreshCcw, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function LatestDrivers() {
  const [updates, setUpdates] = useState<LatestDriverUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    setLoading(true);
    const data = await getLatestDriverUpdates();
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const brandColors = {
    AMD: 'bg-brand-amd/10 border-brand-amd/30 text-brand-amd',
    NVIDIA: 'bg-brand-nvidia/10 border-brand-nvidia/30 text-brand-nvidia',
    Intel: 'bg-brand-intel/10 border-brand-intel/30 text-brand-intel',
  };

  return (
    <div className="frosted-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase flex items-center gap-2">
          <RefreshCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Stability Feed
        </h2>
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest">
           <span className="text-blue-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Stable</span>
           <span className="text-slate-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Legacy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
          ))
        ) : (
          updates.map((update) => (
            <motion.div
              key={update.brand}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "p-5 rounded-2xl border bg-black/20 relative overflow-hidden transition-all group",
                update.brand === 'AMD' ? "border-brand-amd/10" :
                update.brand === 'NVIDIA' ? "border-brand-nvidia/10" :
                "border-brand-intel/10"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded",
                  update.brand === 'AMD' ? "bg-brand-amd/10 text-brand-amd" :
                  update.brand === 'NVIDIA' ? "bg-brand-nvidia/10 text-brand-nvidia" :
                  "bg-brand-intel/10 text-brand-intel"
                )}>
                  {update.brand}
                </span>
                <span className="text-[9px] font-mono text-slate-500">{update.releaseDate}</span>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Latest Version</div>
                  <div className="font-mono font-bold text-white text-lg leading-none tracking-tight group-hover:text-blue-400 transition-colors">{update.latestVersion}</div>
                </div>
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/2 rounded-full blur-xl" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
