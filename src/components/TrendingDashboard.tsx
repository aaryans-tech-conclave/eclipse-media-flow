import React, { useState, useEffect } from 'react';
import { TrendingUp, X, Clock, BarChart3, Activity, Wifi, WifiOff } from 'lucide-react';

interface TrendingItem {
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

interface TrendsResponse {
  trends: TrendingItem[];
  cached: boolean;
  region: string;
  timestamp: Date;
  totalCount: number;
}

// API Service
class TrendsAPI {
  private static readonly API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api' // Adjust for your production URL
    : 'http://localhost:5000/api';

  static async getEntertainmentTrends(geo: string = 'US'): Promise<TrendsResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/entertainment?geo=${geo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TrendsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching entertainment trends:', error);
      throw error;
    }
  }

  static async getDailyTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    const response = await fetch(`${this.API_BASE_URL}/trends/daily?geo=${geo}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  static async getRealTimeTrends(geo: string = 'US'): Promise<{ trends: TrendingItem[] }> {
    const response = await fetch(`${this.API_BASE_URL}/trends/realtime?geo=${geo}&category=e`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  static async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/trends/health`);
      return response.json();
    } catch {
      return { status: 'error' };
    }
  }
}

const TrendingDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'movie' | 'show'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [region, setRegion] = useState('US');

  const loadTrendingData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    
    try {
      // Check if backend is healthy
      const healthCheck = await TrendsAPI.checkHealth();
      if (healthCheck.status !== 'ok') {
        throw new Error('Backend service is unavailable');
      }

      console.log('Fetching entertainment trends from Google Trends API...');
      const response = await TrendsAPI.getEntertainmentTrends(region);
      
      // Process the response
      const processedTrends = response.trends.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));

      setTrendingItems(processedTrends);
      setLastUpdated(new Date(response.timestamp));
      setIsOnline(true);
      
      console.log(`Loaded ${processedTrends.length} trending items from Google Trends`);
      
    } catch (error) {
      console.error('Failed to load trending data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load trending data');
      setIsOnline(false);
      
      // Fallback to sample data for demonstration
      setTrendingItems([
        {
          id: 'fallback_1',
          title: 'Service Unavailable - Sample Data',
          type: 'general' as const,
          trendingScore: 95,
          timeframe: 'Fallback',
          category: 'Error',
          timestamp: new Date(),
          region: region
        }
      ]);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && trendingItems.length === 0) {
      loadTrendingData();
    }
  }, [isOpen, region]);

  // Auto-refresh every 30 minutes when dashboard is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      loadTrendingData(false); // Refresh without loading indicator
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isOpen, region]);

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredItems = selectedFilter === 'all' 
    ? trendingItems 
    : trendingItems.filter(item => item.type === selectedFilter);

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={toggleDashboard}
          className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
              : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white border border-white/20'
          }`}
          title="Google Trends for Movies & TV Shows"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">
            Live Trends
          </span>
          {!isOnline && <WifiOff className="w-3 h-3 text-red-400" />}
        </button>
      </div>

      {/* Trending Dashboard Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-xl font-bold text-white">Google Trends - Live Entertainment</h2>
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Real-time trending movies & TV shows
                  {lastUpdated && (
                    <span className="ml-2">
                      • Updated {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Region Selector */}
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value="US">🇺🇸 United States</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="IN">🇮🇳 India</option>
                </select>
                
                <button
                  onClick={() => loadTrendingData()}
                  disabled={isLoading}
                  className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                  title="Refresh trends data"
                >
                  <Activity className={`w-4 h-4 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={toggleDashboard}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
                <p className="text-red-300 text-xs mt-1">
                  Make sure the backend server is running on localhost:5000
                </p>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6">
              {[
                { key: 'all', label: `All (${trendingItems.length})` },
                { key: 'movie', label: `Movies (${trendingItems.filter(i => i.type === 'movie').length})` },
                { key: 'show', label: `TV Shows (${trendingItems.filter(i => i.type === 'show').length})` }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Trending Items List */}
            <div className="overflow-y-auto max-h-[50vh] space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <span className="ml-3 text-gray-400">Loading live trends from Google...</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No trending entertainment content found</p>
                  <button 
                    onClick={() => loadTrendingData()} 
                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Try refreshing
                  </button>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left side - Content info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            #{index + 1}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'movie' 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : item.type === 'show'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {item.type === 'movie' ? 'Movie' : item.type === 'show' ? 'TV Show' : 'Entertainment'}
                          </span>
                          <span className="text-xs text-gray-400">{item.category}</span>
                        </div>
                        
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                        
                        {/* Related Queries */}
                        {item.relatedQueries && item.relatedQueries.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.relatedQueries.slice(0, 3).map((query, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-md border border-purple-500/20"
                              >
                                {query}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(item.timestamp)}</span>
                          </div>
                          <span>•</span>
                          <span>{item.timeframe}</span>
                          <span>•</span>
                          <span>{item.region}</span>
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className="text-right space-y-2 ml-4 min-w-[120px]">
                        {item.voteAverage && (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white font-semibold">{item.voteAverage.toFixed(1)}/10</span>
                          </div>
                        )}
                        {item.searchVolume && (
                          <div className="flex items-center justify-end space-x-2 text-sm text-gray-400">
                            <span className="text-green-400">👥</span>
                            <span>{formatNumber(item.searchVolume)} votes</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {item.releaseDate && `Released: ${new Date(item.releaseDate).getFullYear()}`}
                        </div>
                      </div>
                    </div>

                    {/* TMDB Overview */}
                    {item.overview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {item.overview}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>📊 Live data from Google Trends API</span>
                  <span>🎬 Movies & TV Shows only</span>
                  {!isOnline && <span className="text-red-400">⚠️ Offline mode</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <span>Auto-refresh: 30min</span>
                  {lastUpdated && (
                    <span>• Last update: {formatTimeAgo(lastUpdated)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingDashboard;
