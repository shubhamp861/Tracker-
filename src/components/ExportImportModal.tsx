import React, { useState } from 'react';
import { X, Download, Upload, Check, AlertCircle, FileJson } from 'lucide-react';
import { WatchlistItem } from '../types/watchlist';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItem[];
  onImportItems: (newItems: WatchlistItem[], mode: 'merge' | 'replace') => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  items,
  onImportItems,
}) => {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  if (!isOpen) return null;

  const downloadJSON = (data: any[], filename: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCategory = (category: string) => {
    const filtered = items.filter(
      i => i.category?.toLowerCase() === category.toLowerCase()
    );
    downloadJSON(filtered, `${category.toLowerCase()}_watchlist.json`);
  };

  const handleExportAll = () => {
    downloadJSON(items, 'all_watchlist.json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'merge' | 'replace') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          throw new Error('JSON file must be an array of media objects.');
        }

        const validItems: WatchlistItem[] = parsed.map((item, index) => ({
          id: item.id || `imported_${Date.now()}_${index}`,
          title: item.title || 'Untitled',
          category: item.category || 'Anime',
          status: item.status || 'Plan to Watch',
          genre: item.genre || 'General',
          rating: typeof item.rating === 'number' ? item.rating : 0,
          coverUrl: item.coverUrl || '',
          createdAt: item.createdAt || new Date().toISOString(),
          releaseDate: item.releaseDate || '',
          notes: item.notes || '',
        }));

        onImportItems(validItems, mode);
        setImportStatus({
          type: 'success',
          message: `Successfully ${mode === 'replace' ? 'replaced with' : 'merged'} ${validItems.length} items!`,
        });
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Failed to parse JSON file.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Export & Import Watchlists</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Message */}
          {importStatus.type && (
            <div
              className={`p-3.5 rounded-lg border flex items-center gap-2.5 text-xs font-medium ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Watchlist Files</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Download your updated JSON files matching the repository structure:
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['Anime', 'Bollywood', 'Hollywood', 'Series'].map(cat => {
                const count = items.filter(
                  i => i.category?.toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleExportCategory(cat)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition text-center group"
                  >
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400">
                      {cat}
                    </span>
                    <span className="text-[11px] text-slate-400">({count} titles)</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleExportAll}
              className="mt-3 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Backup (all_watchlist.json)</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Watchlist JSON</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Select any watchlist JSON file to import into the app:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-800/40 hover:border-indigo-500 cursor-pointer transition">
                <span className="text-xs font-semibold text-indigo-400 mb-1">
                  Merge With Current
                </span>
                <span className="text-[11px] text-slate-400 text-center">
                  Appends new titles without removing current ones
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={e => handleFileUpload(e, 'merge')}
                  className="hidden"
                />
              </label>

              <label className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-800/40 hover:border-rose-500 cursor-pointer transition">
                <span className="text-xs font-semibold text-rose-400 mb-1">
                  Replace All Data
                </span>
                <span className="text-[11px] text-slate-400 text-center">
                  Overwrites the catalog with imported file
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={e => handleFileUpload(e, 'replace')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
