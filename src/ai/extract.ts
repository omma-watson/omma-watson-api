import { PromptTemplate } from '@langchain/core/prompts';

import { model } from '@/ai/constants';

export const extractFoodNameFromQuestion = async (
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

export const extractGeneralFoodNameFromQuestion = async (
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
