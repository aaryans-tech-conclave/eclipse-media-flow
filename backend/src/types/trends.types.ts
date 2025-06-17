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
  // TMDB-specific fields
  overview?: string;
  releaseDate?: string;
  voteAverage?: number;
  posterPath?: string | null;
  backdropPath?: string | null;
  genreIds?: number[];
}

export interface TrendsResponse {
  trends: TrendingItem[];
  cached: boolean;
  region: string;
  timestamp: Date;
  totalCount: number;
}

export interface GoogleTrendsConfig {
  geo: string;
  category?: string;
  timeframe?: string;
}

export interface InterestOverTimeData {
  keyword: string;
  data: Array<{
    time: string;
    value: number;
    formattedTime: string;
  }>;
}

export interface RelatedQueriesData {
  keyword: string;
  top: Array<{
    query: string;
    value: number;
  }>;
  rising: Array<{
    query: string;
    value: number | string;
  }>;
} 