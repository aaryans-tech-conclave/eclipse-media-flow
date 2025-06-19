export interface TrendingItem {
  id: string;
  title: string;
  type: 'movie' | 'show' | 'general';
  trendingScore: number;
  searchVolume?: number;
  timeframe: string;
  category: string;
  relatedQueries?: string[];
  timestamp: Date;
  region: string;
}

export interface TrendsResponse {
  trends: TrendingItem[];
  cached: boolean;
  region: string;
  timestamp: Date;
  totalCount: number;
} 