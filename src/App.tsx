import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { LatestDrivers } from './components/LatestDrivers';
import { SearchBox } from './components/SearchBox';
import { GPUCard } from './components/GPUCard';
import { getGPUDetails } from './services/gpuService';
import { GPUDetail, GPUBrand } from './types';
import { AnimatePresence } from 'motion/react';
import { LayoutGrid, ArrowRightLeft, Plus } from 'lucide-react';

export default function App() {
  const [comparingGPUs, setComparingGPUs] = useState<GPUDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVendor, setActiveVendor] = useState<GPUBrand | 'All'>('All');

  const handleSelectGPU = async (modelName: string) => {
    if (comparingGPUs.length >= 4) return;
    
    // Preliminary check with search query
    if (comparingGPUs.some(g => g.modelName.toLowerCase() === modelName.toLowerCase())) return;

    setLoading(true);
    try {
      const detail = await getGPUDetails(modelName);
      if (detail) {
        setComparingGPUs(prev => {
          // Final check with the actual resolved model name
          if (prev.some(g => g.modelName === detail.modelName)) {
            return prev;
          }
          return [...prev, detail];
        });
      }
    } catch (error) {
      console.error("Error fetching GPU details:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeGPU = (modelName: string) => {
    setComparingGPUs(prev => prev.filter(g => g.modelName !== modelName));
  };

  return (
    <div className="flex h-screen tech-grid relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Sidebar 
        onVendorSelect={setActiveVendor} 
        activeVendor={activeVendor} 
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative flex flex-col gap-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-light text-white tracking-tight">
              Hardware <span className="font-bold">Evolution</span>
            </h2>
            <p className="text-slate-500 text-sm">Comparing architecture and driver stability side-by-side.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setComparingGPUs([])}
              disabled={comparingGPUs.length === 0}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30"
            >
              Clear Comparison
            </button>
            <button className="px-5 py-2.5 bg-blue-600 border border-blue-400/50 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors">
              Export Analysis
            </button>
          </div>
        </header>

        <section className="max-w-xl">
          <SearchBox onSelect={handleSelectGPU} selectedCount={comparingGPUs.length} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            <LayoutGrid className="w-4 h-4" />
            Comparison Matrix
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-[450px]">
            <AnimatePresence mode="popLayout">
              {comparingGPUs.map((gpu) => (
                <GPUCard 
                  key={gpu.modelName} 
                  gpu={gpu} 
                  onRemove={() => removeGPU(gpu.modelName)} 
                />
              ))}
            </AnimatePresence>
            
            {comparingGPUs.length < 4 && !loading && (
              <div className="bg-white/2 border-2 border-dashed border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[450px] transition-colors hover:bg-white/4">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  <Plus className="w-8 h-8 text-slate-600" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-400">Add Component</div>
                  <div className="text-[11px] text-slate-600 max-w-[160px] leading-relaxed">Search to compare specifications and driver stability</div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-8 min-h-[450px] animate-pulse">
                <ArrowRightLeft className="w-10 h-10 text-blue-500/30 animate-spin mb-4" />
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Compiling Specs...</div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <LatestDrivers />
        </section>
      </main>
    </div>
  );
}

