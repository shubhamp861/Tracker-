import React from 'react';
import { Film, Plus, Download, Upload, RotateCcw, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { WatchlistItem } from '../types/watchlist';

interface NavbarProps {
  items: WatchlistItem[];
  onAddNew: () => void;
  onOpenExportImport: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  items,
  onAddNew,
  onOpenExportImport,
  onResetData,
}) => {
  const totalCount = items.length;
  const completedCount = items.filter(i => i.status?.toLowerCase() === 'completed').length;
  const watchingCount = items.filter(i => i.status?.toLowerCase() === 'watching').length;
  const upcomingCount = items.filter(i => i.status?.toLowerCase() === 'upcoming').length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Quick Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">WatchList</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {totalCount} Titles
                  </span>
                </div>
                <p className="text-xs text-slate-400">Personal Media Tracker & Catalog</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onAddNew}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                title="Add Title"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed:</span>
              <span className="font-semibold text-white">{completedCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Watching:</span>
              <span className="font-semibold text-white">{watchingCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Upcoming:</span>
              <span className="font-semibold text-white">{upcomingCount}</span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExportImport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition"
              title="Export or Import Watchlist JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export / Import</span>
            </button>

            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
              title="Reset to original repository watchlist data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg shadow-sm shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Title</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
