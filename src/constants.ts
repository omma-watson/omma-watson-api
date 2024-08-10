import { pick } from "./utils"

export type QuestionDetail = {
  id: string,

  title: string,
  content: string,
  solution: string,
  feedback: {
    good: number,
    bad: number,
    comment: string
  }

  products: [],
  keyword: string,
  persona: string,
}

export const MOCKED_QUESTION_DETAILS: QuestionDetail[] = [
  {
    "id": "1",
    "title": "쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?",
    "content": "",
    "solution": "",
    feedback: {
      good: 154,
      bad: 2,
      comment: '적게 먹는 게 좋아요. 나트륨은 좋지 않아요',
    },
    "persona": "임신 15주차",
    "keyword": "당면마라탕",
    products: [],
  },
  {
    "id": "2",
    "title": "생크림 잔뜩 들어간 딸기 케이크 어떤가요",
    "content": "",
    "solution": "",
    feedback: {
      good: 2124,
      bad: 12,
      comment: '적게 먹는 게 좋아요. 너무 많은 당은 좋지 않아요',
    },
    "persona": "임신 15주차",
    "keyword": "생크림딸기케이크",
    products: [],
  }
]

export const MOCKED_TRENDINGS = MOCKED_QUESTION_DETAILS.map(v => pick(v, ['id', 'title', 'persona']))
export type TrendingCard = typeof MOCKED_TRENDINGS[number]
