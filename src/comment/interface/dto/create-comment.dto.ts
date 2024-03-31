import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '내용', required: true })
  @IsString()
  content: string;
  @ApiProperty({ description: '비밀글 여부', required: true })
  @IsBoolean()
  is_secret: boolean;
  @ApiProperty({
    description: '게시글 조회/수정/삭제 비밀번호(비회원 필수)',
    required: false
  })
  @IsString()
  @IsOptional()
  password: string;
  @ApiProperty({ description: '그룹 아이디', required: true })
  @IsNumber()
  group_id: number;

  @ApiProperty({
    description: '작성자 [비회원 필수]',
    required: false
  })
  @IsOptional()
  @IsString()
  writer_name: string;
}
