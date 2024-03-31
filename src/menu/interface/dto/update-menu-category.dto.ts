import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum MenuCategoryStatus {
  BLIND = 'BLIND',
  FOR_SALE = 'FOR_SALE'
}

export class UpdateMenuCategoryDto {
  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsOptional()
  @IsNumber()
  group_id: number;

  @ApiProperty({ description: '스테이터스', required: false })
  @IsOptional()
  @IsEnum(MenuCategoryStatus)
  status: MenuCategoryStatus;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: '내용', required: false })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ description: '순서', required: false })
  @IsOptional()
  @IsNumber()
  index: number;
}
