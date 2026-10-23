import React, { useState } from 'react';
import { Star, Edit2, Trash2, Film, Calendar } from 'lucide-react';
import { WatchlistItem, WatchStatus } from '../types/watchlist';

interface WatchTableProps {
  items: WatchlistItem[];
  onEdit: (item: WatchlistItem) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: WatchStatus) => void;
}

export const WatchTable: React.FC<WatchTableProps> = ({
  items,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Title & Poster</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3">Genre</th>
              <th className="py-3 px-3">Release Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {items.map(item => (
              <TableRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableRow: React.FC<{
  item: WatchlistItem;
  onEdit: (item: WatchlistItem) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: WatchStatus) => void;
}> = ({ item, onEdit, onDelete, onUpdateStatus }) => {
  const [imageError, setImageError] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'watching':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'upcoming':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'plan to watch':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'dropped':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <tr className="hover:bg-slate-800/40 transition">
      {/* Title & Cover */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded bg-slate-950 overflow-hidden flex-shrink-0 border border-slate-800 flex items-center justify-center">
            {item.coverUrl && !imageError ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Film className="w-4 h-4 text-slate-600" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-100 text-sm">{item.title}</div>
            <div className="text-[11px] text-slate-400">Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-2.5 px-3">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {item.category}
        </span>
      </td>

      {/* Status & Quick Change */}
      <td className="py-2.5 px-3">
        <select
          value={item.status}
          onChange={e => onUpdateStatus(item.id, e.target.value as WatchStatus)}
          className={`text-xs rounded-md px-2 py-1 border font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${getStatusBadge(item.status)}`}
        >
          <option value="Upcoming" className="bg-slate-900 text-slate-200">Upcoming</option>
          <option value="Watching" className="bg-slate-900 text-slate-200">Watching</option>
          <option value="Plan to Watch" className="bg-slate-900 text-slate-200">Plan to Watch</option>
          <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
          <option value="Dropped" className="bg-slate-900 text-slate-200">Dropped</option>
        </select>
      </td>

      {/* Rating */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1 text-amber-400 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{typeof item.rating === 'number' && item.rating > 0 ? `${item.rating}/10` : '—'}</span>
        </div>
      </td>

      {/* Genre */}
      <td className="py-2.5 px-3 text-slate-400">
        {item.genre || 'General'}
      </td>

      {/* Release Date */}
      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
        {item.releaseDate ? (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{item.releaseDate}</span>
          </div>
        ) : (
          '—'
        )}
      </td>

      {/* Actions */}
      <td className="py-2.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
