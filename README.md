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
2. `badge` type: `'추천' | '양호' | '주의' | '위험'`
3. ~~먹어도 되는지 안되는지 (`title`)~~ Deprecated, 고정이라서 `badge` 랑 `food_name` 보고 프엔단에서 생성하기 (피그마 참고)
   1. ~~ex> `생크림 라면은 먹지 않는 게 좋아요.`~~
4. 이유, 근거 (`content`)
   1. ex> `생크림은 조금만 드셔야 해요. 라면은 2000mg 어쩌고 나트륨이라... 근거는 뭐뭐뭐기 때문이에요 (출처)`
   2. 마크다운 포함
5. 꼭 먹어야 한다면? (`solution`, `string[]`)
   1. ex> `["음료는 물이나 주스를 선택하기", "안전한 식품 재료를 사용하기", "음식 이외의 물질은 절대 먹지 않기"]`
6. 다른 마미들은 이렇게 생각했어요
   1. 찬성 👍 (`feedback.good`) -> `number` count
   2. 반대 👎 (`feedback.bad`) -> `number` count
7. AI가 refine한 마미 의견 총평 (`feedback.comment`)
   1. ex> `나트륨은 좋지 않아요`
8. NB상품 (`products` of `nb_product[]`)
   1. `title`
   2. `img`
   3. `price`
   4. 원가 `price.original`
   5. 소비자가(최종 가격) `price.final`
   6. `url`
9. `food_name` (아래의 영양성분 검색 API에 사용할 검색 키워드)
10. `persona` (페르소나 사용자 정보)

### [GET] `/nutrition-facts/{food_name}?result_count={result_count}`

- `result_count` 기본값은 5
- 유사도와 같이 반환함

#### Request

```json
{ "query": "마라탕" }
```

#### Response

- 키워드 -> 제일 유사한 상품 n개(query로 온 만큼, 기본값은 5) 골라서 `vectorStore.similaritySearch()`, 영양성분정보 반환
- Vercel Postgres VectorStore 로 구현됨 (3~5초 이내로 걸릴듯)
- 다섯 개 다 각각 보여주면 좋을듯... 공공데이터에 쿼리가 없을 수 있음

```json
[
  {
    "id": "D303-148450000-0001",
    "metadata": {
      "식품명": "라면_짬뽕라면",
      "업체명": "해당없음",
      "대표식품명": "라면"
    },
    // `totalStandards.영양성분함량기준량` (일반적으로 100g) 당 영양성분
    // 영양성분 값 비워져 있는 건 잘려서 반환. key-value dynamic 하게 렌더링 할 것.
    "nutrition": {
      "인(mg)": "41",
      "철(mg)": "0",
      "당류(g)": "0.21",
      "수분(g)": "80.1",
      "지방(g)": "3.51",
      "회분(g)": "1.25",
      "칼륨(mg)": "88",
      "칼슘(mg)": "78",
      "단백질(g)": "2.84",
      "나트륨(mg)": "333",
      "니아신(mg)": "0.28",
      "티아민(mg)": "0.177",
      "레티놀(μg)": "0",
      "비타민 C(mg)": "0",
      "식이섬유(g)": "1.1",
      "에너지(kcal)": "92",
      "탄수화물(g)": "12.27",
      "포화지방산(g)": "1.15",
      "리보플라빈(mg)": "0.211",
      "콜레스테롤(mg)": "14.23",
      "베타카로틴(μg)": "203",
      "비타민 A(μg RAE)": "17",
      "트랜스지방산(g)": "0.01"
    },
    // `totalStandards.식품중량` (전체 상품 중량) 기준 영양성분
    "totalNutrition": {
      "인(mg)": "307.5",
      "당류(g)": "1.575",
      "수분(g)": "600.7499999999999",
      "지방(g)": "26.325",
      "회분(g)": "9.375",
      "칼륨(mg)": "660",
      "칼슘(mg)": "585",
      "단백질(g)": "21.3",
      "나트륨(mg)": "2497.5",
      "니아신(mg)": "2.1",
      "티아민(mg)": "1.3275",
      "식이섬유(g)": "8.250000000000002",
      "에너지(kcal)": "690",
      "탄수화물(g)": "92.025",
      "포화지방산(g)": "8.624999999999998",
      "리보플라빈(mg)": "1.5825",
      "콜레스테롤(mg)": "106.725",
      "베타카로틴(μg)": "1522.5",
      "비타민 A(μg RAE)": "127.5",
      "트랜스지방산(g)": "0.075"
    },
    "totalStandards": {
      "영양성분함량기준량": "100",
      "식품중량": "750"
    },
    "score": 0.7288866800733395
  }
]
```

## Query

### ~~[GET] `/question/badges`~~

- -> 프엔에서 하드코딩?
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
  3.  `title` -> 질문 제목 -> text/html/md? (ex> `쫄깃쫄깃 당면 듬뿍 들어간 마라탕 2단계 먹어도 되나요?`)

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
