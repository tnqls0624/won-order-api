import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UpdateSelectGroupDto } from 'src/group/interface/dto/update-select-group.dto';

export enum Language {
  KM = 'km',
  KO = 'ko',
  EN = 'en'
}

export class UpdateEmployeeSelectDto extends UpdateSelectGroupDto {
  @ApiProperty({ description: '닉네임' })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '언어', enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language: Language;
}
