import { Router, Request, Response } from 'express';
import { TMDBTrendsService } from '../services/tmdbTrendsService';
import { TrendsResponse } from '../types/trends.types';

const router = Router();
const tmdbService = new TMDBTrendsService();

// Get entertainment trends (movies and TV shows)
router.get('/trends/entertainment', async (req: Request, res: Response) => {
  try {
    const { geo = 'US' } = req.query;
    
    console.log(`API Request: Entertainment trends for ${geo}`);
    
    const trends = await tmdbService.getEntertainmentTrends(geo as string);
    
    const response: TrendsResponse = {
      trends,
      cached: false, // Will be set by cache service
      region: geo as string,
      timestamp: new Date(),
      totalCount: trends.length
    };
    
    console.log(`API Response: ${trends.length} entertainment trends returned`);
    res.json(response);
  } catch (error) {
    console.error('Error in /trends/entertainment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch entertainment trends',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get trending movies
router.get('/trends/movies', async (req: Request, res: Response) => {
  try {
    const { timeWindow = 'day' } = req.query;
    
    console.log(`API Request: Trending movies for ${timeWindow}`);
    
    const trends = await tmdbService.getTrendingMovies(timeWindow as 'day' | 'week');
    
    res.json({ 
      trends, 
      timestamp: new Date(),
      timeWindow,
      type: 'movies'
    });
  } catch (error) {
    console.error('Error in /trends/movies:', error);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Get trending TV shows
router.get('/trends/tv', async (req: Request, res: Response) => {
  try {
    const { timeWindow = 'day' } = req.query;
    
    console.log(`API Request: Trending TV shows for ${timeWindow}`);
    
    const trends = await tmdbService.getTrendingTVShows(timeWindow as 'day' | 'week');
    
    res.json({ 
      trends, 
      timestamp: new Date(),
      timeWindow,
      type: 'tv'
    });
  } catch (error) {
    console.error('Error in /trends/tv:', error);
    res.status(500).json({ error: 'Failed to fetch trending TV shows' });
  }
});

// Get all trending content (movies + TV)
router.get('/trends/all', async (req: Request, res: Response) => {
  try {
    const { timeWindow = 'day' } = req.query;
    
    console.log(`API Request: All trending content for ${timeWindow}`);
    
    const trends = await tmdbService.getAllTrendingContent(timeWindow as 'day' | 'week');
    
    res.json({ 
      trends, 
      timestamp: new Date(),
      timeWindow,
      type: 'all'
    });
  } catch (error) {
    console.error('Error in /trends/all:', error);
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
});

// Legacy endpoints for backward compatibility
router.get('/trends/realtime', async (req: Request, res: Response) => {
  try {
    console.log('API Request: Real-time trends (redirecting to TMDB daily trends)');
    const trends = await tmdbService.getAllTrendingContent('day');
    res.json({ trends, timestamp: new Date() });
  } catch (error) {
    console.error('Error in /trends/realtime:', error);
    res.status(500).json({ error: 'Failed to fetch real-time trends' });
  }
});

router.get('/trends/daily', async (req: Request, res: Response) => {
  try {
    console.log('API Request: Daily trends (redirecting to TMDB daily trends)');
    const trends = await tmdbService.getAllTrendingContent('day');
    res.json({ trends, timestamp: new Date() });
  } catch (error) {
    console.error('Error in /trends/daily:', error);
    res.status(500).json({ error: 'Failed to fetch daily trends' });
  }
});

// Health check for trends service
router.get('/trends/health', async (req: Request, res: Response) => {
  try {
    const health = await tmdbService.checkHealth();
    
    if (health.status === 'ok') {
      res.json({
        status: 'ok',
        timestamp: new Date(),
        service: 'TMDB API'
      });
    } else {
      res.status(503).json({
        status: 'error',
        timestamp: new Date(),
        error: 'TMDB service unavailable'
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date(),
      error: 'TMDB service unavailable'
    });
  }
});

export default router; 