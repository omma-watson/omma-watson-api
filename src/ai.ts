import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();

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
export const model = new ChatOpenAI({
  apiKey: OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  maxRetries: 3,
});
// export const modelWithTools = model.bind({
//   tools: [nutritionSearchTool],
// });
