import { WatchlistItem } from '../types/watchlist';
import animeRaw from '../../anime_watchlist.json';
import bollywoodRaw from '../../bollywood_watchlist.json';
import hollywoodRaw from '../../hollywood_watchlist.json';
import seriesRaw from '../../series_watchlist.json';

// Normalize items ensuring all have IDs and default values
function normalizeList(list: any[], defaultCategory: string): WatchlistItem[] {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => ({
    id: item.id || `item_${defaultCategory.toLowerCase()}_${index}_${Date.now()}`,
    title: item.title || 'Untitled',
    category: item.category || defaultCategory,
    status: item.status || 'Plan to Watch',
    genre: item.genre || 'General',
    rating: typeof item.rating === 'number' ? item.rating : 0,
    coverUrl: item.coverUrl || '',
    createdAt: item.createdAt || new Date().toISOString(),
    releaseDate: item.releaseDate || '',
    notes: item.notes || '',
  }));
}

export const initialAnimeList: WatchlistItem[] = normalizeList(animeRaw, 'Anime');
export const initialBollywoodList: WatchlistItem[] = normalizeList(bollywoodRaw, 'Bollywood');
export const initialHollywoodList: WatchlistItem[] = normalizeList(hollywoodRaw, 'Hollywood');
export const initialSeriesList: WatchlistItem[] = normalizeList(seriesRaw, 'Series');

export const allInitialItems: WatchlistItem[] = [
  ...initialAnimeList,
  ...initialBollywoodList,
  ...initialHollywoodList,
  ...initialSeriesList,
];

export const CATEGORIES = ['All', 'Anime', 'Bollywood', 'Hollywood', 'Series'] as const;
export const STATUSES = ['All', 'Upcoming', 'Watching', 'Plan to Watch', 'Completed', 'Dropped'] as const;
