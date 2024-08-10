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
3. 이유, 근거 (`content`)
4. 꼭 먹어야 한다면? (`solution`)
5. 다른 마미들은 이렇게 생각했어요
    1. 찬성 👍 (`good`) -> `number` count
    2. 반대 👎  (`bad`) -> `number` count
6. AI가 refine한 마미 의견 총평
    1. `나트륨은 좋지 않아요`
7. NB상품 (`products` of `nb_product[]`)
    1. `title`
    2. `img`
    3. `price`
      1. 원가 `price.original`
      2. 소비자가(최종 가격) `price.final`
8. `keyword` (아래의 영양성분 검색 API에 사용할 검색 키워드)

### [GET] `/nutrition/facts/{keyword}`

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

### [GET] `/question/trending`

- 가장 많이 받은 질문들 목록 -> 질문 ID 함께 반환
   1. `id`
   2. `persona` -> 페르소나 (ex> `임신 15주차`)
   3. `title` -> text/html/md? (ex> `쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?`)

### [GET] `/question/detail/{id}`

- 질문 ID 가지고 기존에 만들어진(캐싱된) 질문 상세
