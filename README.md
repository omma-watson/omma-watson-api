# API

- All `id`s are typed as `string`

## Create

### [POST] `/question/new` (질문 -> 질문 상세)

#### Request

```json
// POST
{ "query": "쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?" }
```

#### Response

1. 질문 ID (`id`, 새로 생성됨)
2. 먹어도 되는지 안되는지 (`title`)
   1. ex> `생크림 라면은 먹지 않는 게 좋아요.`
3. 이유, 근거 (`content`)
   1. ex> `생크림은 조금만 드셔야 해요. 라면은 2000mg 어쩌고 나트륨이라... 근거는 뭐뭐뭐기 때문이에요 (출처)`
4. 꼭 먹어야 한다면? (`solution`)
   1. ex> `스프를 절반만 넣으세요.`
5. 다른 마미들은 이렇게 생각했어요
   1. 찬성 👍 (`feedback.good`) -> `number` count
   2. 반대 👎 (`feedback.bad`) -> `number` count
6. AI가 refine한 마미 의견 총평 (`feedback.comment`)
   1. ex> `나트륨은 좋지 않아요`
7. NB상품 (`products` of `nb_product[]`)
   1. `title`
   2. `img`
   3. `price`
   4. 원가 `price.original`
   5. 소비자가(최종 가격) `price.final`
   6. `url`
8. `food_name` (아래의 영양성분 검색 API에 사용할 검색 키워드)
9. `persona` (페르소나 사용자 정보)

### [GET] `/nutrition-facts/{food_name}`

#### Request

```json
{ "query": "마라탕" }
```

#### Response

- 키워드 -> 제일 유사한 상품 n개(query로 온 만큼) 골라서 `vectorStore.similaritySearch()`, 영양성분정보 반환
- TODO: `MemoryVectorStore` -> Vercel Postgres VectorStore 로 다시 짜기

## Query

### [GET] `/question/badges`

- 메인 화면 -> 추천 배지

```json
[
  "쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계",
  "불어터진 짬뽕",
  "생크림 2번 추가한 수타 짜장면"
]
```

### [GET] `/question/trending`

- 가장 많이 받은 질문들 목록 -> 질문 ID 함께 반환
  1.  `id`
  2.  `persona` -> 페르소나 (ex> `임신 15주차`)
  3.  `title` -> text/html/md? (ex> `쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?`)

```json
[
  {
    "id": "1",
    "title": "쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?",
    "persona": "임신 15주차"
  },
  {
    "id": "2",
    "title": "생크림 잔뜩 들어간 딸기 케이크 어떤가요",
    "persona": "임신 15주차"
  }
]
```

### [GET] `/question/detail/{id}`

- 질문 ID 가지고 기존에 만들어진(캐싱된) 질문 상세
