import { tool } from '@langchain/core/tools';
import * as dotenv from 'dotenv';
import { z } from 'zod';

import { searchNutritionFacts } from './search';

dotenv.config();

const nutritionSearchSchema = z.object({
  query: z.string().describe('영양소 정보를 검색할 한국어 키워드'),
  limit: z.number().int().positive().default(3).describe('반환할 결과의 수'),
});

// 사용 안함 (캐싱 위해서)
const nutritionSearchTool = tool(
  async ({ query, limit }) => {
    try {
      const result = await searchNutritionFacts(query, limit);
      return JSON.stringify(result);
    } catch (error) {
      return `영양소 정보 검색 중 오류 발생: ${(error as Error).message}`;
    }
  },
  {
    name: 'searchNutritionInfo',
    description:
      '한국어 키워드로 음식, 브랜드, 메뉴의 영양소 정보를 검색합니다. 일반 음식(예: `마라탕`)과 브랜드 특정 메뉴(예: `투썸플레이스케이크`)의 검색이 모두 가능합니다.',
    schema: nutritionSearchSchema,
  },
);

export { nutritionSearchTool };
