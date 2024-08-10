import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { kv } from '@vercel/kv';

import { embeddings, vectorstoreConfig } from '@/ai/constants';

export const searchReferences = async (
  foodName: string,
  resultCount: number,
) => {
  const cacheKey = `reference:${foodName}:count:${resultCount}`;
  let result = await kv.get(cacheKey);
  if (!result) {
    const vectorstore = await VercelPostgres.initialize(embeddings, {
      ...vectorstoreConfig,
      tableName: 'references_vectors',
    });

    const searchResult = await vectorstore.similaritySearchWithScore(
      foodName,
      resultCount,
    );
    result = searchResult.map(([document, score]) => {
      return {
        id: document.metadata.id,
        metadata: document.metadata,
        text: document.pageContent,
        score,
      };
    });
    await vectorstore.end();
    await kv.set(cacheKey, result);
  }

  return result;
};
