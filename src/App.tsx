import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, FileSpreadsheet, Sparkles, 
  Clock, ShieldCheck, Menu, X, AppWindow, Cpu
} from 'lucide-react';
import { DashboardOverview } from './components/DashboardOverview';
import { TextCleaner } from './components/TextCleaner';
import { DataFilter } from './components/DataFilter';

type TabType = 'dashboard' | 'cleaner' | 'filter';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    cleanedLines: 0,
    filesProcessed: 0,
    queriesRun: 0,
    savedRows: 0,
  });

  // Track clock time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync session statistics
  const syncStats = () => {
    const stored = localStorage.getItem('aerosuite_stats');
    if (stored) {
      try {
        setStats(JSON.parse(stored));
      } catch (e) {}
    } else {
      const defaultStats = { cleanedLines: 0, filesProcessed: 0, queriesRun: 0, savedRows: 0 };
      localStorage.setItem('aerosuite_stats', JSON.stringify(defaultStats));
      setStats(defaultStats);
    }
  };

  useEffect(() => {
    syncStats();
    
    // Set up statistics listener
    window.addEventListener('storage', syncStats);
    return () => window.removeEventListener('storage', syncStats);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    // Force stat sync
    syncStats();
  };

  return (
    <div className="min-h-vh flex flex-col md:flex-row relative">
      
      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 glass-panel md:min-h-screen flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 z-30 transition-all duration-300 ${
        isMobileMenuOpen ? 'h-screen fixed top-0 left-0 bg-slate-950/95' : 'relative h-auto'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center shadow-lg shadow-brand-purple/20">
                <AppWindow className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1">
                  AeroSuite
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping"></span>
                </h1>
                <p className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase">Workspace</p>
              </div>
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`flex-1 p-4 space-y-1.5 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase px-3 block mb-2">Main Menu</span>
            
            {/* Dashboard Link */}
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-brand-purple/15 text-brand-purple border border-brand-purple/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            {/* Text Cleaner Link */}
            <button
              onClick={() => handleTabChange('cleaner')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                activeTab === 'cleaner'
                  ? 'bg-brand-purple/15 text-brand-purple border border-brand-purple/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Text Cleaner
            </button>

            {/* Excel Filter Link */}
            <button
              onClick={() => handleTabChange('filter')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                activeTab === 'filter'
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Data Filter
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className={`p-4 border-t border-white/5 space-y-4 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="rounded-xl bg-slate-900/60 p-3 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">AI Agent Core</span>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="font-semibold text-white">Antigravity v0.1.0</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sandbox Secured</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* Workspace Sticky Header */}
        <header className="sticky top-0 z-20 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-300 text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
            <span>AeroSuite Sandbox Environment</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            {/* Clock time widget */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5">
              <Clock className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            
            {/* Session statistics summary badge */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-semibold">
              <span>{stats.cleanedLines + stats.savedRows} operations</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardOverview onNavigate={handleTabChange} />}
          {activeTab === 'cleaner' && <TextCleaner />}
          {activeTab === 'filter' && <DataFilter />}
        </div>

        {/* Global Footer */}
        <footer className="py-6 px-8 border-t border-white/5 text-center text-xs text-slate-500 mt-auto">
          <p>© 2026 AeroSuite Workspace. Runs entirely client-side. Local Sandbox Environment.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
