import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';

import { embeddings, vectorstoreConfig } from '@/ai/constants';
import {
  NUTRITION_VS_TEXT_KEYS,
  NutritionFactsDataRecord,
  NutritionFactsDataRecordKey,
} from '@/ai/nutrition-facts';
import { pick } from '@/utils';

// load data from ./전국통합식품영양성분정보_음식_표준데이터.json
const data = require('../전국통합식품영양성분정보_음식_표준데이터.json');
console.log(data.records);

export async function main() {
  const vectorstore = await VercelPostgres.initialize(
    embeddings,
    vectorstoreConfig,
  );

  const metadataKeys = Object.keys(data.records[0]).filter(
    (n) =>
      !NUTRITION_VS_TEXT_KEYS.includes(n as NutritionFactsDataRecordKey) ||
      n !== '식품코드',
  ) as NutritionFactsDataRecordKey[];
  const ids = await vectorstore.addDocuments(
    data.records.map((v: NutritionFactsDataRecord) => {
      const pageContent = JSON.stringify(pick(v, NUTRITION_VS_TEXT_KEYS));
      const metadata = { id: v.식품코드, ...pick(v, metadataKeys) };
      return {
        pageContent,
        metadata,
        id: v.식품코드,
      };
    }),
  );
  console.log(ids);
  console.log('✅ Constructed vector store');

  const query = '사과 아이스티';
  const result = await vectorstore.similaritySearch(query, 5);
  console.log(result);

  await vectorstore.end();
}

main();
