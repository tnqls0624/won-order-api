import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum Language {
  KM = 'km',
  KO = 'ko',
  EN = 'en',
  ZH = 'zh'
}

export class UpdateEmployeeDto {
  constructor(nickname: string, language: Language) {
    this.nickname = nickname;
    this.language = language;
  }

  @ApiProperty({ description: '닉네임' })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '닉네임', enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language: Language;
}
