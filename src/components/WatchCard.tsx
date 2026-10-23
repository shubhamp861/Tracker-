import React, { useState } from 'react';
import { Star, Calendar, Edit2, Trash2, Film } from 'lucide-react';
import { WatchlistItem, WatchStatus } from '../types/watchlist';

interface WatchCardProps {
  item: WatchlistItem;
  onEdit: (item: WatchlistItem) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: WatchStatus) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({
  item,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [imageError, setImageError] = useState(false);

  // Category Accent
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'anime':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'bollywood':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'hollywood':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'series':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formattedRelease = item.releaseDate
    ? new Date(item.releaseDate).getFullYear() || item.releaseDate
    : null;

  return (
    <div className="group relative bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5">
      {/* Clean Cover Media Section (Badges removed from image) */}
      <div className="relative aspect-[16/10] sm:aspect-[3/4] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {item.coverUrl && !imageError ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-slate-400">
              <Film className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-400 font-medium px-2 line-clamp-2">
              {item.title}
            </span>
          </div>
        )}

        {/* Quick Edit/Delete on Hover only */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/60 shadow-md backdrop-blur-md transition"
            title="Edit Title"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/60 shadow-md backdrop-blur-md transition"
            title="Delete Title"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Below Part: Badges, Details, and Controls */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Top Row: Category and Rating moved below image */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(item.category)}`}>
              {item.category}
            </span>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{typeof item.rating === 'number' && item.rating > 0 ? item.rating : '—'}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition" title={item.title}>
            {item.title}
          </h3>

          {/* Genre & Release Date */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span className="truncate">{item.genre || 'General'}</span>
            {formattedRelease && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formattedRelease}
              </span>
            )}
          </div>
        </div>

        {/* Quick Status Selector */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Status</span>

          <select
            value={item.status}
            onChange={e => onUpdateStatus(item.id, e.target.value as WatchStatus)}
            className="text-xs bg-slate-950 border border-slate-800 hover:border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Watching">Watching</option>
            <option value="Plan to Watch">Plan to Watch</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>
      </div>
    </div>
  );
};
