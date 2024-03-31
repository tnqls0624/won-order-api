import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindOrdersAdminParams } from './find-orders-admin.params';

export class FindOrdersParams extends FindOrdersAdminParams {
  @ApiPropertyOptional({
    name: 'guest_id',
    required: false,
    type: 'string',
    description: '게스트 아이디',
    example: 'string'
  })
  @IsOptional()
  @IsString()
  guest_id: string;

  @ApiPropertyOptional({
    name: 'market_id',
    required: false,
    type: 'string',
    description: '마켓 아이디',
    example: '1'
  })
  @IsOptional()
  @IsString()
  market_id: string;

  @ApiPropertyOptional({
    name: 'language_code',
    required: false,
    type: 'string',
    description: '언어 코드',
    example: 'ko'
  })
  @IsOptional()
  @IsString()
  language_code: string;
}
