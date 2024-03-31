import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum MenuCategoryStatus {
  BLIND = 'BLIND',
  FOR_SALE = 'FOR_SALE'
}

export class CreateMenuCategoryDto {
  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsNumber()
  group_id: number;

  @ApiProperty({ description: '스테이터스', required: true })
  @IsEnum(MenuCategoryStatus)
  status: MenuCategoryStatus;

  @ApiProperty({ description: '이름', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  content: string;

  static of(
    group_id: number,
    status: MenuCategoryStatus,
    name: string,
    content: string
  ): CreateMenuCategoryDto {
    const dto = new CreateMenuCategoryDto();
    dto.group_id = group_id;
    dto.status = status;
    dto.name = name;
    dto.content = content;
    return dto;
  }
}
