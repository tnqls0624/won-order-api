import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserResDto {
  @ApiProperty({ description: '아이디', required: true })
  @IsNumber()
  private readonly id: number;

  @ApiProperty({ description: '휴대폰 번호', required: true })
  @IsString()
  private readonly phone: string;

  @ApiProperty({ description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  private readonly nickname: string;

  @ApiProperty({ description: '주소 ( 선택 )', required: false })
  @IsOptional()
  @IsString()
  private readonly address: string;

  constructor() {}

  get _id(): number {
    return this.id;
  }

  get _phone(): string {
    return this.phone;
  }

  get _nickname(): string {
    return this.nickname;
  }

  get _address(): string {
    return this.address;
  }
}
