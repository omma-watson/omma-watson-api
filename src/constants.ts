import { pick } from './utils';

export type NBProduct = {
  title: string;
  img: string;
  price: {
    original: number;
    final: number;
  };
  url: string;
};

export type QuestionDetail = {
  id: string;

  title: string;
  content: string;
  solution: string;
  feedback: {
    good: number;
    bad: number;
    comment: string;
  };

  products: NBProduct[];
  food_name: string;
  persona: string;
};

export const MOCKED_QUESTION_DETAILS: QuestionDetail[] = [
  {
    id: '1',
    title: '마라탕 2단계는 주의해서 드세요.',
    content:
      '마라탕의 매운 정도와 당면의 양에 따라 소화에 부담을 줄 수 있습니다. 마라탕에 포함된 고추기름과 향신료는 위산 분비를 촉진하여 속쓰림을 유발할 수 있으며, 당면은 소화가 잘 되지 않아 더부룩함을 느낄 수 있습니다. 또한, 마라탕의 높은 나트륨 함량은 부종을 유발할 수 있어 주의가 필요합니다. (출처: 대한영양사협회)',
    solution:
      '마라탕을 꼭 드시고 싶다면, 1단계로 낮추고 당면의 양을 줄이세요. 또한, 물을 충분히 마시고 채소를 많이 넣어 먹는 것이 좋습니다.',
    feedback: {
      good: 45,
      bad: 12,
      comment:
        '대부분의 마미들이 임신 중 매운 음식은 주의해야 한다고 생각해요. 하지만 가끔 먹는 것은 괜찮다는 의견도 있어요.',
    },
    products: [
      {
        title: '바삭 통살 유린기 430g',
        img: 'https://example.com/mild-mala-sauce.jpg',
        price: {
          original: 9200,
          final: 6580,
        },
        url: 'https://wisely.store/product/detail.html?product_no=1681&cate_no=104&display_group=1',
      },
    ],
    food_name: '마라탕', // 이렇게 바꿔서 검색하는데 쓸거
    persona: '임신 24주차',
  },
  // {
  //   "id": "2",
  //   "title": "생크림 잔뜩 들어간 딸기 케이크 어떤가요",
  //   "content": "",
  //   "solution": "",
  //   feedback: {
  //     good: 2124,
  //     bad: 12,
  //     comment: '적게 먹는 게 좋아요. 너무 많은 당은 좋지 않아요',
  //   },
  //   "persona": "임신 15주차",
  //   "keyword": "생크림딸기케이크",
  //   products: [],
  // }
];

export const MOCKED_TRENDINGS = MOCKED_QUESTION_DETAILS.map((v) =>
  pick(v, ['id', 'title', 'persona']),
);
export type TrendingCard = (typeof MOCKED_TRENDINGS)[number];
