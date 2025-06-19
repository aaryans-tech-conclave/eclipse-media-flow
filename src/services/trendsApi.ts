import { TMDBService } from './tmdbService';

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

export interface InterestOverTimeData {
  keyword: string;
  data: Array<{
    time: string;
    value: number;
    formattedTime: string;
  }>;
}

export class TrendsAPI {
  static async getEntertainmentTrends(geo: string = 'US'): Promise<TrendsResponse> {
    try {
      const trends = await TMDBService.getEntertainmentTrends();
      
      return {
        trends,
        cached: false,
        region: geo,
        timestamp: new Date(),
        totalCount: trends.length
      };
    } catch (error) {
      console.error('Error fetching entertainment trends:', error);
      throw error;
    }
  }

  static async getDailyTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    const trends = await TMDBService.getTrendingMovies('day');
    return { trends };
  }

  static async getRealTimeTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    const trends = await TMDBService.getTrendingMovies('day');
    return { trends };
  }

  static async getInterestOverTime(keyword: string, geo: string = 'US'): Promise<InterestOverTimeData> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/interest/${encodeURIComponent(keyword)}?geo=${geo}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching interest over time:', error);
      throw error;
    }
  }

  static async getRelatedQueries(keywords: string[], geo: string = 'US'): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/related`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords, geo })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching related queries:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<{ status: string; timestamp: Date }> {
    const health = await TMDBService.checkHealth();
    return {
      ...health,
      timestamp: new Date()
    };
  }
} 