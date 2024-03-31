/* 주문상태 */
export enum OrderStateEnum {
  WAIT = 'WAIT', // 대기중
  CANCEL = 'CANCEL', // 취소
  COMPLETE = 'COMPLETE', // 완료
  VALIDATION_FAIL = 'VALIDATION_FAIL' // Validation 실패
}

/* 주문방식(타입) */
export enum MainOrderTypeEnum {
  HALL = 'HALL', // 홀
  WRAP = 'WRAP', // 포장
  DELIVERY = 'DELIVERY' // 배달
}

export enum OrderCompletionStatus {
  FINISHED = 'FINISHED',
  WAIT = 'WAIT'
}

/* Validation 결과 */
export interface ValidationResult {
  success: boolean;
  fail_reason?: string;
}

/* 주문정보생성(전송) 결과 */
export interface SaveOrderResult {
  result: 'PUBLISHED' | 'VALIDATION_FAIL' | 'SYSTEM_ERROR';
  fail_reason?: string;
}

// export interface MenuInfo {
//   id: number;
//   name: string;
//   menu_option_category: {
//     id: number;
//     name: string;
//     menu_option: {id: number; name: string}[];
//   }[];
// }

export interface SalesType {
  key: string;
  yyyymm: number;
  group_id: number;
  count?: number;
  sum?: number;
}

/* 매출조회 리스트 Excel 파일 다운로드 용도 */
export interface SalesReportType {
  key?: string;
  // year?: number;
  년도?: number;
  // quarter?: number;
  분기?: number;
  // month?: number;
  월?: number;
  // group?: string;
  그룹?: string;
  // count?: number;
  건수?: number;
  // order_amount?: number;
  주문금액?: number;
}

/* 주문관리 리스트 조회 Excel 파일 다운로드 용도 */
export interface OrdersReportType {
  주문번호?: string;
  주문일자?: string;
  주문상태?: string;
  주문타입?: string;
  총금액?: number;
  메뉴명?: string;
  테이블_그룹이름?: string;
  테이블번호?: string;
  고객_전화번호?: string;
}
