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
import { AdminType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import CustomError from 'src/common/error/custom-error';
import { ResponseDto } from 'src/common/response/response.dto';
import { RESULT_CODE } from 'src/constant';
import { CreateTableCommand } from '../application/command/create-table.command';
import { DeleteTableCommand } from '../application/command/delete-table.command';
import { CreateTableDto } from './dto/create-table.dto';
import { CreateQRCodeQuery } from '../application/query/create-qr-code.query';
import { FindAllTableQuery } from '../application/query/find-all-table.query';
import { FindAllTableForEmployeeQuery } from '../application/query/find-all-table-for-employee.query';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { CreateCustomQRDto } from './dto/create-custom-qr.dto';
import { CreateCustomQRCommand } from '../application/command/create-custom-qr.command';
import { FindAllCustomQRQuery } from '../application/query/find-all-custom-qr.query';
import { PaginateParsePipe } from 'src/utils/pipe';
import { PageOptionsDto } from 'src/utils/paginate/dto';
import { FindCustomQRQuery } from '../application/query/find-custom-qr.query';
import { DeleteCustomQRCommand } from '../application/command/delete-custom-qr.command';
import { CreateCustomQRQuery } from '../application/query/create-custom-qr.query';
import { UpdateCustomQRCommand } from '../application/command/update-custom-qr.command';
import { FindTableQuery } from '../application/query/find-table.query';

@ApiTags('TABLE')
@Controller('table')
export class TableController {
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
  @ApiOperation({ summary: '테이블 생성 (master)' })
  @Post('/')
  async createTable(@User() admin: AdminDto, @Body() body: CreateTableDto) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateTableCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '테이블 전체 조회' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: '그룹 아이디 (전체 조회는 넣지 않음)',
    type: 'string'
  })
  @Get('/')
  async findAllTable(
    @User() admin: AdminDto,
    @Query('id') group_id: string,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    return this.queryBus.execute(
      new FindAllTableQuery(admin, Number(group_id), page_options)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '테이블 단일 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '테이블 아이디'
  })
  @Get('/:id')
  async findTable(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new FindTableQuery(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '테이블 전체 조회(점원용)' })
  @Get('/find/all/for-employee')
  async findAllTableForEmployee(@User() admin: AdminDto) {
    return this.queryBus.execute(new FindAllTableForEmployeeQuery(admin));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'QR Code 발급' })
  @ApiParam({
    name: 'id',
    required: false,
    description: '테이블 아이디',
    type: 'string'
  })
  @Get('/qr-code/:id')
  async createQRCode(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new CreateQRCodeQuery(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'Custom QR Code 저장' })
  @Post('/custom/qr-code')
  async createCustomQRCode(
    @User() admin: AdminDto,
    @Body() body: CreateCustomQRDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateCustomQRCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'Custom QR Code All 찾기' })
  @Get('/custom/all/qr-code')
  async findAllCustomQRCode(
    @User() admin: AdminDto,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    return this.queryBus.execute(new FindAllCustomQRQuery(admin, page_options));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 Custom QR Code 찾기' })
  @ApiParam({
    name: 'id',
    required: false,
    description: 'custom qr 아이디',
    type: 'string'
  })
  @Get('/custom/qr-code/:id')
  async findCustomQRCode(@Param('id') id: number) {
    return this.queryBus.execute(new FindCustomQRQuery(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 Custom QR Code 삭제' })
  @ApiParam({
    name: 'id',
    required: false,
    description: 'custom qr 아이디',
    type: 'string'
  })
  @Delete('/custom/qr-code/:id')
  async deleteCustomQRCode(@User() admin: AdminDto, @Param('id') id: number) {
    return this.commandBus.execute(new DeleteCustomQRCommand(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: 'Custom QR Code 수정' })
  @ApiParam({
    name: 'id',
    required: false,
    description: 'custom qr 아이디',
    type: 'string'
  })
  @Put('/custom/qr-code/:id')
  async updateCustomQRCode(
    @User() admin: AdminDto,
    @Param('id') id: number,
    @Body() body: CreateCustomQRDto
  ) {
    return this.commandBus.execute(new UpdateCustomQRCommand(admin, id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 Custom QR Code 발급' })
  @ApiParam({
    name: 'id',
    required: false,
    description: 'custom qr 아이디',
    type: 'string'
  })
  @Get('/custom/qr-code/:id/issue')
  async getCustomQRCode(@User() admin: AdminDto, @Param('id') id: number) {
    return this.queryBus.execute(new CreateCustomQRQuery(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '테이블 삭제 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '테이블 아이디',
    type: 'string'
  })
  @Delete('/:id')
  async deleteTable(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new DeleteTableCommand(admin, id));
  }
}
