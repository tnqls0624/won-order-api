import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(5000),
      map((data: any) => {
        // 문자열 타입이 아닌 경우에만 기존 로직 실행
        if (typeof data !== 'string') {
          return {
            success: true,
            data,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        // 문자열 타입인 경우, 다른 처리(또는 그대로 data 반환)
        return data;
      })
      // retryWhen(err => {
      //   return err.pipe(
      //     scan((acc, error) => {
      //       if (acc === 1) throw error;
      //       return acc + 1;
      //     }, 0),
      //     delay(2000)
      //   );
      // })
    );
  }
}
