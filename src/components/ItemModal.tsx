import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Link as LinkIcon, Film } from 'lucide-react';
import { WatchlistItem, MediaCategory, WatchStatus } from '../types/watchlist';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<WatchlistItem>) => void;
  itemToEdit?: WatchlistItem | null;
  defaultCategory?: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  defaultCategory = 'Anime',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MediaCategory>('Anime');
  const [status, setStatus] = useState<WatchStatus>('Plan to Watch');
  const [genre, setGenre] = useState('General');
  const [rating, setRating] = useState<number>(10);
  const [releaseDate, setReleaseDate] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title || '');
      setCategory((itemToEdit.category as MediaCategory) || 'Anime');
      setStatus((itemToEdit.status as WatchStatus) || 'Plan to Watch');
      setGenre(itemToEdit.genre || 'General');
      setRating(typeof itemToEdit.rating === 'number' ? itemToEdit.rating : 0);
      setReleaseDate(itemToEdit.releaseDate || '');
      setCoverUrl(itemToEdit.coverUrl || '');
      setNotes(itemToEdit.notes || '');
    } else {
      setTitle('');
      setCategory(
        defaultCategory && defaultCategory !== 'All'
          ? (defaultCategory as MediaCategory)
          : 'Anime'
      );
      setStatus('Plan to Watch');
      setGenre('General');
      setRating(10);
      setReleaseDate('');
      setCoverUrl('');
      setNotes('');
    }
  }, [itemToEdit, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: itemToEdit?.id,
      title: title.trim(),
      category,
      status,
      genre: genre.trim() || 'General',
      rating: Number(rating) || 0,
      releaseDate: releaseDate || undefined,
      coverUrl: coverUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: itemToEdit?.createdAt || new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              {itemToEdit ? 'Edit Watchlist Item' : 'Add New Title'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solo Leveling, Inception, Panchayat..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MediaCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Anime">Anime</option>
                <option value="Bollywood">Bollywood</option>
                <option value="Hollywood">Hollywood</option>
                <option value="Series">Series</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as WatchStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Watching">Watching</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>

          {/* Rating & Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Rating
                </label>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {rating} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Genre
            </label>
            <input
              type="text"
              placeholder="e.g. Action, Sci-Fi, Shonen, Drama, General..."
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cover Image Input & Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Cover Art / Poster
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2 py-0.5 rounded transition ${
                    imageTab === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> URL
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2 py-0.5 rounded transition ${
                    imageTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Upload className="w-3 h-3" /> File
                  </span>
                </button>
              </div>
            </div>

            {imageTab === 'url' ? (
              <input
                type="url"
                placeholder="https://... image link"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-3 text-center bg-slate-950/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
            )}

            {/* Live Preview */}
            {coverUrl && (
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-lg border border-slate-800">
                <img
                  src={coverUrl}
                  alt="Poster preview"
                  className="w-12 h-16 object-cover rounded bg-slate-900 border border-slate-700 flex-shrink-0"
                  onError={() => {}}
                />
                <div className="text-xs text-slate-400 flex-1 truncate">
                  <span className="font-semibold text-slate-200">Image Loaded</span>
                  <div className="truncate">{coverUrl.slice(0, 50)}...</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Personal Notes / Thoughts
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Loved season 2 episode 5, recommended by friend..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 transition"
            >
              {itemToEdit ? 'Save Changes' : 'Add to Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
