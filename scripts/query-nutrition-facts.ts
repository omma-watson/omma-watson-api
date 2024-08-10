import * as dotenv from 'dotenv';

import { searchNutritionFacts } from '@/nutrition-facts/search';

dotenv.config();

export async function main() {
  const query = '마라탕';
  const result = await searchNutritionFacts(query, 3);
  console.log(result);
}

main();
