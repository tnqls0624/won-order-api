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
import { AdminType } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import CustomError from 'src/common/error/custom-error';
import { ResponseDto } from 'src/common/response/response.dto';
import { RESULT_CODE } from 'src/constant';
import { CreateMenuCategoryCommand } from '../application/command/create-menu-category.command';
import { CreateMenuCommand } from '../application/command/create-menu.command';
import { DeleteMenuCategoryCommand } from '../application/command/delete-menu-category.command';
import { DeleteMenuCommand } from '../application/command/delete-menu.command';
import { UpdateMenuCategoryCommand } from '../application/command/update-menu-category.command';
import { UpdateMenuCommand } from '../application/command/update-menu.command';
import { UploadMenuImageCommand } from '../application/command/upload-menu-image.command';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { FindAllMenuCategoryQuery } from '../application/query/find-all-menu-category.query';
import { FindAllMenuQuery } from '../application/query/find-all-menu.query';
import { FindAllUserMenuQuery } from '../application/query/find-all-user-menu.query';
import { FindMenuCategoryQuery } from '../application/query/find-menu-category.query';
import { FindMenuQuery } from '../application/query/find-menu.query';
import { UpdateMenuCategoryIndexesDto } from './dto/update-menu-category-index.dto';
import { UpdateMenuCategoryIndexCommand } from '../application/command/update-menu-category-index.command';
import { UpdateMenuIndexesDto } from './dto/update-menu-index.dto';
import { UpdateMenuIndexCommand } from '../application/command/update-menu-index.command';
import { MenuStatus } from '../infrastructure/entity/menu.entity';
import { FindMenuTlQuery } from '../application/query/find-menu-tl.query';
import { UpdateMenuTlsDto } from './dto/update-menu-tl.dto';
import { UpdateMenuTlCommand } from '../application/command/update-menu-tl.command';
import { FindMenuOptionTlQuery } from '../application/query/find-menu-option-tl.query';
import { UpdateMenuOptionTlsDto } from './dto/update-menu-option-tl.dto';
import { UpdateMenuOptionTlCommand } from '../application/command/update-menu-option-tl.command';
import { FindMenuCategoryTlQuery } from '../application/query/find-menu-category-tl.query';
import { UpdateMenuCategoryTlsDto } from './dto/update-menu-category-tl.dto';
import { UpdateMenuCategoryTlCommand } from '../application/command/update-menu-category-tl.command';
import { FindMenuOptionCategoryTlQuery } from '../application/query/find-menu-option-category-tl.query';
import { UpdateMenuOptionCategoryTlsDto } from './dto/update-menu-option-category-tl.dto';
import { UpdateMenuOptionCategoryTlCommand } from '../application/command/update-menu-option-category-tl.command';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { UploadImageDto } from 'src/notice/interface/dto/upload-image.dto';

@ApiTags('MENU')
@Controller('menu')
export class MenuController {
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
  @ApiOperation({ summary: '메뉴 카테고리 생성 (master)' })
  @Post('/category')
  async createMenuCategory(
    @User() admin: AdminDto,
    @Body() body: CreateMenuCategoryDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateMenuCategoryCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '모든 메뉴 카테고리 찾기 (master)' })
  @Get('/category')
  async findAllMenuCategory(@User() admin: AdminDto) {
    return this.queryBus.execute(new FindAllMenuCategoryQuery(admin));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 메뉴 카테고리 찾기 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 카테고리 아이디',
    type: 'string'
  })
  @Get('/category/:id')
  async findMenuCategory(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.queryBus.execute(new FindMenuCategoryQuery(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 수정 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 카테고리 아이디',
    type: 'string'
  })
  @Put('/category/:id')
  async updateMenuCategory(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMenuCategoryDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(
      new UpdateMenuCategoryCommand(admin, id, body)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 순서변경 (master)' })
  @Put('/category/index')
  async updateMenuCategoryIndex(
    @User() admin: AdminDto,
    @Body() body: UpdateMenuCategoryIndexesDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(
      new UpdateMenuCategoryIndexCommand(admin, body)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 삭제 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 카테고리 아이디',
    type: 'string'
  })
  @Delete('/category/:id')
  async deleteMenuCategory(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new DeleteMenuCategoryCommand(admin, id));
  }

  //////////////////////////  메뉴 카테고리  ///////////////////////////////////
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 생성 (master)' })
  @Post('/')
  async createMenu(@User() admin: AdminDto, @Body() body: CreateMenuDto) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateMenuCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '카테고리별 모든 메뉴 찾기 (master) ' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 카테고리 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '메뉴 스테이터스',
    enum: MenuStatus
  })
  @Get('/category/:id/all/')
  async findAllMenu(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: string
  ) {
    return this.queryBus.execute(new FindAllMenuQuery(admin, id, status));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '모든 메뉴 찾기 (user) ' })
  @ApiQuery({
    name: 'market_id',
    required: true,
    description: '마켓 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'language_code',
    required: true,
    description: '언어 코드 (한국 : ko, 캄보디아 : km, 미국 : en, 중국 : zh )',
    type: 'string'
  })
  @Get('/user/all/')
  async findAllUserMenu(
    @Query('market_id', ParseIntPipe) market_id: number,
    @Query('language_code') language_code: string
  ) {
    return this.queryBus.execute(
      new FindAllUserMenuQuery(market_id, language_code)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 메뉴 찾기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 아이디',
    type: 'string'
  })
  @Get('/:id')
  async findMenu(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.queryBus.execute(new FindMenuQuery(admin, id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 수정 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 아이디',
    type: 'string'
  })
  @Put('/:id')
  async updateMenu(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMenuDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuCommand(admin, id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 순서변경 (master)' })
  @Put('/index/all')
  async updateMenuIndex(
    @User() admin: AdminDto,
    @Body() body: UpdateMenuIndexesDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuIndexCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 삭제 (master)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '메뉴 아이디',
    type: 'string'
  })
  @Delete('/:id')
  async deleteMenu(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new DeleteMenuCommand(admin, id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 이미지 업로드 (master)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 파일',
    type: UploadImageDto
  })
  @Post('upload')
  async uploadImage(@Req() req: FastifyRequest) {
    const data = await req.file();
    const fileBuffer = await data?.toBuffer();
    return this.commandBus.execute(
      new UploadMenuImageCommand(data?.filename as string, fileBuffer as Buffer)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 번역 찾기 (master)' })
  @ApiParam({
    name: 'menu_id',
    required: true,
    description: '메뉴 아이디',
    type: 'string'
  })
  @Get('/:menu_id/tl')
  async findMenuTl(
    @User() admin: AdminDto,
    @Param('menu_id', ParseIntPipe) menu_id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindMenuTlQuery(menu_id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 번역 수정 (master)' })
  @Put('/tl/update')
  async updateMenuTl(@User() admin: AdminDto, @Body() body: UpdateMenuTlsDto) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuTlCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 옵션 번역 찾기 (master)' })
  @ApiParam({
    name: 'menu_option_id',
    required: true,
    description: '메뉴 옵션 아이디',
    type: 'string'
  })
  @Get('/option/:menu_option_id/tl')
  async findMenuOptionTl(
    @User() admin: AdminDto,
    @Param('menu_option_id', ParseIntPipe) menu_option_id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindMenuOptionTlQuery(menu_option_id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 번역 수정 (master)' })
  @Put('/option/tl/update')
  async updateMenuOptionTl(
    @User() admin: AdminDto,
    @Body() body: UpdateMenuOptionTlsDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuOptionTlCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 번역 찾기 (master)' })
  @ApiParam({
    name: 'menu_category_id',
    required: true,
    description: '메뉴 카테고 아이디',
    type: 'string'
  })
  @Get('/category/:menu_category_id/tl')
  async findMenuCategoryTl(
    @User() admin: AdminDto,
    @Param('menu_category_id', ParseIntPipe) menu_category_id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindMenuCategoryTlQuery(menu_category_id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 번역 수정 (master)' })
  @Put('/category/tl/update')
  async updateMenuCategoryTl(
    @User() admin: AdminDto,
    @Body() body: UpdateMenuCategoryTlsDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuCategoryTlCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 옵션 카테고리 번역 찾기 (master)' })
  @ApiParam({
    name: 'menu_option_category_id',
    required: true,
    description: '메뉴 옵션 카테고리 아이디',
    type: 'string'
  })
  @Get('/option/category/:menu_option_category_id/tl')
  async findMenuOptionCategoryTl(
    @User() admin: AdminDto,
    @Param('menu_option_category_id', ParseIntPipe)
    menu_option_category_id: number
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(
      new FindMenuOptionCategoryTlQuery(menu_option_category_id)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '메뉴 카테고리 번역 수정 (master)' })
  @Put('/option/category/tl/update')
  async updateMenuOptionCategoryTl(
    @User() admin: AdminDto,
    @Body() body: UpdateMenuOptionCategoryTlsDto
  ) {
    if (AdminType.MASTER !== admin.type)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMenuOptionCategoryTlCommand(body));
  }
}
