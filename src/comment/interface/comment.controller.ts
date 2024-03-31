import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response/response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCommentCommand } from '../application/command/create-comment.command';
import { JwtAuthGuard } from '../../auth/guard';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { User } from '../../common/decorators/user.decorator';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { ReplyCommentCommand } from '../application/command/reply-comment.command';
import { PaginateParsePipe } from '../../utils/pipe';
import { PageOptionsDto } from '../../utils/paginate/dto';
import { FindAllCommentForUserParams } from './param/find-all-comment-for-user.params';
import { FindAllCommentForUserQuery } from '../application/query/find-all-comment-for-user.query';
import { UserInfo } from '../../common/decorators/userInfo.decorator';
import { UserDto } from '../../auth/interface/dto/model/user.dto';
import { FindOneCommentQuery } from '../application/query/find-one-comment.query';
import CustomError from '../../common/error/custom-error';
import { RESULT_CODE } from '../../constant';
import { DeleteCommentCommand } from '../application/command/delete-comment.command';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateCommentContentCommand } from '../application/command/update-comment-content-command';

@ApiTags('COMMENT')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: '문의글 생성 (비회원,회원)' })
  @Post('/')
  async createComment(
    @Body() body: CreateCommentDto,
    @UserInfo() info: Promise<UserDto> | null
  ) {
    return this.commandBus.execute(new CreateCommentCommand(info, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '답글 생성 (어드민)' })
  @Post('/reply')
  async createReply(@User() admin: AdminDto, @Body() body: ReplyCommentDto) {
    if (!admin.type) throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new ReplyCommentCommand(admin, body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: '문의글 전체 조회 (비회원, 회원)' })
  @Get('/')
  async findAllComment(
    @Query() params: FindAllCommentForUserParams,
    @UserInfo() info: Promise<UserDto> | null,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    const { only_my_comment, exclude_secret, has_reply, group_id } = params;
    if (only_my_comment) {
      params.only_my_comment = only_my_comment === 'true';
    }
    if (exclude_secret) {
      params.exclude_secret = exclude_secret === 'true';
    }
    if (has_reply) {
      params.has_reply = has_reply === 'true';
    }
    if (group_id) {
      params.group_id = Number(group_id);
    }

    return this.queryBus.execute(
      new FindAllCommentForUserQuery(params, info, page_options)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    required: true,
    description: '문의글 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'password',
    required: false,
    description: '문의글 비밀번호',
    type: 'string'
  })
  @ApiOperation({ summary: '문의글 상세 조회 (비회원, 회원)' })
  @Get('/:id')
  async findOneComment(
    @Query('id') id: string,
    @Query('password') password: string,
    @UserInfo() info: Promise<UserDto> | null
  ) {
    return this.queryBus.execute(
      new FindOneCommentQuery(info, password, Number(id))
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    required: true,
    description: '문의글 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'password',
    required: false,
    description: '문의글 비밀번호',
    type: 'string'
  })
  @ApiOperation({ summary: '문의글 삭제 (비회원, 회원)' })
  @Delete('/:id')
  async deleteComment(
    @Query('id') id: string,
    @Query('password') password: string,
    @UserInfo() info: Promise<UserDto> | null
  ) {
    return this.commandBus.execute(
      new DeleteCommentCommand(info, password, Number(id))
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    required: true,
    description: '문의글 아이디',
    type: 'string'
  })
  @ApiOperation({ summary: '문의글 수정 (비회원, 회원)' })
  @Put('/:id')
  async updateComment(
    @Query('id') id: string,
    @Body() body: UpdateCommentDto,
    @UserInfo() info: Promise<UserDto> | null
  ) {
    return this.commandBus.execute(
      new UpdateCommentContentCommand(info, Number(id), body)
    );
  }
}
