import { IsOptional, IsString } from 'class-validator';

export class OauthAppleCallbackDto {
  @IsString()
  code: string;

  @IsString()
  state: string;

  // Add 'user' nested object
  @IsOptional()
  user: string;
}
