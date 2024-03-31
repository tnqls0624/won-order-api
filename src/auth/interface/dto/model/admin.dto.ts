import { ApiProperty } from '@nestjs/swagger';
import { AdminType } from 'src/types/login.type';

type admin_group = {
  id: number;
  group: {
    id: number;
    name: string;
    content: string;
  };
  selected: boolean;
};

export class AdminDto {
  @ApiProperty({ description: '아이디' })
  id: number;

  @ApiProperty({ description: '가맹점 아이디' })
  market_id: number;

  @ApiProperty({ description: '언어 아이디' })
  language_id: number;

  @ApiProperty({ description: '어드민 타입' })
  type: AdminType;

  @ApiProperty({ description: '어드민 아이디' })
  admin_id: string;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '삭제날짜' })
  remove_at: Date;

  admin_group: admin_group[];

  static of(
    id: number,
    market_id: number,
    language_id: number,
    type: AdminType,
    admin_id: string,
    nickname: string
  ): AdminDto {
    const dto = new AdminDto();
    dto.id = id;
    dto.market_id = market_id;
    dto.language_id = language_id;
    dto.type = type;
    dto.admin_id = admin_id;
    dto.nickname = nickname;
    return dto;
  }
}
