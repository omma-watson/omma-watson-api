import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import * as dotenv from 'dotenv';

import { embeddings, vectorstoreConfig } from '@/ai';

dotenv.config();

export async function main() {
  const vectorstore = await VercelPostgres.initialize(
    embeddings,
    vectorstoreConfig,
  );

  const query = '마라탕';
  const searchResult = await vectorstore.similaritySearchWithScore(query, 3);
  const result = searchResult.map(([document, score]) => {
    return {
      id: document.metadata.id,
      data: document.metadata,
      score,
    };
  });
  console.log(result);

  await vectorstore.end();
}

main();
