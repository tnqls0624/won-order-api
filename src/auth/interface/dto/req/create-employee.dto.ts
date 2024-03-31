import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { UpdateSelectGroupDto } from 'src/group/interface/dto/update-select-group.dto';

export class CreateEmployeeDto extends UpdateSelectGroupDto {
  @ApiProperty({ description: '가맹점 아이디', required: true })
  @IsNumber()
  market_id: number;

  @ApiProperty({ description: '어드민 아이디', required: true })
  @IsString()
  admin_id: string;

  @ApiProperty({ description: '패스워드', required: true })
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', required: true })
  @IsString()
  nickname: string;
}
