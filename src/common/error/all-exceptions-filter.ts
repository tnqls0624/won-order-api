import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import dayjs from 'dayjs';
import { ResponseBodyType } from 'src/types';
import { RESULT_CODE } from '../../constant';
import CustomError from './custom-error';

export default class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    this.logger.error(exception.message, exception.stack);

    const log_entry: any = {
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      method: request.method,
      url: request.url,
      context: this.constructor.name,
      exceptionType: '',
      message: exception.message,
      stack: exception.stack,
      reason: exception.meta,
      data:
        exception instanceof CustomError ? JSON.stringify(request.body) : null
    };

    let code: number = RESULT_CODE.UNKNOWN_ERROR;
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = '';

    if (exception instanceof CustomError) {
      log_entry.exceptionType = 'CustomError';
      log_entry.contenxt = exception.context || this.constructor.name;
      code = exception.code;
      statusCode = exception.status;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      log_entry.exceptionType = 'HttpException';
      statusCode = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      log_entry.exceptionType = 'Error';
      message = exception.message;
    } else {
      log_entry.exceptionType = 'UnknownError';
    }

    this.logger.error(JSON.stringify(log_entry));

    const responseBody: ResponseBodyType = {
      code,
      statusCode,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      message
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
