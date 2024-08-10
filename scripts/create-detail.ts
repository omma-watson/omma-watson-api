import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

import { model } from '@/ai';
import { searchNutritionFacts } from '@/nutrition-facts/search';
import { searchReferences } from '@/references/search';

const extractFoodNameFromQuestion = async (
  question: string,
): Promise<string> => {
  const template = new PromptTemplate({
    template: `
      우리는 한국어 키워드로 사용자의 질문에 포함된 음식의 영양소 정보를 검색해야 합니다.
      검색 키워드는 일반 음식(예: \`마라탕\`)과 브랜드 특정 메뉴(예: \`투썸플레이스케이크\`) 모두 가능합니다.
      다음 질문에서 영양소 정보를 가져오기 위한 입력값을 추출해 반환해주세요.

      질문: {query}
      결과: 단일 string. 어떠한 설명도 붙이지 말기.
    `,
    inputVariables: ['query'],
  });
  const res = await model.invoke(await template.format({ query: question }));
  // @ts-ignore
  return res.toJSON().kwargs.content;
};

const extractGeneralFoodNameFromQuestion = async (
  question: string,
): Promise<string> => {
  const template = new PromptTemplate({
    template: `
      우리는 한국어 키워드로 사용자의 질문에 포함된 음식에 대한 산부 섭취 가능 여부를 검색해야 합니다.
      \`라면\` 등 최대한 general 한 검색어를 도출해 주세요.
      다음 질문에서 영양소 정보를 가져오기 위한 입력값을 추출해 반환해주세요.

      질문: {query}
      결과: 단일 string. 어떠한 설명도 붙이지 말기.
    `,
    inputVariables: ['query'],
  });
  const res = await model.invoke(await template.format({ query: question }));
  // @ts-ignore
  return res.toJSON().kwargs.content;
};

const main = async () => {
  // 들어온 쿼리에서 검색어를 추출해 영양소 정보를 json으로 가져오게 하자
  const question = '투썸케이크 먹어도 되나요?';
  const [foodName, generalFoodName] = await Promise.all([
    extractFoodNameFromQuestion(question),
    extractGeneralFoodNameFromQuestion(question),
  ]);
  console.log({ foodName, generalFoodName });

  const nutritionFacts = await searchNutritionFacts(foodName, 5);
  const references = await searchReferences(question, 5);
  const minifiedReferences = (references as any[]).map((v) => [
    v.text.replaceAll('\n', ' '),
    v.metadata,
  ]);

  console.log({ nutritionFacts, minifiedReferences });

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
      badge: 추천도. '추천', '양호', '주의', '위험' 중 하나. 너무 보수적이거나 민감하게 반응하지 않기 위해 최대한 긍정적으로 추천해주세요. 추천을 하더라도, 상세 설명에서 고려해야 할 점들을 함께 써주세요.
      content: 상세 설명. 추천도에 대한 근거. Markdown으로 강조. 최대한 많은 문장에 출처를 추가해주셔야 합니다. 출처 이름과 링크를 꼭 명시해주세요 (이름은 소스에서 그대로, 가능하면 링크 달기).
      적절한 값이 있을 경우 영양성분정보도 사용해야 하며, 출처를 꼭 달아야 합니다.
      solution: 대안이나 주의사항, \`~하기\`, \`~보기\` 등과 같은 형태로 끝나는 짧은 여러 개의 추천. \`string[]\` 타입.
      feedback.comment: \`임신 15주차 엄마의 (?)%가 (일반적인 의견)이라고 생각했어요.\` 형태로 작성하기. nested key
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

  console.log(JSON.stringify(response, null, 2));

  const result = {
    ...response,
    feedback: { ...response.feedback },
    food_name: foodName,
    persona: '임신 15주차',
  };
  console.log(result);
};

main();
