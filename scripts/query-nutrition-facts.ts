import { searchNutritionFacts } from '@/ai/nutrition-facts/search';

export async function main() {
  const query = '투썸플레이스케이크';
  const result = await searchNutritionFacts(query, 3);
  console.log(result);
}

main();
