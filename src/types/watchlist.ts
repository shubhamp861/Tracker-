export type MediaCategory = 'Anime' | 'Bollywood' | 'Hollywood' | 'Series';

export type WatchStatus = 'Upcoming' | 'Watching' | 'Completed' | 'Plan to Watch' | 'Dropped';

export interface WatchlistItem {
  id: string;
  title: string;
  category: MediaCategory | string;
  status: WatchStatus | string;
  genre?: string;
  rating?: number;
  coverUrl?: string;
  createdAt?: string;
  releaseDate?: string;
  notes?: string;
}

export type SortOption = 'dateAdded-desc' | 'dateAdded-asc' | 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc' | 'releaseDate-desc' | 'releaseDate-asc';

export type ViewMode = 'grid' | 'table';
