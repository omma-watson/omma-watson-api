import { searchNutritionFacts } from '@/nutrition-facts/search';

export async function main() {
  const query = '마라탕';
  const result = await searchNutritionFacts(query, 3);
  console.log(result);
}

main();
