import { OpenAIEmbeddings } from '@langchain/openai';

export const POSTGRES_URL = process.env.POSTGRES_URL || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export const vectorstoreConfig = {
  postgresConnectionOptions: {
    connectionString: POSTGRES_URL,
  },
};
export const embeddings = new OpenAIEmbeddings({
  apiKey: OPENAI_API_KEY,
  model: 'text-embedding-3-small',
});
