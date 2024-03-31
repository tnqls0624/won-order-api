import { BaseEntity } from './base.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AdminType {
  MASTER = 'MASTER',
  EMPLOYEE = 'EMPLOYEE',
  SUPER = 'SUPER'
}

export class AdminEntity extends BaseEntity {
  @ApiProperty({ description: '가맹점 아이디', required: true })
  @IsNumber()
  market_id: number | null;

  @ApiProperty({ description: '언어 아이디', required: true })
  @IsNumber()
  language_id: number;

  @ApiProperty({ description: '가맹점 아이디', required: true })
  @IsEnum(AdminType)
  type: AdminType;

  @ApiProperty({ description: '아이디', required: true })
  @IsString()
  admin_id: string;

  @ApiProperty({ description: '패스워드', required: true })
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', required: true })
  @IsString()
  nickname: string;
}
