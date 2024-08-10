import * as dotenv from 'dotenv';

import { loadOrCreateVectorStore } from '../src/vectorstore';

dotenv.config();

// load data from ./전국통합식품영양성분정보_음식_표준데이터.json
const data = require('../전국통합식품영양성분정보_음식_표준데이터.json');
console.log(data.records);

export async function main() {
  const vectorStore = await loadOrCreateVectorStore('food', data.records);
  console.log('Vector store loaded');

  const query = '사과 아이스티';
  const result = await vectorStore.similaritySearch(query, 5);
  console.log(result);
}

main();
