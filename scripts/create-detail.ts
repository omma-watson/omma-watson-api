import { answerQuestionCached } from '@/ai/answer';

const main = async () => {
  {
    const result = await answerQuestionCached('투썸케이크 먹어도 되나요?');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('마라탕');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('딸기몽쉘');
    console.log([result]);
  }
  {
    const result = await answerQuestionCached('몽쉘');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('라면');
    console.log([result]);
  }
  {
    const result = await answerQuestionCached('짜파게티');
    console.log([result]);
  }
  {
    const result = await answerQuestionCached('Ramen');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('Whiskey');
    console.log([result]);
  }
};

main();
