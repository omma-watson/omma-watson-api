import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';

import { embeddings, vectorstoreConfig } from '@/ai';

const nhsukDocs = `
# 임신 중 비타민과 미네랄 섭취 가이드

임신 중 건강하고 다양한 식단을 섭취하면 대부분의 필요한 비타민과 미네랄을 얻을 수 있습니다. 하지만 임신 중이거나 임신 가능성이 있을 때는 엽산 보충제를 섭취하는 것이 중요합니다.

다음과 같이 섭취하는 것이 권장됩니다:
- 임신 전부터 임신 12주까지 매일 400마이크로그램의 엽산

이는 임신 초기 몇 주 동안 태아의 발달 문제 위험을 줄이기 위한 것입니다.

또한 매일 비타민 D 보충제를 섭취하는 것도 권장됩니다.

임신 중에는 비타민 A(레티놀)가 포함된 간유나 보충제를 섭취하지 마세요. 과도한 비타민 A는 태아에게 해로울 수 있습니다. 항상 라벨을 확인하세요.

임신 중 피해야 할 음식에 대해서도 알아두어야 합니다.

## 임신 보충제 구입처

보충제는 약국과 슈퍼마켓에서 구입할 수 있으며, GP(일반의)가 처방해줄 수도 있습니다.

종합 비타민제로 엽산을 섭취하고 싶다면, 비타민 A(또는 레티놀)가 포함되지 않은 제품인지 확인하세요.

Healthy Start 제도를 통해 무료로 비타민을 받을 수 있는 자격이 될 수도 있습니다.

## 임신 전과 임신 중 엽산 섭취

임신 전부터 임신 12주까지 매일 400마이크로그램의 엽산 정제를 섭취하는 것이 중요합니다.

엽산은 척추 갈림증을 포함한 신경관 결함이라고 알려진 선천성 기형을 예방하는 데 도움이 될 수 있습니다.

임신 전에 엽산을 섭취하지 않았다면, 임신 사실을 알게 된 즉시 섭취를 시작해야 합니다.

엽산(천연형태의 폴산)이 포함된 녹색 잎채소와 아침 시리얼, 지방 스프레드 등 엽산이 첨가된 식품을 섭취하도록 노력하세요.

건강한 임신을 위해 권장되는 양의 엽산을 식품만으로 섭취하기는 어렵기 때문에 엽산 보충제를 섭취하는 것이 중요합니다.

## 고용량 엽산

신경관 결함이 임신에 영향을 미칠 가능성이 더 높은 경우, 더 높은 용량의 엽산(5밀리그램)을 섭취하도록 조언받을 수 있습니다. 이 경우 임신 12주까지 매일 이 용량을 섭취해야 합니다.

다음과 같은 경우 위험이 더 높을 수 있습니다:
- 본인이나 아기의 생물학적 부모가 신경관 결함이 있는 경우
- 본인이나 아기의 생물학적 부모의 가족력에 신경관 결함이 있는 경우
- 이전 임신에서 신경관 결함의 영향을 받은 경우
- 당뇨병이 있는 경우
- 항간질제를 복용하는 경우
- HIV에 대한 항레트로바이러스 약물을 복용하는 경우

이 중 어느 것이라도 해당된다면 GP와 상담하세요. GP는 더 높은 용량의 엽산을 처방할 수 있습니다.

GP나 조산사는 임신 중 추가 검진 검사를 권장할 수도 있습니다.

## 임신 중 비타민 D

매일 10마이크로그램의 비타민 D가 필요합니다. 9월부터 3월까지 임신 중이거나 모유 수유 중인 여성은 이 양을 포함한 일일 보충제를 섭취하는 것이 권장됩니다.

비타민 D는 뼈, 치아, 근육을 건강하게 유지하는 데 필요한 칼슘과 인의 양을 조절합니다. 우리 몸은 여름 햇빛(3월 말/4월 초부터 9월 말까지)에 피부가 노출될 때 비타민 D를 만듭니다.

9월부터 3월까지는 햇빛만으로는 충분한 비타민 D를 만들 수 없기 때문에 보충제가 권장됩니다.

비타민 D는 다음과 같은 식품에도 포함되어 있습니다:
- 기름진 생선 (연어, 고등어, 청어, 정어리 등)
- 달걀
- 적색 육류

일부 아침 시리얼, 지방 스프레드, 비유제품 우유 대체품에도 비타민 D가 첨가되어 있습니다. 이런 제품에 첨가되는 양은 다양하며 적을 수 있습니다.

비타민 D는 자연적으로 발생하거나 첨가된 형태로 소수의 식품에만 포함되어 있기 때문에, 식품만으로 충분한 양을 섭취하기는 어렵습니다.

하루에 100마이크로그램(4,000 IU) 이상의 비타민 D를 섭취하지 마세요. 해로울 수 있습니다.

임신 중이거나 모유 수유 중이며 Healthy Start 제도 자격이 있다면 무료로 비타민 D가 포함된 비타민 보충제를 받을 수 있습니다.

> 참고: 비타민 D가 코로나바이러스(COVID-19)의 위험을 줄인다는 일부 보고가 있었지만, 현재 COVID-19를 예방하거나 치료하기 위해 비타민 D만 섭취하는 것을 지지할 만한 충분한 증거는 없습니다.

### 피부가 어둡거나 피부를 많이 가리는 경우

다음과 같은 경우 비타민 D가 충분하지 않을 특별한 위험이 있을 수 있습니다:
- 피부가 어두운 경우 (예: 아프리카, 아프리카계 카리브해, 남아시아 출신)
- 외출 시 피부를 가리거나 실내에서 많은 시간을 보내는 경우

이런 경우 연중 매일 비타민 D 보충제를 섭취하는 것을 고려해야 할 수 있습니다. 조언을 위해 조산사나 의사와 상담하세요.

## 임신 중 철분

철분이 충분하지 않으면 매우 피곤해지고 빈혈이 생길 수 있습니다.

붉은 살코기, 녹색 잎채소, 말린 과일, 견과류에는 철분이 포함되어 있습니다.

임신 중 땅콩이나 땅콩이 포함된 음식(땅콩 버터 등)을 먹고 싶다면, 알레르기가 없고 의료 전문가가 금지하지 않는 한 건강하고 균형 잡힌 식단의 일부로 섭취할 수 있습니다.

많은 아침 시리얼에 철분이 첨가되어 있습니다. 혈중 철분 수치가 낮아지면 GP나 조산사가 철분 보충제를 섭취하도록 조언할 것입니다.

## 임신 중 비타민 C

비타민 C는 세포를 보호하고 건강하게 유지하는 데 도움이 됩니다.

다양한 과일과 채소에서 발견되며, 균형 잡힌 식단으로 필요한 모든 비타민 C를 섭취할 수 있습니다.

좋은 공급원:
- 오렌지와 오렌지 주스
- 빨간색과 녹색 피망
- 딸기
- 블랙커런트
- 브로콜리
- 브뤼셀 스프라우트
- 감자

## 임신 중 칼슘

칼슘은 아기의 뼈와 치아를 만드는 데 필수적입니다.

칼슘 공급원:
- 우유, 치즈, 요구르트
- 로켓, 워터크레스, 컬리 케일과 같은 녹색 잎채소
- 두부
- 칼슘이 첨가된 두유
- 빵과 강화 밀가루로 만든 식품
- 뼈째 먹는 생선 (정어리, 멸치 등)

## 임신 중 채식, 비건 및 특별 식단

다양하고 균형 잡힌 채식 식단은 임신 중 당신과 아기에게 충분한 영양을 제공할 수 있습니다.

하지만 철분과 비타민 B12를 충분히 섭취하기 어려울 수 있습니다.
`;

// 마크다운 파싱을 위한 간단한 함수
function parseMarkdown(markdown: string): { text: string; content: string }[] {
  const lines = markdown.split('\n');
  const result: { text: string; content: string }[] = [];
  const stack: { level: number; text: string }[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const fullText = [...stack.map((item) => item.text), text].join('-');
      stack.push({ level, text });

      result.push({ text: fullText, content: '' });
    } else if (line.trim() !== '') {
      if (result.length > 0) {
        result[result.length - 1].content += line + '\n';
      }
    }
  });

  return result.filter((v) => !!v.content);
}

async function main() {
  const parsedData = parseMarkdown(nhsukDocs);

  const vectorstore = await VercelPostgres.initialize(embeddings, {
    ...vectorstoreConfig,
    tableName: 'references_vectors',
  });
  console.log(parsedData);

  await vectorstore.addDocuments(
    parsedData.map((item) => ({
      pageContent: item.content,
      metadata: {
        source: '영국 국영의료서비스(NHS) 웹사이트',
        url: 'https://www.nhs.uk/pregnancy/keeping-well/vitamins-supplements-and-nutrition/',
        id: item.text,
      },
      id: item.text,
    })),
  );

  // console.log('데이터가 성공적으로 벡터스토어에 추가되었습니다.');

  // 벡터스토어 연결 종료
  await vectorstore.end();
}

main().catch(console.error);
