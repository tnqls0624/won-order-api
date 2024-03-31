import { PipeTransform, Injectable } from '@nestjs/common';

interface PaginateInput {
  page?: string;
  limit: string;
  cursor?: string;
}

interface PaginateOutput {
  page?: number;
  limit: number;
  cursor?: number;
}
@Injectable()
export class PaginateParseIntPipe
  implements PipeTransform<PaginateInput, PaginateOutput>
{
  transform(value: PaginateInput): PaginateOutput {
    const result: PaginateOutput = {
      page: value.page ? parseInt(value.page) : undefined,
      limit: parseInt(value.limit),
      cursor: value.cursor ? parseInt(value.cursor) : undefined
    };
    return result;
  }
}
