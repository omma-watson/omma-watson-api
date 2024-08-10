import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { kv } from '@vercel/kv';

import { embeddings, vectorstoreConfig } from '@/ai/constants';
import { pick, stripEmpty } from '@/utils';

import { NUTRITION_KEYS, NutritionFactsDataRecord } from './types';

export const searchNutritionFacts = async (
  foodName: string,
  resultCount: number,
) => {
  const cacheKey = `food:${foodName}:count:${resultCount}`;
  let result = await kv.get(cacheKey);
  if (!result) {
    const vectorstore = await VercelPostgres.initialize(
      embeddings,
      vectorstoreConfig,
    );

    const searchResult = await vectorstore.similaritySearchWithScore(
      foodName,
      resultCount,
    );
    result = searchResult.map(([document, score]) => {
      const metadata = document.metadata as NutritionFactsDataRecord;
      const nutrition = stripEmpty(pick(stripEmpty(metadata), NUTRITION_KEYS));

      // nutrition 의 각각의 value 를 (metadata.영양성분함량기준량 -> ex> '100g'), (metadata.식품중량 -> ex> '750g') 으로 나누어서 계산.
      const standardWeight = parseFloat(metadata.영양성분함량기준량);
      const foodTotalWeight = parseFloat(metadata.식품중량);

      let totalNutrition: Record<(typeof NUTRITION_KEYS)[number], string> = {};
      if (
        standardWeight &&
        !isNaN(standardWeight) &&
        foodTotalWeight &&
        !isNaN(foodTotalWeight)
      ) {
        totalNutrition = NUTRITION_KEYS.reduce(
          (acc, key) => {
            const value = parseFloat(nutrition[key]);
            if (value) {
              acc[key] = (
                (value * foodTotalWeight) /
                standardWeight
              ).toString();
            }
            return acc;
          },
          {} as Record<(typeof NUTRITION_KEYS)[number], string>,
        );
      }

      return {
        id: document.metadata.id,
        metadata: pick(metadata, ['식품명', '업체명', '대표식품명']),
        nutrition,
        totalNutrition,
        totalStandards: {
          영양성분함량기준량: standardWeight.toString(),
          식품중량: foodTotalWeight.toString(),
        },
        score,
      };
    });
    await vectorstore.end();
    await kv.set(cacheKey, result);
  }

  return result as {
    id: string;
    metadata: Record<string, string>;
    nutrition: Record<string, string>;
    totalNutrition: Record<string, string>;
    totalStandards: {
      영양성분함량기준량: string;
      식품중량: string;
    };
    score: number;
  };
};
