import {
  Body,
  Controller,
  Delete,
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
import CustomError from 'src/common/error/custom-error';
import { ResponseDto } from 'src/common/response/response.dto';
import { RESULT_CODE } from 'src/constant';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateNoticeCommand } from '../application/command/create-notice.command';
import { DeleteNoticeCommand } from '../application/command/delete-notice.command';
import { FindAllNoticeQuery } from '../application/query/find-all-notice.query';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { UpdateNoticeCommand } from '../application/command/update-notice-command';
import { PaginateParsePipe } from '../../utils/pipe';
import { PageOptionsDto } from '../../utils/paginate/dto';
import { FindNoticeQuery } from '../application/query/find-notice-query';
import { FindAllNoticeForUserQuery } from '../application/query/find-all-notice-for-user.query';
import { FindAllNoticeForUserParams } from './param/find-all-notice-for-user.params';
import { UpdateNoticeIndexesDto } from './dto/update-notice-index.dto';
import { UpdateNoticeIndexCommand } from '../application/command/update-notice-index-command';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadImageCommand } from '../application/command/upload-image.command';
import { FastifyRequest } from 'fastify';

@ApiTags('NOTICE')
@Controller('notice')
export class NoticeController {
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
  @ApiOperation({ summary: '공지사항 생성 (master)' })
  @Post('/')
  async createNotice(@User() admin: AdminDto, @Body() body: CreateNoticeDto) {
    if (!admin.type) throw new CustomError(RESULT_CODE.NOT_PERMISSION);

    return this.commandBus.execute(new CreateNoticeCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 삭제 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '공지사항 아이디',
    type: 'string'
  })
  @Delete('/:id')
  async deleteNotice(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (!admin.type) throw new CustomError(RESULT_CODE.NOT_PERMISSION);

    return this.commandBus.execute(new DeleteNoticeCommand(admin, id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 전체 조회' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: '그룹 아이디 (전체 조회는 넣지 않음)',
    type: 'string'
  })
  @ApiQuery({
    name: 'market_id',
    required: false,
    description: '그룹 아이디 (전체 조회는 넣지 않음)',
    type: 'string'
  })
  @Get('/')
  async findAllNotice(
    @Query('id') group_id: string,
    @Query('market_id') market_id: string,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    return this.queryBus.execute(
      new FindAllNoticeQuery(Number(group_id), Number(market_id), page_options)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '팝업 공지사항 전체 조회 (유저)' })
  @Get('/user/popup')
  async findAllNoticeForUser(@Query() params: FindAllNoticeForUserParams) {
    return this.queryBus.execute(
      new FindAllNoticeForUserQuery(Number(params.group_id))
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 수정 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '공지사항 아이디',
    type: 'string'
  })
  @Post('/:id')
  async updateNotice(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNoticeDto
  ) {
    if (!admin.type) throw new CustomError(RESULT_CODE.NOT_PERMISSION);

    return this.commandBus.execute(new UpdateNoticeCommand(id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 순서 수정 (master)' })
  @Post('/index')
  async updateNoticeIndex(
    @User() admin: AdminDto,
    @Body() body: UpdateNoticeIndexesDto
  ) {
    if (!admin.type) throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateNoticeIndexCommand(body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 상세' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '공지사항 아이디',
    type: 'string'
  })
  @Get('/:id')
  async findNotice(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.queryBus.execute(new FindNoticeQuery(id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '공지사항 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 파일',
    type: UploadImageDto
  })
  @Post('/upload/image')
  async uploadImage(@Req() req: FastifyRequest) {
    console.log('----------------------------');
    const data = await req.file();
    console.log(`data: ${data}`);
    const fileBuffer = await data?.toBuffer();
    console.log('----------------------------');
    return this.commandBus.execute(
      new UploadImageCommand(data?.filename as string, fileBuffer as Buffer)
    );
  }
}
