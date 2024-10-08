import { NextApiRequest, NextApiResponse } from 'next';

import { searchNutritionFacts } from '@/ai/nutrition-facts/search';
import { withCORS } from '@/cors';

const DEFAULT_K = 5;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const foodName = req.query.food_name as string;
  const resultCount = (() => {
    let value: number;
    try {
      value = parseInt(req.query.result_count as string, 10);
    } catch {
      value = DEFAULT_K;
    }
    if (isNaN(value)) {
      value = DEFAULT_K;
    }
    return value;
  })();
  if (typeof foodName !== 'string') {
    res.status(400).json({ error: 'Invalid Query Type (foodName)' });
    return;
  }

  const result = await searchNutritionFacts(foodName, resultCount);

  // Cache the result for 3 days
  res.setHeader('Cache-Control', 's-maxage=259200, stale-while-revalidate');
  res.status(200).json(result);
};

export default withCORS(handler);
