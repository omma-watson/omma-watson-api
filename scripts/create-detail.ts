import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();

// nutrition-facts 로 대체하기
const hardcoded_nutrition_data =
  '[{"id":"D303-148140000-0001","metadata":{"식품명":"라면_라면만","업체명":"해당없음","대표식품명":"라면"},"nutrition":{"인(mg)":"27","철(mg)":"0.27","당류(g)":"0.11","수분(g)":"80.6","지방(g)":"2.18","회분(g)":"1.04","칼륨(mg)":"56","칼슘(mg)":"48","단백질(g)":"1.76","나트륨(mg)":"306","니아신(mg)":"0.346","티아민(mg)":"0.024","레티놀(μg)":"1","비타민 C(mg)":"0.15","식이섬유(g)":"0.8","에너지(kcal)":"84","탄수화물(g)":"14.44","포화지방산(g)":"0.78","리보플라빈(mg)":"0.334","콜레스테롤(mg)":"2.32","베타카로틴(μg)":"67","트랜스지방산(g)":"0.01"},"totalNutrition":{"인(mg)":"27","철(mg)":"0.27","당류(g)":"0.11","수분(g)":"80.6","지방(g)":"2.18","회분(g)":"1.04","칼륨(mg)":"56","칼슘(mg)":"48","단백질(g)":"1.76","나트륨(mg)":"306","니아신(mg)":"0.3459999999999999","티아민(mg)":"0.024","레티놀(μg)":"1","비타민 C(mg)":"0.15","식이섬유(g)":"0.8","에너지(kcal)":"84","탄수화물(g)":"14.44","포화지방산(g)":"0.78","리보플라빈(mg)":"0.33399999999999996","콜레스테롤(mg)":"2.32","베타카로틴(μg)":"67","트랜스지방산(g)":"0.01"},"totalStandards":{"영양성분함량기준량":"100","식품중량":"100"},"score":0.7087370032824867},{"id":"D303-148290000-0001","metadata":{"식품명":"라면_비빔라면","업체명":"해당없음","대표식품명":"라면"},"nutrition":{"인(mg)":"38","철(mg)":"0.33","당류(g)":"1.81","수분(g)":"58.8","지방(g)":"5.67","회분(g)":"1.14","칼륨(mg)":"47","칼슘(mg)":"8","단백질(g)":"3.38","나트륨(mg)":"375","니아신(mg)":"0.248","티아민(mg)":"0.136","레티놀(μg)":"0","비타민 C(mg)":"0","식이섬유(g)":"2.3","에너지(kcal)":"189","탄수화물(g)":"31.01","포화지방산(g)":"2.51","리보플라빈(mg)":"0.024","콜레스테롤(mg)":"0","베타카로틴(μg)":"205","비타민 A(μg RAE)":"17","트랜스지방산(g)":"0.03"},"totalNutrition":{"인(mg)":"38","철(mg)":"0.33","당류(g)":"1.81","수분(g)":"58.8","지방(g)":"5.67","회분(g)":"1.14","칼륨(mg)":"47","칼슘(mg)":"8","단백질(g)":"3.38","나트륨(mg)":"375","니아신(mg)":"0.248","티아민(mg)":"0.136","식이섬유(g)":"2.3","에너지(kcal)":"189","탄수화물(g)":"31.01","포화지방산(g)":"2.51","리보플라빈(mg)":"0.024","베타카로틴(μg)":"205","비타민 A(μg RAE)":"17","트랜스지방산(g)":"0.03"},"totalStandards":{"영양성분함량기준량":"100","식품중량":"100"},"score":0.7101348850171232},{"id":"D303-148392600-0001","metadata":{"식품명":"라면_용기면_볶음라면","업체명":"해당없음","대표식품명":"라면"},"nutrition":{"인(mg)":"39","철(mg)":"0.54","당류(g)":"3.28","수분(g)":"54.8","지방(g)":"5.39","회분(g)":"1.39","칼륨(mg)":"63","칼슘(mg)":"16","단백질(g)":"4.52","나트륨(mg)":"435","레티놀(μg)":"0","비타민 C(mg)":"0","식이섬유(g)":"2.3","에너지(kcal)":"202","탄수화물(g)":"33.9","포화지방산(g)":"2.26","리보플라빈(mg)":"1.17","콜레스테롤(mg)":"0","베타카로틴(μg)":"429","비타민 A(μg RAE)":"36","트랜스지방산(g)":"0.03"},"totalNutrition":{"인(mg)":"39","철(mg)":"0.54","당류(g)":"3.28","수분(g)":"54.8","지방(g)":"5.39","회분(g)":"1.39","칼륨(mg)":"63","칼슘(mg)":"16","단백질(g)":"4.52","나트륨(mg)":"435","식이섬유(g)":"2.3","에너지(kcal)":"202","탄수화물(g)":"33.9","포화지방산(g)":"2.26","리보플라빈(mg)":"1.17","베타카로틴(μg)":"429","비타민 A(μg RAE)":"36","트랜스지방산(g)":"0.03"},"totalStandards":{"영양성분함량기준량":"100","식품중량":"100"},"score":0.7193732596190838},{"id":"D303-148450000-0001","metadata":{"식품명":"라면_짬뽕라면","업체명":"해당없음","대표식품명":"라면"},"nutrition":{"인(mg)":"41","철(mg)":"0","당류(g)":"0.21","수분(g)":"80.1","지방(g)":"3.51","회분(g)":"1.25","칼륨(mg)":"88","칼슘(mg)":"78","단백질(g)":"2.84","나트륨(mg)":"333","니아신(mg)":"0.28","티아민(mg)":"0.177","레티놀(μg)":"0","비타민 C(mg)":"0","식이섬유(g)":"1.1","에너지(kcal)":"92","탄수화물(g)":"12.27","포화지방산(g)":"1.15","리보플라빈(mg)":"0.211","콜레스테롤(mg)":"14.23","베타카로틴(μg)":"203","비타민 A(μg RAE)":"17","트랜스지방산(g)":"0.01"},"totalNutrition":{"인(mg)":"307.5","당류(g)":"1.575","수분(g)":"600.7499999999999","지방(g)":"26.325","회분(g)":"9.375","칼륨(mg)":"660","칼슘(mg)":"585","단백질(g)":"21.3","나트륨(mg)":"2497.5","니아신(mg)":"2.1","티아민(mg)":"1.3275","식이섬유(g)":"8.250000000000002","에너지(kcal)":"690","탄수화물(g)":"92.025","포화지방산(g)":"8.624999999999998","리보플라빈(mg)":"1.5825","콜레스테롤(mg)":"106.725","베타카로틴(μg)":"1522.5","비타민 A(μg RAE)":"127.5","트랜스지방산(g)":"0.075"},"totalStandards":{"영양성분함량기준량":"100","식품중량":"750"},"score":0.7288866800733395},{"id":"D303-148440000-0001","metadata":{"식품명":"라면_짜장라면","업체명":"해당없음","대표식품명":"라면"},"nutrition":{"인(mg)":"41","철(mg)":"0.4","당류(g)":"0.63","수분(g)":"59.9","지방(g)":"4.28","회분(g)":"1.16","칼륨(mg)":"75","칼슘(mg)":"76","단백질(g)":"3.66","나트륨(mg)":"306","니아신(mg)":"0.467","티아민(mg)":"0","레티놀(μg)":"0","비타민 C(mg)":"0","식이섬유(g)":"1.7","에너지(kcal)":"177","탄수화물(g)":"31","포화지방산(g)":"1.69","리보플라빈(mg)":"0.533","콜레스테롤(mg)":"0","베타카로틴(μg)":"13","비타민 A(μg RAE)":"1","트랜스지방산(g)":"0.03"},"totalNutrition":{"인(mg)":"41","철(mg)":"0.4","당류(g)":"0.63","수분(g)":"59.9","지방(g)":"4.28","회분(g)":"1.16","칼륨(mg)":"75","칼슘(mg)":"76","단백질(g)":"3.66","나트륨(mg)":"306","니아신(mg)":"0.467","식이섬유(g)":"1.7","에너지(kcal)":"177","탄수화물(g)":"31","포화지방산(g)":"1.69","리보플라빈(mg)":"0.533","베타카로틴(μg)":"13","비타민 A(μg RAE)":"1","트랜스지방산(g)":"0.03"},"totalStandards":{"영양성분함량기준량":"100","식품중량":"100"},"score":0.7336528022703149}]';

const main = async () => {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    maxRetries: 0,
  });

  // 프롬프트 템플릿 정의
  const promptTemplate = new PromptTemplate({
    template: `다음 분석을 바탕으로 구조화된 JSON 응답을 제공해주세요. 음식이 아닌 건 절대 안돼요로 하고 아니라고 해주세요.

      질문: {question}
      영양소 검색 결과: {analysis}

      응답 형식:
      badge: 추천도. '추천', '양호', '주의', '위험' 중 하나.
      content: 상세 설명. Markdown으로 강조.
      solution: 대안이나 주의사항, \`~하기\`, \`~보기\` 등과 같은 형태로 끝나는 짧은 여러 개의 추천. \`string[]\` 타입.
      feedback.comment: 일반적인 의견, nested key
      `,
    inputVariables: ['question', 'analysis'],
  });

  const prompt = await promptTemplate.format({
    question: '락스로 만든 칵테일을 마셔도 되나요?',
    analysis: hardcoded_nutrition_data,
  });
  const parser = new JsonOutputParser();

  const promptResult = await model.invoke(prompt);
  // @ts-ignore
  const content = promptResult.toJSON().kwargs.content;
  const response = await parser.invoke(content);

  console.log(JSON.stringify(response, null, 2));
};

main();
