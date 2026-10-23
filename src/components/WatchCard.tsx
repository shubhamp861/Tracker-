import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Film, Clock, Flame } from 'lucide-react';
import { WatchlistItem, WatchStatus } from '../types/watchlist';
import { getDaysLeft } from '../utils/dateUtils';

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
  const daysInfo = getDaysLeft(item.releaseDate);
  const isUpcoming = item.status?.toLowerCase() === 'upcoming';

  const formattedRelease = item.releaseDate
    ? new Date(item.releaseDate).getFullYear() || item.releaseDate
    : null;

  return (
    <div className="group relative bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5">
      {/* Cover Media Section */}
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

        {/* Quick Edit/Delete on Hover */}
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

      {/* Details Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition" title={item.title}>
            {item.title}
          </h3>

          {/* Release Date */}
          {item.releaseDate ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{item.releaseDate}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">No release date</div>
          )}

          {/* Days Left Countdown Feature (especially for upcoming series and movies) */}
          {daysInfo && (
            <div className="pt-0.5">
              {daysInfo.isToday ? (
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Releasing Today!</span>
                </div>
              ) : !daysInfo.isPast ? (
                <div
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    isUpcoming
                      ? 'text-purple-300 bg-purple-500/15 border-purple-500/30'
                      : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{daysInfo.text}</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500">
                  {daysInfo.text}
                </div>
              )}
            </div>
          )}
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
