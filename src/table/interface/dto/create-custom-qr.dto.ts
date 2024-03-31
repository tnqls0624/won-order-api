import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCustomQRDto {
  @ApiProperty({ description: '핸드폰번호', required: true })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ description: '주소', required: true })
  @IsString()
  address: string;

  @ApiProperty({ description: '이름', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '링크', required: false })
  @IsOptional()
  @IsString()
  map_url: string;

  @ApiProperty({ description: '이름', required: true })
  @IsOptional()
  @IsString()
  memo: string;
}
