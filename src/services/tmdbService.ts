import axios from 'axios';
import { TrendingItem } from './types';

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

export class TMDBService {
  private static readonly API_BASE_URL = 'https://api.themoviedb.org/3';
  private static readonly API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  private static readonly API_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

  private static getHeaders() {
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

  private static getApiKey() {
    return this.API_KEY ? `?api_key=${this.API_KEY}` : '';
  }

  private static convertMovieToTrendingItem(movie: TMDBMovieResult): TrendingItem {
    return {
      id: `movie_${movie.id}`,
      title: movie.title,
      type: 'movie',
      trendingScore: movie.popularity,
      timeframe: 'day',
      category: 'entertainment',
      timestamp: new Date(),
      region: 'US',
      searchVolume: movie.vote_count,
      relatedQueries: [],
      overview: movie.overview,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      genreIds: movie.genre_ids
    };
  }

  private static convertTVShowToTrendingItem(show: TMDBTVResult): TrendingItem {
    return {
      id: `tv_${show.id}`,
      title: show.name,
      type: 'show',
      trendingScore: show.popularity,
      timeframe: 'day',
      category: 'entertainment',
      timestamp: new Date(),
      region: 'US',
      searchVolume: show.vote_count,
      relatedQueries: [],
      overview: show.overview,
      releaseDate: show.first_air_date,
      voteAverage: show.vote_average,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
      genreIds: show.genre_ids
    };
  }

  static async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    try {
      const url = `${this.API_BASE_URL}/trending/movie/${timeWindow}${this.getApiKey()}`;
      const response = await axios.get<TMDBTrendingResponse>(url, {
        headers: this.getHeaders(),
      });

      return response.data.results.map(movie => 
        this.convertMovieToTrendingItem(movie as TMDBMovieResult)
      );
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw new Error('Failed to fetch trending movies from TMDB');
    }
  }

  static async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    try {
      const url = `${this.API_BASE_URL}/trending/tv/${timeWindow}${this.getApiKey()}`;
      const response = await axios.get<TMDBTrendingResponse>(url, {
        headers: this.getHeaders(),
      });

      return response.data.results.map(show => 
        this.convertTVShowToTrendingItem(show as TMDBTVResult)
      );
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw new Error('Failed to fetch trending TV shows from TMDB');
    }
  }

  static async getEntertainmentTrends(): Promise<TrendingItem[]> {
    try {
      const [movies, shows] = await Promise.all([
        this.getTrendingMovies('day'),
        this.getTrendingTVShows('day')
      ]);

      return [...movies, ...shows].sort((a, b) => b.trendingScore - a.trendingScore);
    } catch (error) {
      console.error('Error fetching entertainment trends:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<{ status: string }> {
    try {
      const url = `${this.API_BASE_URL}/trending/movie/day${this.getApiKey()}`;
      await axios.get(url, { headers: this.getHeaders() });
      return { status: 'ok' };
    } catch (error) {
      console.error('TMDB API health check failed:', error);
      return { status: 'error' };
    }
  }
} 