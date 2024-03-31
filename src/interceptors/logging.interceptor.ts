import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.logHttpCall(context, next);
  }

  private logHttpCall(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, url, protocol, hostname, body } = request;
    const correlation_key = uuidv4();

    if (url !== '/' && url !== '/order/find/print' && url !== '/order/receipt/print' && url !== '/order/receipt/print/complete' && url !== '/metrics') {
      this.logger.log(
        `[${correlation_key}] ${method} ${protocol} ${hostname}${url} ${ip}: ${
          context.getClass().name
        } ${context.getHandler().name} body: ${JSON.stringify(body)}`
      );

      const now = Date.now();
      return next.handle().pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse();

          const { statusCode } = response;
          this.logger.log(
            `[${correlation_key}] ${method} ${url} ${statusCode} : ${
              Date.now() - now
            }ms`
          );
        })
      );
    }
    return next.handle();
  }
}
