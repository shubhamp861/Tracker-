import React, { useState, useEffect, useMemo } from 'react';
import { WatchlistItem, SortOption, ViewMode, WatchStatus } from './types/watchlist';
import { allInitialItems } from './data/initialData';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { WatchCard } from './components/WatchCard';
import { WatchTable } from './components/WatchTable';
import { ItemModal } from './components/ItemModal';
import { ExportImportModal } from './components/ExportImportModal';
import { Film, Plus, Sparkles, FilterX } from 'lucide-react';

const STORAGE_KEY = 'watchlist_media_data_v1';

export const App: React.FC = () => {
  const [items, setItems] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
    return allInitialItems;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<WatchlistItem | null>(null);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: items.length,
      Anime: 0,
      Bollywood: 0,
      Hollywood: 0,
      Series: 0,
    };
    items.forEach(item => {
      const cat = item.category;
      if (cat && counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, [items]);

  // Status counts (based on currently selected category)
  const statusCounts = useMemo(() => {
    const categoryFiltered =
      selectedCategory === 'All'
        ? items
        : items.filter(
            i => i.category?.toLowerCase() === selectedCategory.toLowerCase()
          );

    const counts: Record<string, number> = {
      All: categoryFiltered.length,
      Upcoming: 0,
      Watching: 0,
      'Plan to Watch': 0,
      Completed: 0,
      Dropped: 0,
    };

    categoryFiltered.forEach(item => {
      const st = item.status;
      if (st && counts[st] !== undefined) {
        counts[st]++;
      }
    });
    return counts;
  }, [items, selectedCategory]);

  // Filtered and Sorted items
  const displayItems = useMemo(() => {
    let result = [...items];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(
        i => i.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter(
        i => i.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        i =>
          i.title?.toLowerCase().includes(q) ||
          i.genre?.toLowerCase().includes(q) ||
          i.releaseDate?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.status?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'releaseDate-desc':
          return (b.releaseDate || '').localeCompare(a.releaseDate || '');
        case 'releaseDate-asc':
          return (a.releaseDate || '').localeCompare(b.releaseDate || '');
        case 'dateAdded-asc':
          return (a.createdAt || '').localeCompare(b.createdAt || '');
        case 'dateAdded-desc':
        default:
          return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });

    return result;
  }, [items, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Actions
  const handleAddNew = () => {
    setItemToEdit(null);
    setIsItemModalOpen(true);
  };

  const handleEdit = (item: WatchlistItem) => {
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;
    if (window.confirm(`Are you sure you want to remove "${itemToDelete.title}" from your watchlist?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: WatchStatus) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleSaveItem = (itemData: Partial<WatchlistItem>) => {
    if (itemData.id) {
      // Edit
      setItems(prev =>
        prev.map(item => (item.id === itemData.id ? ({ ...item, ...itemData } as WatchlistItem) : item))
      );
    } else {
      // Add
      const newItem: WatchlistItem = {
        id: `user_item_${Date.now()}`,
        title: itemData.title || 'Untitled',
        category: itemData.category || 'Anime',
        status: itemData.status || 'Plan to Watch',
        genre: itemData.genre || 'General',
        rating: itemData.rating ?? 10,
        coverUrl: itemData.coverUrl || '',
        createdAt: new Date().toISOString(),
        releaseDate: itemData.releaseDate || '',
        notes: itemData.notes || '',
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset watchlist to original repository files (Anime, Bollywood, Hollywood, Series)? Custom additions will be replaced.'
      )
    ) {
      setItems(allInitialItems);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleImportItems = (newItems: WatchlistItem[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setItems(newItems);
    } else {
      // Merge unique by title & category
      setItems(prev => {
        const existingKeys = new Set(prev.map(i => `${i.title.toLowerCase()}_${i.category.toLowerCase()}`));
        const toAdd = newItems.filter(i => !existingKeys.has(`${i.title.toLowerCase()}_${i.category.toLowerCase()}`));
        return [...toAdd, ...prev];
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        items={items}
        onAddNew={handleAddNew}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters, Tabs & Search */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categoryCounts={categoryCounts}
          statusCounts={statusCounts}
        />

        {/* Content View */}
        {displayItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayItems.map(item => (
                <WatchCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <WatchTable
              items={displayItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
            />
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No Titles Found</h3>
            <p className="text-xs text-slate-400 mb-6">
              {searchQuery || selectedStatus !== 'All'
                ? 'Try adjusting your search query, category, or status filters.'
                : `There are currently no items in the ${selectedCategory} category.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(searchQuery || selectedStatus !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('All');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 border border-slate-700 transition"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Title</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>WatchList Media Catalog &bull; Anime, Bollywood, Hollywood &amp; Series</span>
          <div className="flex items-center gap-4">
            <span>{items.length} titles in database</span>
            <button
              onClick={() => setIsExportImportOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              Export JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Item Modal (Add / Edit) */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        defaultCategory={selectedCategory}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        items={items}
        onImportItems={handleImportItems}
      />
    </div>
  );
};

export default App;
