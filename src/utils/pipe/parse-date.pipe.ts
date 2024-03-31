import { PipeTransform, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';

@Injectable()
export class ParseDatePipe implements PipeTransform<string> {
  transform(value: unknown): Date {
    if (!dayjs(value as string, 'YYYY-MM-DD').isValid())
      throw new CustomError(RESULT_CODE.INVALID_REQUEST_DATE, {
        context: this.constructor.name,
        data: { request_date: value }
      });
    return dayjs(value as string).toDate();
  }
}
