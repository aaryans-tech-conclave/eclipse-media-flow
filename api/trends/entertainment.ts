import { NextApiRequest, NextApiResponse } from 'next';
import { TMDBTrendsService } from '../services/tmdbTrendsService';
import { TrendsResponse } from '../types/trends.types';

const tmdbService = new TMDBTrendsService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { geo = 'US' } = req.query;
    
    console.log(`API Request: Entertainment trends for ${geo}`);
    
    const trends = await tmdbService.getEntertainmentTrends(geo as string);
    
    const response: TrendsResponse = {
      trends,
      cached: false,
      region: geo as string,
      timestamp: new Date(),
      totalCount: trends.length
    };
    
    console.log(`API Response: ${trends.length} entertainment trends returned`);
    res.json(response);
  } catch (error) {
    console.error('Error in /api/trends/entertainment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch entertainment trends',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 