import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Plus, X } from 'lucide-react';
import { searchGPUMetal } from '../services/gpuService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SearchBoxProps {
  onSelect: (modelName: string) => void;
  selectedCount: number;
}

export function SearchBox({ onSelect, selectedCount }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        const data = await searchGPUMetal(query);
        setResults(data);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xl" ref={containerRef}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter model name (e.g. RTX 4080)..."
          className="w-full glass-input rounded-2xl py-4 pl-12 pr-4 text-slate-200"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full mt-3 w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/5"
          >
            {results.map((result) => (
              <button
                key={result}
                onClick={() => {
                  onSelect(result);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left group"
              >
                <span className="font-medium text-slate-300 group-hover:text-white">{result}</span>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
