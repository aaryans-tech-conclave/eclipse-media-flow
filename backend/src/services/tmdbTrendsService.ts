import axios from 'axios';
import { TrendingItem } from '../types/trends.types';
import cache from '../utils/cache';
import dotenv from 'dotenv';
dotenv.config();

interface TMDBMovieResult {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  backdrop_path: string | null;
  poster_path: string | null;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

interface TMDBTVResult {
  id: number;
  name: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids: number[];
  backdrop_path: string | null;
  poster_path: string | null;
  adult: boolean;
  original_language: string;
  original_name: string;
  origin_country: string[];
}

interface TMDBTrendingResponse {
  page: number;
  results: (TMDBMovieResult | TMDBTVResult)[];
  total_pages: number;
  total_results: number;
}

export class TMDBTrendsService {
  private readonly API_BASE_URL = 'https://api.themoviedb.org/3';
  private readonly API_READ_ACCESS_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;
  private readonly API_KEY = process.env.TMDB_API_KEY;

  constructor() {
    if (!this.API_READ_ACCESS_TOKEN && !this.API_KEY) {
      throw new Error('TMDB API credentials not found. Please set TMDB_API_READ_ACCESS_TOKEN or TMDB_API_KEY in environment variables.');
    }
  }

  private getHeaders() {
    if (this.API_READ_ACCESS_TOKEN) {
      return {
        'Authorization': `Bearer ${this.API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private getApiKey() {
    return this.API_KEY ? `?api_key=${this.API_KEY}` : '';
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    const cacheKey = `tmdb_trending_movies_${timeWindow}`;
    const cached = cache.get<TrendingItem[]>(cacheKey);
    
    if (cached) {
      console.log('Returning cached trending movies');
      return cached;
    }

    try {
      console.log(`Fetching trending movies for ${timeWindow}`);
      
      const url = `${this.API_BASE_URL}/trending/movie/${timeWindow}${this.getApiKey()}`;
      const response = await axios.get<TMDBTrendingResponse>(url, {
        headers: this.getHeaders(),
      });

      const trendingItems = response.data.results.map((movie, index) => 
        this.convertMovieToTrendingItem(movie as TMDBMovieResult, index)
      );
      
      // Cache for 1 hour for daily, 12 hours for weekly
      const cacheTime = timeWindow === 'day' ? 3600 : 43200;
      cache.set(cacheKey, trendingItems, cacheTime);
      
      console.log(`Found ${trendingItems.length} trending movies`);
      return trendingItems;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw new Error('Failed to fetch trending movies from TMDB');
    }
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    const cacheKey = `tmdb_trending_tv_${timeWindow}`;
    const cached = cache.get<TrendingItem[]>(cacheKey);
    
    if (cached) {
      console.log('Returning cached trending TV shows');
      return cached;
    }

    try {
      console.log(`Fetching trending TV shows for ${timeWindow}`);
      
      const url = `${this.API_BASE_URL}/trending/tv/${timeWindow}${this.getApiKey()}`;
      const response = await axios.get<TMDBTrendingResponse>(url, {
        headers: this.getHeaders(),
      });

      const trendingItems = response.data.results.map((show, index) => 
        this.convertTVShowToTrendingItem(show as TMDBTVResult, index)
      );
      
      // Cache for 1 hour for daily, 12 hours for weekly
      const cacheTime = timeWindow === 'day' ? 3600 : 43200;
      cache.set(cacheKey, trendingItems, cacheTime);
      
      console.log(`Found ${trendingItems.length} trending TV shows`);
      return trendingItems;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw new Error('Failed to fetch trending TV shows from TMDB');
    }
  }

  async getAllTrendingContent(timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    const cacheKey = `tmdb_trending_all_${timeWindow}`;
    const cached = cache.get<TrendingItem[]>(cacheKey);
    
    if (cached) {
      console.log('Returning cached all trending content');
      return cached;
    }

    try {
      console.log(`Fetching all trending content for ${timeWindow}`);
      
      const url = `${this.API_BASE_URL}/trending/all/${timeWindow}${this.getApiKey()}`;
      const response = await axios.get<TMDBTrendingResponse>(url, {
        headers: this.getHeaders(),
      });

      const trendingItems = response.data.results.map((item, index) => {
        if ('title' in item) {
          return this.convertMovieToTrendingItem(item as TMDBMovieResult, index);
        } else {
          return this.convertTVShowToTrendingItem(item as TMDBTVResult, index);
        }
      });
      
      // Cache for 1 hour for daily, 12 hours for weekly
      const cacheTime = timeWindow === 'day' ? 3600 : 43200;
      cache.set(cacheKey, trendingItems, cacheTime);
      
      console.log(`Found ${trendingItems.length} trending items`);
      return trendingItems;
    } catch (error) {
      console.error('Error fetching all trending content:', error);
      throw new Error('Failed to fetch trending content from TMDB');
    }
  }

  async getEntertainmentTrends(region: string = 'US'): Promise<TrendingItem[]> {
    const cacheKey = `tmdb_entertainment_${region}`;
    const cached = cache.get<TrendingItem[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      console.log(`Fetching entertainment trends for region ${region}`);
      
      // Get both movies and TV shows trending data
      const [moviesResult, tvResult] = await Promise.allSettled([
        this.getTrendingMovies('day'),
        this.getTrendingTVShows('day')
      ]);

      let allTrends: TrendingItem[] = [];

      if (moviesResult.status === 'fulfilled') {
        allTrends.push(...moviesResult.value);
      }

      if (tvResult.status === 'fulfilled') {
        allTrends.push(...tvResult.value);
      }

      // Separate movies and TV shows, get top 15 of each
      const movies = allTrends
        .filter(item => item.type === 'movie')
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 15);
      
      const tvShows = allTrends
        .filter(item => item.type === 'show')
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 15);
      
      const sortedTrends = [...movies, ...tvShows];
      
      cache.set(cacheKey, sortedTrends, 1800); // Cache for 30 minutes
      
      console.log(`Found ${sortedTrends.length} entertainment trends`);
      return sortedTrends;
    } catch (error) {
      console.error('Error fetching entertainment trends:', error);
      throw new Error('Failed to fetch entertainment trends');
    }
  }

  private convertMovieToTrendingItem(movie: TMDBMovieResult, index: number): TrendingItem {
    return {
      id: `tmdb_movie_${movie.id}`,
      title: movie.title,
      type: 'movie',
      trendingScore: Math.min(Math.round(movie.popularity), 100), // Cap at 100
      searchVolume: movie.vote_count,
      timeframe: 'Today',
      category: 'Movies',
      relatedQueries: [],
      timestamp: new Date(),
      region: 'Global', // TMDB is global
      overview: movie.overview,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      genreIds: movie.genre_ids,
    };
  }

  private convertTVShowToTrendingItem(show: TMDBTVResult, index: number): TrendingItem {
    return {
      id: `tmdb_tv_${show.id}`,
      title: show.name,
      type: 'show',
      trendingScore: Math.min(Math.round(show.popularity), 100), // Cap at 100
      searchVolume: show.vote_count,
      timeframe: 'Today',
      category: 'TV Shows',
      relatedQueries: [],
      timestamp: new Date(),
      region: 'Global', // TMDB is global
      overview: show.overview,
      releaseDate: show.first_air_date,
      voteAverage: show.vote_average,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
      genreIds: show.genre_ids,
    };
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      const url = `${this.API_BASE_URL}/configuration${this.getApiKey()}`;
      await axios.get(url, {
        headers: this.getHeaders(),
        timeout: 5000,
      });
      return { status: 'ok' };
    } catch (error) {
      console.error('TMDB health check failed:', error);
      return { status: 'error' };
    }
  }
}
