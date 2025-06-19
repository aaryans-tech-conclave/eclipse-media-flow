import { NextApiRequest, NextApiResponse } from 'next';
import { TMDBTrendsService } from '../services/tmdbTrendsService';

const tmdbService = new TMDBTrendsService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 