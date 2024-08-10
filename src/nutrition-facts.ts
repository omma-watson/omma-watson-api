export type DataRecord = {
  식품코드: string;
  식품명: string;
  데이터구분코드: string;
  데이터구분명: string;
  식품기원코드: string;
  식품기원명: string;
  식품대분류코드: string;
  식품대분류명: string;
  대표식품코드: string;
  대표식품명: string;
  식품중분류코드: string;
  식품중분류명: string;
  식품소분류코드: string;
  식품소분류명: string;
  식품세분류코드: string;
  식품세분류명: string;
  영양성분함량기준량: string;
  '에너지(kcal)': string;
  '수분(g)': string;
  '단백질(g)': string;
  '지방(g)': string;
  '회분(g)': string;
  '탄수화물(g)': string;
  '당류(g)': string;
  '식이섬유(g)': string;
  '칼슘(mg)': string;
  '철(mg)': string;
  '인(mg)': string;
  '칼륨(mg)': string;
  '나트륨(mg)': string;
  '비타민 A(μg RAE)': string;
  '레티놀(μg)': string;
  '베타카로틴(μg)': string;
  '티아민(mg)': string;
  '리보플라빈(mg)': string;
  '니아신(mg)': string;
  '비타민 C(mg)': string;
  '비타민 D(μg)': string;
  '콜레스테롤(mg)': string;
  '포화지방산(g)': string;
  '트랜스지방산(g)': string;
  출처코드: string;
  출처명: string;
  식품중량: string;
  업체명: string;
  데이터생성방법코드: string;
  데이터생성방법명: string;
  데이터생성일자: string;
  데이터기준일자: string;
  제공기관코드: string;
  제공기관명: string;
};
export type DataRecordKey = Partial<keyof DataRecord>;

type StoredVectorData = {
  memoryVectors: any[];
  texts: string[];
  metadatas: object[];
};

export const DATA_RECORD_TEXT_KEYS = [
  '식품명',
  '데이터구분명',
  '식품기원명',
  '식품대분류명',
  '대표식품명',
  '식품중분류명',
  '식품소분류명',
  '식품세분류명',
  '업체명',
  '제공기관명',
] as DataRecordKey[];
