import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ description: '휴대폰 번호' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ description: '주소' })
  @IsOptional()
  @IsString()
  address: string;
}
