import React from 'react';
import { Search, X, LayoutGrid, ListFilter, SlidersHorizontal } from 'lucide-react';
import { SortOption, ViewMode } from '../types/watchlist';
import { CATEGORIES, STATUSES } from '../data/initialData';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  categoryCounts: Record<string, number>;
  statusCounts: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  categoryCounts,
  statusCounts,
}) => {
  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                isActive
                  ? 'border-indigo-500 text-white bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Status Pills, Sort, and View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {STATUSES.map(st => {
            const isActive = selectedStatus === st;
            const count = statusCounts[st] ?? 0;

            let badgeColor = 'bg-slate-800 text-slate-300 hover:bg-slate-750';
            if (isActive) {
              if (st === 'Completed') badgeColor = 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30';
              else if (st === 'Watching') badgeColor = 'bg-amber-600 text-white shadow-sm shadow-amber-600/30';
              else if (st === 'Upcoming') badgeColor = 'bg-purple-600 text-white shadow-sm shadow-purple-600/30';
              else if (st === 'Plan to Watch') badgeColor = 'bg-blue-600 text-white shadow-sm shadow-blue-600/30';
              else if (st === 'Dropped') badgeColor = 'bg-rose-600 text-white shadow-sm shadow-rose-600/30';
              else badgeColor = 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30';
            }

            return (
              <button
                key={st}
                onClick={() => onSelectStatus(st)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${badgeColor}`}
              >
                <span>{st}</span>
                <span className="opacity-80 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, genre, year..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="dateAdded-desc">Newest Added</option>
              <option value="dateAdded-asc">Oldest Added</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="releaseDate-desc">Release: Latest</option>
              <option value="releaseDate-asc">Release: Earliest</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <ListFilter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
