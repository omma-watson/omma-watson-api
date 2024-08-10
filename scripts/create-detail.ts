import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

import { model } from '@/ai';
import { searchNutritionFacts } from '@/nutrition-facts/search';
import { createRandom } from '@/utils';

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

const main = async () => {
  // 들어온 쿼리에서 검색어를 추출해 영양소 정보를 json으로 가져오게 하자
  const question = '기름에 볶아진 라면을 먹어도 되나요?';
  const foodName = await extractFoodNameFromQuestion(question);
  const nutritionFacts = await searchNutritionFacts(foodName, 5);

  // 프롬프트 템플릿 정의
  // const feedbackGood = createRandom(1, 200);
  // const feedbackBad = createRandom(1, 200);

  const promptTemplate = new PromptTemplate({
    template: `다음 분석을 바탕으로 구조화된 JSON 응답을 제공해주세요. 음식이 아닌 건 절대 안돼요로 하고 아니라고 해주세요.

      질문: {question}
      영양소 정보: {nutritionFacts}
      영양소 정보를 참고하는 경우, [출처: 전국통합식품영양성분정보(음식)표준데이터 (2024-08-06)]를 명시하고, 검색결과 중 들어온 질문과 일치하면서도 가장 극단적인 값들을 써주세요. (충분히 있다면, 하나 이상 참고해주시면 좋습니다)
      나트륨과 트랜스지방에 민감하게 반응해주세요.

      응답 형식:
      badge: 추천도. '추천', '양호', '주의', '위험' 중 하나.
      content: 상세 설명. Markdown으로 강조. 데이터를 인용하는 경우 출처를 꼭 명시해주세요 (소스에서 그대로).
      solution: 대안이나 주의사항, \`~하기\`, \`~보기\` 등과 같은 형태로 끝나는 짧은 여러 개의 추천. \`string[]\` 타입.
      feedback.comment: \`임신 15주차 엄마의 (?)%가 (일반적인 의견)이라고 생각했어요.\` 형태로 작성하기. nested key
      `,
    inputVariables: ['question', 'nutritionFacts'],
  });

  const prompt = await promptTemplate.format({
    question,
    nutritionFacts: JSON.stringify(nutritionFacts),
    // feedbackGood,
    // feedbackBad,
  });
  const parser = new JsonOutputParser();

  const promptResult = await model.invoke(prompt);
  // @ts-ignore
  const content = promptResult.toJSON().kwargs.content;
  const response = await parser.invoke(content);

  console.log(JSON.stringify(response, null, 2));

  const result = {
    ...response,
    feedback: {
      ...response.feedback,
    },
    food_name: foodName,
    persona: '임신 15주차',
  };
  console.log(result);
};

main();
