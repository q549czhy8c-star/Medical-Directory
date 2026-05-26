import React, { useEffect, useState } from 'react';
import { Sparkles, FileSpreadsheet, FileText, ArrowRight, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (tab: 'cleaner' | 'filter') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    cleanedLines: 0,
    filesProcessed: 0,
    queriesRun: 0,
    savedRows: 0,
  });

  useEffect(() => {
    // Load statistics from localStorage
    const loadStats = () => {
      const stored = localStorage.getItem('aerosuite_stats');
      if (stored) {
        try {
          setStats(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stats", e);
        }
      }
    };
    
    loadStats();
    
    // Add window listener to reload stats if updated on other tabs
    window.addEventListener('storage', loadStats);
    return () => window.removeEventListener('storage', loadStats);
  }, []);

  const resetStats = () => {
    const defaultStats = { cleanedLines: 0, filesProcessed: 0, queriesRun: 0, savedRows: 0 };
    localStorage.setItem('aerosuite_stats', JSON.stringify(defaultStats));
    setStats(defaultStats);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold uppercase tracking-wider animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Digital Workflows
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent glow-text-purple">AeroSuite</span>
          </h1>
          
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Your premium browser-based workstation designed for office productivity, complex CSV/Excel data query filtering, and real-time text purification. Zero server roundtrips. 100% private.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('cleaner')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold flex items-center gap-2 shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Purify Text
            </button>
            <button
              onClick={() => onNavigate('filter')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-2 border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-brand-cyan" />
              Filter Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature 1 Card: Text Cleaner */}
        <div 
          onClick={() => onNavigate('cleaner')}
          className="group cursor-pointer rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between h-64 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition duration-300">
            <FileText className="w-32 h-32 text-brand-purple" />
          </div>
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-brand-purple transition duration-200">
                Text Cleaner & Replacer
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Scan rows of email transcripts, support logs, or code, replacing exact 'Reply' tags with custom separators. Restores structured clean spacing in milliseconds.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-brand-purple text-sm font-semibold mt-4">
            Open Cleaner
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>

        {/* Feature 2 Card: Excel Filter */}
        <div 
          onClick={() => onNavigate('filter')}
          className="group cursor-pointer rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between h-64 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition duration-300">
            <FileSpreadsheet className="w-32 h-32 text-brand-cyan" />
          </div>
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-brand-cyan transition duration-200">
                Smart Excel/CSV Data Filter
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Parse xlsx, xls, and csv files entirely client-side. Build dynamic multiple factor AND/OR search clauses, review structures, and download compiled subsets instantly.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-brand-cyan text-sm font-semibold mt-4">
            Open Data Filter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>
      </div>

      {/* Analytics Statistics Panel */}
      <div className="rounded-2xl glass-panel p-6 border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white">AeroSuite Engine Metrics</h3>
              <p className="text-xs text-slate-400">Activity tracked during this session</p>
            </div>
          </div>
          
          {(stats.cleanedLines > 0 || stats.filesProcessed > 0 || stats.queriesRun > 0) && (
            <button
              onClick={resetStats}
              className="text-xs text-slate-500 hover:text-brand-pink flex items-center gap-1.5 transition duration-200 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Stats
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Lines Cleared</span>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
              {stats.cleanedLines.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Datasets Loaded</span>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              {stats.filesProcessed.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Filters Applied</span>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {stats.queriesRun.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Rows Extracted</span>
            <span className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {stats.savedRows.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
