import { OpenAIEmbeddings } from '@langchain/openai';
import fs from 'fs/promises';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import { pick } from './utils';

// OpenAI
const OPENAI_API_KEY =
  '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';

type DataRecord = {
  식품코드: string;
  식품명: string;
  데이터구분코드: string;
  데이터구분명: string;
  식품기원코드: string;
  식품기원명: string;
  식품대분류코드: string;
  식품대분류명: string;
  대표식품코드: string;
  대표식품명: string;
  식품중분류코드: string;
  식품중분류명: string;
  식품소분류코드: string;
  식품소분류명: string;
  식품세분류코드: string;
  식품세분류명: string;
  영양성분함량기준량: string;
  '에너지(kcal)': string;
  '수분(g)': string;
  '단백질(g)': string;
  '지방(g)': string;
  '회분(g)': string;
  '탄수화물(g)': string;
  '당류(g)': string;
  '식이섬유(g)': string;
  '칼슘(mg)': string;
  '철(mg)': string;
  '인(mg)': string;
  '칼륨(mg)': string;
  '나트륨(mg)': string;
  '비타민 A(μg RAE)': string;
  '레티놀(μg)': string;
  '베타카로틴(μg)': string;
  '티아민(mg)': string;
  '리보플라빈(mg)': string;
  '니아신(mg)': string;
  '비타민 C(mg)': string;
  '비타민 D(μg)': string;
  '콜레스테롤(mg)': string;
  '포화지방산(g)': string;
  '트랜스지방산(g)': string;
  출처코드: string;
  출처명: string;
  식품중량: string;
  업체명: string;
  데이터생성방법코드: string;
  데이터생성방법명: string;
  데이터생성일자: string;
  데이터기준일자: string;
  제공기관코드: string;
  제공기관명: string;
};

type StoredVectorData = {
  memoryVectors: any[];
  texts: string[];
  metadatas: object[];
};

const textKeys = [
  '식품명',
  '데이터구분명',
  '식품기원명',
  '식품대분류명',
  '대표식품명',
  '식품중분류명',
  '식품소분류명',
  '식품세분류명',
  '업체명',
  '제공기관명',
];

const encodeRecords = (records: DataRecord[]) => {
  const texts = records.map((v) => JSON.stringify(pick(v, textKeys)));
  const metadataKeys = Object.keys(records[0]).filter(
    (n) => !textKeys.includes(n) || n !== '식품코드',
  );
  const metadatas = records.map((v) => ({
    id: v.식품코드,
    ...pick(v, metadataKeys),
  }));
  return { texts, metadatas };
};

export async function createVectorStore(
  records: DataRecord[],
): Promise<MemoryVectorStore> {
  const embeddings = new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  });
  const { texts, metadatas } = encodeRecords(records);
  return await MemoryVectorStore.fromTexts(texts, metadatas, embeddings);
}

export async function saveVectorStore(
  vectorStore: MemoryVectorStore,
  texts: string[],
  metadatas: object[],
  filename: string,
): Promise<void> {
  const data: StoredVectorData = {
    memoryVectors: vectorStore.memoryVectors,
    texts,
    metadatas,
  };
  await fs.writeFile(filename, JSON.stringify(data), 'utf8');
}

export async function loadVectorStore(
  filename: string,
): Promise<MemoryVectorStore | null> {
  try {
    const data = await fs.readFile(filename, 'utf8');
    const storedData: StoredVectorData = JSON.parse(data);
    const embeddings = new OpenAIEmbeddings({
      apiKey: OPENAI_API_KEY,
      model: 'text-embedding-3-small',
    });
    const vectorStore = await MemoryVectorStore.fromTexts(
      storedData.texts,
      storedData.metadatas,
      embeddings,
    );
    vectorStore.memoryVectors = storedData.memoryVectors;
    return vectorStore;
  } catch (error) {
    console.log(`Error loading vector store from ${filename}: ${error}`);
    return null;
  }
}

export async function loadOrCreateVectorStore(
  name: string,
  records: DataRecord[],
): Promise<MemoryVectorStore> {
  const filename = `vectorstores/${name}.json`;

  const loadedStore = await loadVectorStore(filename);
  if (loadedStore) {
    console.log(`Loaded vector store from ${filename}`);
    return loadedStore;
  }

  console.log(`Creating new vector store for ${filename}`);
  const vectorStore = await createVectorStore(records);
  const { texts, metadatas } = encodeRecords(records);
  await saveVectorStore(vectorStore, texts, metadatas, filename);
  return vectorStore;
}
