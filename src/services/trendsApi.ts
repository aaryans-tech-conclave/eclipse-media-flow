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

export interface InterestOverTimeData {
  keyword: string;
  data: Array<{
    time: string;
    value: number;
    formattedTime: string;
  }>;
}

export class TrendsAPI {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  static async getEntertainmentTrends(geo: string = 'US'): Promise<TrendsResponse> {
    try {
      console.log(`Fetching entertainment trends for ${geo} from ${this.API_BASE_URL}`);
      
      const response = await fetch(`${this.API_BASE_URL}/trends/entertainment?geo=${geo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data: TrendsResponse = await response.json();
      
      // Convert timestamp strings back to Date objects
      data.timestamp = new Date(data.timestamp);
      data.trends = data.trends.map(trend => ({
        ...trend,
        timestamp: new Date(trend.timestamp)
      }));
      
      console.log(`Successfully fetched ${data.trends.length} trending items`);
      return data;
    } catch (error) {
      console.error('Error fetching entertainment trends:', error);
      throw error;
    }
  }

  static async getDailyTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/daily?geo=${geo}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching daily trends:', error);
      throw error;
    }
  }

  static async getRealTimeTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/realtime?geo=${geo}&category=e`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching real-time trends:', error);
      throw error;
    }
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

  static async checkHealth(): Promise<{ status: string; timestamp: Date; trendsCount?: number }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/health`);
      const data = await response.json();
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return { 
        status: 'error', 
        timestamp: new Date() 
      };
    }
  }
} 