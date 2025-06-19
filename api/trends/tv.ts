import { NextApiRequest, NextApiResponse } from 'next';
import { TMDBTrendsService } from '../services/tmdbTrendsService';

const tmdbService = new TMDBTrendsService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    console.error('Error in /api/trends/tv:', error);
    res.status(500).json({ error: 'Failed to fetch trending TV shows' });
  }
} 