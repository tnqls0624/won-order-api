import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CursorDto<T> {
  constructor(
    data: T[],
    next_cursor: number | string | null,
    total_count: number
  ) {
    this.data = data;
    this.next_cursor = next_cursor;
    this.total_count = total_count;
  }
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly data: T[];

  @ApiProperty({
    additionalProperties: { oneOf: [{ type: 'number' }, { type: 'string' }] }
  })
  readonly next_cursor: number | string | null;

  @ApiProperty({ type: 'number' })
  readonly total_count: number;
}
