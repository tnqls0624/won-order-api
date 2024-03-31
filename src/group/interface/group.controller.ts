import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import CustomError from 'src/common/error/custom-error';
import { ResponseDto } from 'src/common/response/response.dto';
import { RESULT_CODE } from 'src/constant';
import { AdminType } from 'src/types/login.type';
import { CreateGroupCommand } from '../application/command/create-group.command';
import { DeleteGroupCommand } from '../application/command/delete-group.command';
import { SelectGroupCommand } from '../application/command/select-group.command';
import { UpdateGroupCommand } from '../application/command/update-group.command';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateSelectGroupDto } from './dto/update-select-group.dto';
import { FindAllGroupQuery } from '../application/query/find-all-group.query';
import { FindGroupQuery } from '../application/query/find-group.query';
import { FindGroupTlQuery } from '../application/query/find-group-tl.query';
import { UpdateGroupTlsDto } from './dto/update-group-tl.dto';
import { UpdateGroupTlCommand } from '../application/command/update-group-tl.command';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { FindAllGroupUserQuery } from '../application/query/find-all-group-user.query';

@ApiTags('GROUP')
@Controller('group')
export class GroupController {
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
  @ApiOperation({ summary: '그룹 생성 (master)' })
  @Post('/')
  async createGroup(@User() admin: AdminDto, @Body() body: CreateGroupDto) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateGroupCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 선택 (EMPROYEE)' })
  @Post('/select')
  async selectGroup(
    @User() admin: AdminDto,
    @Body() body: UpdateSelectGroupDto
  ) {
    if (AdminType.EMPLOYEE !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new SelectGroupCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 전체 조회' })
  @Get('/')
  async findAllGroup(@User() admin: AdminDto) {
    return this.queryBus.execute(new FindAllGroupQuery(admin));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 전체 조회(user)' })
  @ApiQuery({
    name: 'market_id',
    required: true,
    type: 'string',
    description: '마켓 아이디'
  })
  @Get('/find/all')
  async findAllGroupUser(@Query('market_id') market_id: number) {
    return this.queryBus.execute(new FindAllGroupUserQuery(market_id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 단일 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '그룹 아이디',
    type: 'string'
  })
  @Get('/:id')
  async findGroup(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new FindGroupQuery(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 수정' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '그룹 아이디',
    type: 'string'
  })
  @Put('/:id')
  async updateGroup(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto
  ) {
    return this.commandBus.execute(new UpdateGroupCommand(admin, id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 삭제' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '그룹 아이디',
    type: 'string'
  })
  @Delete('/:id')
  async deleteGroup(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.commandBus.execute(new DeleteGroupCommand(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 번역 찾기 (master)' })
  @ApiParam({
    name: 'group_id',
    required: true,
    description: '그룹 아이디',
    type: 'string'
  })
  @Get('/:group_id/tl')
  async findGroupTl(
    @User() admin: AdminDto,
    @Param('group_id', ParseIntPipe) group_id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindGroupTlQuery(group_id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '그룹 번역 수정 (master)' })
  @Put('/tl/update')
  async updateMenuOptionCategoryTl(
    @User() admin: AdminDto,
    @Body() body: UpdateGroupTlsDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateGroupTlCommand(body));
  }
}
