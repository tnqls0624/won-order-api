import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseDto } from 'src/common/response/response.dto';
import { UpdateSettingCommand } from '../application/command/update-setting.command';
import { FindSettingQuery } from '../application/query/find-setting.query';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { FastifyRequest } from 'fastify';
import { UploadLogoImageCommand } from '../application/command/upload-logo-image.command';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { UploadImageDto } from 'src/notice/interface/dto/upload-image.dto';

@ApiTags('SETTING')
@Controller('setting')
export class SettingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '설정 수정' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '설정 아이디',
    type: 'string'
  })
  @Post('/:id')
  async updateGroup(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSettingDto
  ) {
    return this.commandBus.execute(new UpdateSettingCommand(admin, id, body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '설정 찾기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '마켓 아이디',
    type: 'string'
  })
  @Get('/:id')
  async findGroup(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new FindSettingQuery(id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '로고 등록' })
  @ApiQuery({
    name: 'group_id',
    required: true,
    description: '그룹 아이디',
    type: 'string'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 파일',
    type: UploadImageDto
  })
  @Post('/logo/upload')
  async uploadLogo(
    @Req() req: FastifyRequest,
    @Query('group_id') group_id: number
  ) {
    const data = await req.file();
    const fileBuffer = await data?.toBuffer();
    return this.commandBus.execute(
      new UploadLogoImageCommand(
        data?.filename as string,
        fileBuffer as Buffer,
        group_id
      )
    );
  }
}
