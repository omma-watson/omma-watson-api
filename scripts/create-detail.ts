import { kv } from '@vercel/kv';
import { configDotenv } from 'dotenv';

import { answerQuestion, answerQuestionCached } from '@/ai/answer';

configDotenv();

const main = async () => {
  // {
  //   const result = await answerQuestionCached('투썸케이크 먹어도 되나요?');
  //   console.log([result]);
  // }

  // {
  //   const result = await answerQuestionCached('마라탕');
  //   console.log([result]);
  // }

  // {
  //   const result = await answerQuestionCached('딸기몽쉘');
  //   console.log([result]);
  // }
  // {
  //   const result = await answerQuestionCached('몽쉘');
  //   console.log([result]);
  // }

  // {
  //   const result = await answerQuestionCached('라면');
  //   console.log([result]);
  // }
  // {
  //   const result = await answerQuestionCached('짜파게티');
  //   console.log([result]);
  // }
  // {
  //   const result = await answerQuestionCached('Ramen');
  //   console.log([result]);
  // }

  // {
  //   const result = await answerQuestionCached('Whiskey');
  //   console.log([result]);
  // }

  {
    const result = await answerQuestionCached('Tofu');
    console.log([result]);
  }

  const result = [
    'brown rice',
    'tofu',
    'Tofu',
    'brocoli',
    '두부',
    '현미',
    '현미밥',
  ];
  // kv로 위의 question 쿼리해서
  // badge 를 0으로 바꾸자
  for (const question of result) {
    const cacheKey = `answer:${question.replace(/ /g, '_')}`;
    // let result = await kv.get(cacheKey);
    // if (!result) {
    const result = await answerQuestion(question);
    await kv.set(cacheKey, { ...(result as any), badge: 0 });
    // }
    // return result;
  }
};

main();
