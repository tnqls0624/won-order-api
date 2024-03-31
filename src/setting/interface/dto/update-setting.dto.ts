import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum Language {
  KM = 'km',
  KO = 'ko',
  EN = 'en'
}

enum Currency {
  KHR = 'KHR',
  KRW = 'KRW',
  USD = 'USD',
  CNY = 'CNY'
}

export class UpdateSettingDto {
  @ApiProperty({ description: '식당 이름', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: '와이파이 아이디', required: false })
  @IsOptional()
  @IsString()
  wifi_ssid: string;

  @ApiProperty({ description: '와이파이 비밀번호', required: false })
  @IsOptional()
  @IsString()
  wifi_password: string;

  @ApiProperty({ description: '시작 영업시간', required: false })
  @IsOptional()
  @IsString()
  start_business_hours: string;

  @ApiProperty({ description: '종료 영업시간', required: false })
  @IsOptional()
  @IsString()
  end_business_hours: string;

  @ApiProperty({ description: '시작 휴식시간', required: false })
  @IsOptional()
  @IsString()
  start_break_time: string;

  @ApiProperty({ description: '시작 휴식시간', required: false })
  @IsOptional()
  @IsString()
  end_break_time: string;

  @ApiProperty({ description: '정산 시간', required: false })
  @IsOptional()
  @IsString()
  settlement_time: string;

  @ApiProperty({ description: '식당 안내문구', required: false })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty({ description: '식당 주소', required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ description: '식당 전화번호', required: false })
  @IsOptional()
  @IsString()
  tel: string;

  @ApiProperty({ description: '텍스트 색깔', required: false })
  @IsOptional()
  @IsString()
  text_color: string;

  @ApiProperty({ description: '배경 색깔', required: false })
  @IsOptional()
  @IsString()
  background_color: string;

  @ApiProperty({ description: '주요 언어', required: false })
  @IsOptional()
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ description: '대표 통화', required: false })
  @IsOptional()
  @IsEnum(Currency)
  currency_code: Currency;
}
