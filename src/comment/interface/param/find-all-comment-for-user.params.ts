import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllCommentForUserParams {
  @ApiPropertyOptional({
    required: false,
    type: 'string',
    description: '그룹 아이디',
    example: '1'
  })
  @IsString()
  @IsOptional()
  group_id: string | number;
  @ApiPropertyOptional({
    required: false,
    type: 'boolean',
    description: '답변상태 (true = 답변완료, false = 미답변, null = 전체)'
  })
  @IsOptional()
  has_reply: string | boolean;
  @ApiPropertyOptional({
    required: false,
    type: 'boolean',
    description:
      '비밀글 제외 (true = 비밀글 제외, false = 비밀글만 보기, null = 전체)'
  })
  @IsOptional()
  exclude_secret: string | boolean;

  @ApiPropertyOptional({
    required: false,
    type: 'boolean',
    description:
      '내글 보기 (true = 내가 작성한 글만 봅니다. (로그인 상태만 가능), false = 전체글)',
    example: 'false'
  })
  @IsOptional()
  only_my_comment: string | boolean;
}
