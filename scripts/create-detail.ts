import { answerQuestionCached } from '@/ai/answer';

const main = async () => {
  {
    const result = await answerQuestionCached('투썸케이크 먹어도 되나요?');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('라면 먹어도 되나요?');
    console.log([result]);
  }

  {
    const result = await answerQuestionCached('육회 먹어도 되나요?');
    console.log([result]);
  }
};

main();
