import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { OpenAIEmbeddings } from '@langchain/openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { withCORS } from '../../../cors';
import { DataRecord } from '../../../nutrition-facts';
import { pick } from '../../../utils';

const POSTGRES_URL = process.env.POSTGRES_URL || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const DEFAULT_K = 3;

const stripEmpty = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== ''),
  );
};

const NUTRITION_KEYS = [
  '인(mg)',
  '철(mg)',
  '당류(g)',
  '수분(g)',
  '지방(g)',
  '회분(g)',
  '칼륨(mg)',
  '칼슘(mg)',
  '단백질(g)',
  '나트륨(mg)',
  '니아신(mg)',
  '티아민(mg)',
  '레티놀(μg)',
  '비타민 C(mg)',
  '식이섬유(g)',
  '에너지(kcal)',
  '탄수화물(g)',
  '포화지방산(g)',
  '리보플라빈(mg)',
  '콜레스테롤(mg)',
  '베타카로틴(μg)',
  '비타민 A(μg RAE)',
  '트랜스지방산(g)',
  // '식품중량',
  // '영양성분함량기준량'
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const foodName = req.query.food_name as string;
  const resultCount = (() => {
    let value: number;
    try {
      value = parseInt(req.query.result_count as string, 10);
    } catch {
      value = DEFAULT_K;
    }
    if (isNaN(value)) {
      value = DEFAULT_K;
    }
    return value;
  })();
  if (typeof foodName !== 'string') {
    res.status(400).json({ error: 'Invalid Query Type (foodName)' });
    return;
  }

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

  const searchResult = await vectorstore.similaritySearchWithScore(
    foodName,
    resultCount,
  );
  const result = searchResult.map(([document, score]) => {
    const metadata = document.metadata as DataRecord;
    const nutrition = pick(stripEmpty(metadata), NUTRITION_KEYS);

    // nutrition 의 각각의 value 를 (metadata.영양성분함량기준량 -> ex> '100g'), (metadata.식품중량 -> ex> '750g') 으로 나누어서 계산.
    const standardWeight = parseFloat(metadata.영양성분함량기준량);
    const foodTotalWeight = parseFloat(metadata.식품중량);

    let totalNutrition: Record<(typeof NUTRITION_KEYS)[number], string> = {};
    if (
      standardWeight &&
      !isNaN(standardWeight) &&
      foodTotalWeight &&
      !isNaN(foodTotalWeight)
    ) {
      totalNutrition = NUTRITION_KEYS.reduce(
        (acc, key) => {
          const value = parseFloat(nutrition[key]);
          if (value) {
            acc[key] = ((value * foodTotalWeight) / standardWeight).toString();
          }
          return acc;
        },
        {} as Record<(typeof NUTRITION_KEYS)[number], string>,
      );
    }

    return {
      id: document.metadata.id,
      metadata: pick(metadata, ['식품명', '업체명', '대표식품명']),
      nutrition,
      totalNutrition,
      totalStandards: {
        영양성분함량기준량: standardWeight.toString(),
        식품중량: foodTotalWeight.toString(),
      },
      score: 1 - score,
    };
  });
  console.log(result);

  // Cache the result for 3 days
  res.setHeader('Cache-Control', 's-maxage=259200, stale-while-revalidate');
  res.status(200).json(result);
};

export default withCORS(handler);
