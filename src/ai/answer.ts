import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { kv } from '@vercel/kv';

import { model } from './constants';
import {
  extractFoodNameFromQuestion,
  extractGeneralFoodNameFromQuestion,
} from './extract';
import { searchNutritionFacts } from './nutrition-facts/search';
import { searchReferences } from './references/search';

export const answerQuestion = async (question: string) => {
  // 들어온 쿼리에서 검색어를 추출해 영양소 정보를 json으로 가져오게 하자

  const [foodName, generalFoodName] = await Promise.all([
    extractFoodNameFromQuestion(question),
    extractGeneralFoodNameFromQuestion(question),
  ]);
  console.log({ foodName, generalFoodName });

  const nutritionFacts = await searchNutritionFacts(foodName, 5);
  const minifiedNutritionFacts = nutritionFacts.map(({ id: _id, ...v }) => v);
  const references = await searchReferences(question, 3);
  const minifiedReferences = (references as any[]).map((v) => [
    v.text.replaceAll('\n', ' '),
    v.metadata,
  ]);

  console.log({
    nutritionFacts: JSON.stringify(minifiedNutritionFacts),
    minifiedReferences,
  });

  // 프롬프트 템플릿 정의
  // const feedbackGood = createRandom(1, 200);
  // const feedbackBad = createRandom(1, 200);

  const promptTemplate = new PromptTemplate({
    template: `
    질문: {question}
    ===
    영양소 정보: {nutritionFacts}
    영양소 정보를 참고하는 경우, [출처: 전국통합식품영양성분정보(음식)표준데이터 (2024-08-06)](https://www.data.go.kr/data/15100070/standard.do)를 명시하고, 검색결과 중 들어온 질문과 일치하면서도 가장 극단적인 값들을 써주세요. (충분히 있다면, 하나 이상 참고해주시면 좋습니다)
    ===
    레퍼런스:
    {references}
    가능하면 최대한 많은 레퍼런스를 출처와 함께 활용해주세요.

    위의 분석을 바탕으로 질문에 대한 구조화된 JSON 응답을 제공해주세요. 음식이 아닌 건 절대 안돼요로 하고 아니라고 해주세요.

    응답 형식:
    badge: 추천도. 0~3의 number. 추천(0), 양호(1), 주의(2), 위험(3) 중 하나. 너무 보수적이거나 민감하게 반응하지 않기 위해 긍정적으로 추천해주세요. 추천을 하더라도, 상세 설명에서 고려해야 할 점들을 함께 써주세요. 술, 담배, 마약, 날고기는 무조건 위험이야. 케이크는 양호, 라면류는 주의, 마라탕도 주의야.
    content: 상세 설명. 추천도에 대한 근거. Markdown으로 강조. 최대한 많은 문장에 출처를 추가해주셔야 합니다. 출처 이름(소스 그대로)과 링크도 꼭 다세요. 출처는 JSON 안에 다세요.
    적절한 값이 있을 경우 영양성분정보도 사용해야 하며, 출처를 꼭 달아야 합니다.
    solution: 대안이나 주의사항, \`~하기\`, \`~보기\` 등과 같은 형태로 끝나는 짧은 여러 개의 추천. \`string[]\`.
    feedback.comment: \`임신 15주차 엄마의 (?)%가 (일반적인 의견)이라고 생각했어요.\` 형태로 작성하기. nested key

    JSON은 무조건 영어로 써줘.
    `,
    inputVariables: ['question', 'nutritionFacts', 'references'],
  });

  const prompt = await promptTemplate.format({
    question,
    nutritionFacts: JSON.stringify(nutritionFacts),
    references: JSON.stringify(minifiedReferences),
    // feedbackGood,
    // feedbackBad,
  });
  const parser = new JsonOutputParser();

  const promptResult = await model.invoke(prompt);
  // @ts-ignore
  const content = promptResult.toJSON().kwargs.content;
  console.log(content);
  const response = await parser.invoke(content);

  console.log([JSON.stringify(response, null, 2)]);

  const result = {
    ...response,
    feedback: { ...response.feedback },
    food_name: foodName,
    persona: 'Pregnancy 15 weeks',
    products: [],
  };
  return result;
};

export const answerQuestionCached = async (question: string) => {
  const cacheKey = `answer:${question.replace(/ /g, '_')}`;
  let result = await kv.get(cacheKey);
  if (!result) {
    result = await answerQuestion(question);
    await kv.set(cacheKey, result);
  }
  return result;
};
