import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function main() {
  const config = {
    postgresConnectionOptions: {
      connectionString: POSTGRES_URL,
    },
  };
  const embeddings = new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  });
  const vectorstore = await VercelPostgres.initialize(embeddings, config);

  const query = '마라탕';
  const result = await vectorstore.similaritySearch(query, 5);
  console.log(result);

  await vectorstore.end();
}

main();
