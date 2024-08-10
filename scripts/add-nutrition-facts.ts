import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as dotenv from 'dotenv';

import {
  DATA_RECORD_TEXT_KEYS,
  DataRecord,
  DataRecordKey,
} from '../src/nutrition-facts';
import { pick } from '../src/utils';

dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// load data from ./전국통합식품영양성분정보_음식_표준데이터.json
const data = require('../전국통합식품영양성분정보_음식_표준데이터.json');
console.log(data.records);

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

  const metadataKeys = Object.keys(data.records[0]).filter(
    (n) =>
      !DATA_RECORD_TEXT_KEYS.includes(n as DataRecordKey) || n !== '식품코드',
  ) as DataRecordKey[];
  const ids = await vectorstore.addDocuments(
    data.records.map((v: DataRecord) => {
      const pageContent = JSON.stringify(pick(v, DATA_RECORD_TEXT_KEYS));
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
}

main();
