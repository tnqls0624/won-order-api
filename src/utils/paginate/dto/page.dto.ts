import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;
}
