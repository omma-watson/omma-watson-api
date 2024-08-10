import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';

import { embeddings, vectorstoreConfig } from '@/ai';

async function main() {
  const vectorstore = await VercelPostgres.initialize(embeddings, {
    ...vectorstoreConfig,
    tableName: 'references_vectors',
  });

  const data = `
임신 중 피해야 할 음식 8가지
임신 중에는 좋아하는 음식을 먹으려고 해도 혹시 해가 가진 않을지 하나하나 신경 쓰이고 고민하게 된다. 어떤 음식을 멀리해야 우리 아기에게 해가 되지 않는지 임신 중 금기해야 할 음식 8가지를 이데이베베와 함께 알아보도록 하자.

1. 술: 임신 중에 섭취하는 술은 알코올 성분이 분해되지 않은 상태로 태아에게 직접적으로 전달되기 때문에 태아에게 무조건 피해야 할 음식 중 하나이다. 담배보다 오히려 술이 태아에게 더 안 좋다고 하니 임신 중 술은 무조건 금기하도록 하자.
2. 카페인: 임산부들이 가장 고민하는 음식이 바로 커피가 아닐까 한다. 임산부 하루 권장 카페인 섭취량은 300mg 이하로 하루에 1잔 정도는 괜찮으나 과도한 카페인 섭취는 아기에게 해가 될 수 있으니 적당히 섭취하도록 한다.
3. 인스턴트: 물론 예상했겠지만 인스턴트 음식은 임산부가 피해야 할 음식이다. 특히 라면의 경우, 국물을 내는 스프에 여러 가지 화학첨가물이 들어있어 추후 임신중독증을 유발시킬 수 있다. 또한 아기에게는 아토피를 직접적으로 유발할 가능성이 있으니 임신 기간에는 임스턴트 음식을 삼가도록 한다.
4. 생선회: 생선을 회로 먹을 경우, 기생충으로 인한 감염 위험이 있을 수 있다. 또한 전문가들은 연어나 참치처럼 크기가 큰 생선을 임산부가 먹을 경우에 면역 체계가 약하기 때문에 수은과 같은 중금속에 노출이 될 위험이 높다고 밝혔다. 이에 미국의 한 매체는 임산부들에게 참치 섭취를 금기하라고 보도하기도 했다.
5. 생강: 생강에 들어있는 매운 성분은 태아의 피부질환을 유발할 가능성이 있어 많이 먹으면 태아의 아토피나 두드러기, 습진 등 피부 질환을 일으킬 수 있다.
6. 파인애플: 파인애플 가운데에 들어있는 심지 부분은 단백질을 분해하는 성분이 들어있기 때문에 태아 유산을 일으키기도 하고 아기에게 아토피를 유발할 수 있다. 따라서 파인애플을 섭취할 경우엔 심을 깊게 잘라내고 과육만 적당히 섭취하는 것이 좋다.
7. 알로에: 알로에는 차가운 성질을 가지고 있는 재료로 임산부의 몸을 차게 만든다. 또한 복통 유발과 자궁 내 출혈을 일으킬 가능성이 있으므로 임산부라면 반드시 삼가는 게 좋다.
8. 식혜: 식혜의 엿기름은 젖을 마르게 한다고 알려져 있다. 출산 후 모유 수유를 계획하고 있는 임산부라면 식혜는 모유 수유에 해가 될 수 있으니 반드시 주의하도록 한다.
`;

  const itemRegex = /(\d+)\.\s([^:]+):\s([\s\S]+?)(?=\n\d+\.|\n$)/g;
  let match;

  while ((match = itemRegex.exec(data)) !== null) {
    const [, number, title, content] = match;
    await vectorstore.addDocuments([
      {
        pageContent: `${title}: ${content.trim()}`,
        metadata: {
          number: number,
          title: title,
          source: '이데이베베 웹사이트',
          url: 'https://www.edaymall.com/contents/webzineView.do?webZineFlag=40&webZineNo=0083',
        },
      },
    ]);
    console.log(`Added item ${number}: ${title}`);
  }

  console.log('Documents added successfully.');
  await vectorstore.end();
}

main().catch(console.error);
