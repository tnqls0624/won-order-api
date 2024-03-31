import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ImageEntity } from './image.entity';

export class MenuOnImageEntity {
  @ApiProperty({
    required: true,
    type: 'number',
    description: '이미지 아이디',
    example: 1
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '메뉴 카테고리 아이디',
    example: 1
  })
  @IsNumber()
  menu_id: number;

  @ApiProperty({
    required: true,
    type: 'number',
    description: '이미지 아이디',
    example: 1
  })
  @IsNumber()
  image_id: number;

  create_at: Date;

  update_at: Date;

  image: ImageEntity[];
}
