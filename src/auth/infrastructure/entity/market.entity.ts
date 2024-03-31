import { IsEnum, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from './base.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from '@prisma/client';

export class MarketEntity extends BaseEntity {
  @ApiPropertyOptional({
    required: true,
    type: 'number',
    description: '통화 아이디',
    example: 1
  })
  @IsNumber()
  currency_id: number;

  @ApiPropertyOptional({
    required: true,
    type: 'number',
    description: '통화 아이디',
    example: 1
  })
  @IsNumber()
  language_id: number;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '마켓 이름',
    example: '아이테크'
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '액세스 아이디',
    example: 'itech'
  })
  @IsString()
  access_id: string;

  @ApiPropertyOptional({
    required: true,
    type: 'enum',
    description: '국가',
    example: Country.KOREA
  })
  @IsEnum(Country)
  country: Country;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '연락처',
    example: '0101010101'
  })
  @IsString()
  phone: string | null;

  @ApiPropertyOptional({
    required: true,
    type: 'string',
    description: '이메일',
    example: 'itechcompany22@gmail.com'
  })
  @IsString()
  email: string | null;
}
