import { applyDecorators, SetMetadata } from '@nestjs/common';

// metadata에 대한 상수 정의
// core에서만 사용되고, app layer에서는 사용되지 않음
export const CACHE_METADATA = 'CACHE_METADATA';

// 옵션 정의
export interface CacheOptions {
  // cron expression을 받아올수 있음.
  cron?: string;

  // key값을 받아올 수 있음
  key?: string;

  // cache의 유효 시간을 받아올 수 있음
  ttl?: number;

  // 값에 대한 검증 함수를 받아올 수 있음
  validate?: (value: any) => boolean;

  // 로깅에 필요한 함수를 받아올 수 있음
  // eslint-disable-next-line @typescript-eslint/ban-types
  logger?: Function;
}

// 데코레이터 함수 정의
export function Cache(options: CacheOptions = {}): MethodDecorator {
  // applyDecorators는 사용하지 않아도 됨
  // 데코레이터 체이닝에 대한 가능성을 염두에 두고 작업하였음
  return applyDecorators(
    // method에 대한 metadata를 정의함
    // 나중에 `MetadataScanner`를 통해서 값을 가져옴
    SetMetadata(CACHE_METADATA, options)
  );
}
