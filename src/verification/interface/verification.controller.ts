import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response/response.dto';
import { VerificationType } from 'src/types/verification.type';
import { RequestSmsCommand } from '../application/command/request-sms.command';
import { VerifySmsCommand } from '../application/command/verify-sms.command';
import { SmsAuthRequestDto } from './dto/sms-auth-request.dto';
import { SmsAuthVerifyDto } from './dto/sms-auth-verify.dto';

@ApiTags('VERIFICATION')
@Controller('verification')
export class VerificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'SMS 인증 요청' })
  @ApiParam({
    name: 'type',
    required: true,
    description: '인증타입',
    enum: VerificationType
  })
  @Post('/sms/request/:type')
  requestSmsAuth(
    @Param('type', new ParseEnumPipe(VerificationType)) type: VerificationType,
    @Body() body: SmsAuthRequestDto
  ) {
    return this.commandBus.execute(new RequestSmsCommand(type, body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'SMS 인증 검증' })
  @ApiParam({
    name: 'type',
    required: true,
    description: '인증타입',
    enum: VerificationType
  })
  @Post('/sms/verify/:type')
  async verifySmsAuth(
    @Param('type', new ParseEnumPipe(VerificationType)) type: VerificationType,
    @Body() body: SmsAuthVerifyDto
  ) {
    return this.commandBus.execute(new VerifySmsCommand(type, body));
  }
}
