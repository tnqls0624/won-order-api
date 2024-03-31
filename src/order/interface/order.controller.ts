import {
  Controller,
  Logger,
  Post,
  Body,
  Get,
  Query,
  Headers,
  UseGuards,
  Param,
  Put,
  ParseIntPipe,
  Req
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { PaginateParsePipe } from 'src/utils/pipe';
import { ResponseDto } from '../../common/response/response.dto';
import { CreateOrderCommand } from '../application/command/create-order.command';
import { UpdateMainOrderStatusCommand } from '../application/command/update-main-order-status.command';
import { UpdateOrderGroupPaymentsStatusCommand } from '../application/command/update-order-group-payments-status.command';
import { UpdateOrderMenuCommand } from '../application/command/update-order-menu.command';
import { UpdateOrderCommand } from '../application/command/update-order.command';
import { FindAllMainOrdersAdminQuery } from '../application/query/find-all-main-order-admin.query';
import { FindAllMainOrdersQuery } from '../application/query/find-all-main-order.query';
import { FindMainOrderAdminQuery } from '../application/query/find-main-order-admin.query';
import { FindMainOrderQuery } from '../application/query/find-main-order.query';
import { FindSalesQuery } from '../application/query/find-sales.query';
import { OrderMenuStatus } from '../infrastructure/entity/order-menu.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateMainOrderStatusDto } from './dto/update-main-order-status.dto';
import { UpdateOrderGroupPaymentStatusDto } from './dto/update-order-group-status.dto';
import { UpdateOrderMenuStatusDto } from './dto/update-order-menu-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrdersAdminParams } from './param/find-orders-admin.params';
import { FindOrdersParams } from './param/find-orders.params';
import { FindSalesParams } from './param/find-sales.params';
import { UpdateMainOrderStatusForUserCommand } from '../application/command/update-main-order-status-for-user.command';
import { UpdateOrderMenuQuantityCommand } from '../application/command/update-order-menu-quantity.command';
import { PageOptionsDto } from 'src/utils/paginate/dto/page-options.dto';
import * as geoip from 'geoip-lite';
import { UpdateOrderTransactionCommand } from '../application/command/update-order-transaction.command';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';
import { UpdateAllOrderStatusCommand } from 'src/auth/application/command/update-all-order-status.command';
import { CreateSaleStatsCommand } from 'src/auth/application/command/create-sale-stats.command';
import { FindProductsQuery } from '../application/query/find-products.query';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';
import { FindDashboardSalesTotalQuery } from '../application/query/find-dashboard-sales-total.query';
import { FindDashboardSalesMenusQuery } from '../application/query/find-dashboard-sales-menus.query';
import { FindDashboardSalesRankQuery } from '../application/query/find-dashboard-sales-rank.query';
import { RefundAbaOrderCommand } from '../application/command/refund-aba-order.command';
import { RefundOrderCommand } from '../application/command/refund-order.command';

@ApiTags('ORDER')
@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService
  ) {}

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문 정보 생성'
  })
  @Post('/')
  async createOrder(
    @Headers('authorization') authorization: string,
    @Body() body: CreateOrderDto
  ) {
    let token: string = '';
    if (authorization) {
      token = authorization.split(' ')[1];
      const payload = this.jwtService.decode(token);
      body.user_id = payload ? payload['id'] : undefined;
    }
    if (!body.user_id && !body.guest_id) {
      throw new CustomError(RESULT_CODE.USER_ID_OR_GUEST_ID_IS_REQUERE);
    }
    return this.commandBus.execute(new CreateOrderCommand(body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: 'ABA 은행 결제 환불'
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: '소주문 아이디',
    type: 'string'
  })
  @Post('/transaction/aba/refund')
  async refundAbaOrder(@Query('id') id: number) {
    return this.commandBus.execute(new RefundAbaOrderCommand(id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '환불'
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: '대주문 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'group_id',
    required: false,
    description: '그룹 아이디',
    type: 'string'
  })
  @Post('/transaction/refund')
  async refundOrder(
    @Query('id') id: number,
    @Query('group_id') group_id: number
  ) {
    return this.commandBus.execute(new RefundOrderCommand(id, group_id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: 'ABA 은행 노티 푸시'
  })
  @ApiQuery({
    name: 'tran_id',
    required: false,
    description: '주문 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '스테이터스',
    type: 'string'
  })
  @ApiQuery({
    name: 'apv',
    required: false,
    description: '가격',
    type: 'string'
  })
  @Post('/transaction/aba/push-back')
  async pushBackOrder(@Body() body: UpdateOrderTransactionDto) {
    return this.commandBus.execute(new UpdateOrderTransactionCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문 정보 수정'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @Put('/:main_order_id')
  async updateOrder(
    @User() admin: AdminDto,
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Body() body: UpdateOrderDto
  ) {
    return this.commandBus.execute(
      new UpdateOrderCommand(admin, main_order_id, body)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문 메뉴 수량 업데이트'
  })
  @ApiParam({
    name: 'order_menu_id',
    required: true,
    description: '주문 메뉴 아이디',
    type: 'string'
  })
  @ApiParam({
    name: 'quantity',
    required: true,
    description: '갯수',
    type: 'string'
  })
  @Put(
    'update/main/:main_order_id/order_menu/:order_menu_id/quantity/:quantity'
  )
  async updateOrderMenuQuantity(
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Param('order_menu_id', ParseIntPipe) order_menu_id: number,
    @Param('quantity', ParseIntPipe) quantity: number
  ) {
    return this.commandBus.execute(
      new UpdateOrderMenuQuantityCommand(main_order_id, order_menu_id, quantity)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary:
      '대주문 상태 업데이트(대기(WAIT)/완료(COMPLETE)/진행(PROGRESS)/취소(CANCEL))'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @Put('update/main/:main_order_id')
  async updateMainOrderStatus(
    @User() admin: AdminDto,
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Body() body: UpdateMainOrderStatusDto
  ) {
    return this.commandBus.execute(
      new UpdateMainOrderStatusCommand(admin, main_order_id, body)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary:
      '[유저용] 대주문 상태 업데이트(대기(WAIT)/완료(COMPLETE)/진행(PROGRESS)/취소(CANCEL))'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @Put('user/update/main/:main_order_id')
  async updateMainOrderStatusForUser(
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Body() body: UpdateMainOrderStatusDto
  ) {
    return this.commandBus.execute(
      new UpdateMainOrderStatusForUserCommand(main_order_id, body)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary:
      '주문 그룹 상태 업데이트(미정산(NOT_PAID)/정산(PAID)) - 전부 정산 시 대주문 완료 처리됨'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @ApiParam({
    name: 'order_group_payment_ids',
    required: true,
    description: '주문 그룹 결재 아이디',
    type: 'string',
    example: '1,2'
  })
  @Put('update/main/:main_order_id/payment/:order_group_payment_ids')
  async updateOrderGroupStatus(
    @User() admin: AdminDto,
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Param('order_group_payment_ids')
    order_group_payment_ids: string | string[],
    @Body() body: UpdateOrderGroupPaymentStatusDto
  ) {
    const order_group_payment_id_arr = (
      order_group_payment_ids as string
    ).split(',');
    order_group_payment_ids = Array.isArray(order_group_payment_id_arr)
      ? order_group_payment_id_arr
      : Array.from(order_group_payment_ids);

    return this.commandBus.execute(
      new UpdateOrderGroupPaymentsStatusCommand(
        order_group_payment_ids.map((group_id) => Number(group_id)),
        admin,
        main_order_id,
        body.status
      )
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary:
      '주문 메뉴 상태 업데이트(대기(WAIT)/완료(COMPLETE)/진행(PROGRESS)/취소(CANCEL))'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '주문 아이디',
    type: 'string',
    example: '1'
  })
  @Put('update/main/:main_order_id/menu')
  async updateOrderMenuStatus(
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Body() body: UpdateOrderMenuStatusDto
  ) {
    return this.commandBus.execute(
      new UpdateOrderMenuCommand(
        body.order_menu_ids,
        main_order_id,
        body.status
      )
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '[어드민용] 주문 관리 페이징 리스트 조회'
  })
  @Get('/find/all/market')
  async findAllOrderByAdmin(
    @User() admin: AdminDto,
    @Query() params: FindOrdersAdminParams,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    if (params.group_ids) {
      const group_ids = (params.group_ids as string).split(',');
      params.group_ids = Array.isArray(group_ids)
        ? group_ids
        : Array.from(params.group_ids);
    }

    if (params.types) {
      const types = (params.types as string).split(',');
      params.types = Array.isArray(types) ? types : Array.from(params.types);
    }

    if (params.status) {
      const status = (params.status as string).split(',');
      params.status = Array.isArray(status)
        ? status
        : Array.from(params.status);
    }
    return this.queryBus.execute(
      new FindAllMainOrdersAdminQuery(admin, params, page_options)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문 단일 조회'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'order_menu_status',
    required: false,
    enum: OrderMenuStatus,
    description: '제외 주문 메뉴 상태',
    type: 'string'
  })
  @ApiQuery({
    name: 'language_code',
    required: true,
    description: '언어 코드',
    type: 'string'
  })
  @Get('/:main_order_id')
  async findOrder(
    @Param('main_order_id', ParseIntPipe) id: number,
    @Query('order_menu_status') order_menu_status: string,
    @Query('language_code') language_code: string
  ) {
    return this.queryBus.execute(
      new FindMainOrderQuery(id, order_menu_status, language_code)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문 단일 조회(어드민)'
  })
  @ApiParam({
    name: 'main_order_id',
    required: true,
    description: '대주문 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'group_ids',
    required: false,
    description: '그룹 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'order_menu_status',
    required: false,
    description: '제외 주문 메뉴 상태',
    enum: OrderMenuStatus,
    type: 'string'
  })
  @Get('/:main_order_id/group')
  async findOrderByAdmin(
    @User() admin: AdminDto,
    @Param('main_order_id', ParseIntPipe) main_order_id: number,
    @Query('group_ids') group_ids: string,
    @Query('order_menu_status') order_menu_status: string
  ) {
    let group_ids_arr: any;
    if (group_ids) {
      group_ids_arr = (group_ids as string).split(',');
      group_ids_arr = Array.isArray(group_ids_arr)
        ? group_ids_arr
        : Array.from(group_ids);
    }
    return this.queryBus.execute(
      new FindMainOrderAdminQuery(
        admin,
        group_ids_arr,
        main_order_id,
        order_menu_status
      )
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '주문정보 페이징 리스트 조회'
  })
  @Get('/find/all')
  async findAllOrderByUser(
    @Headers('authorization') authorization: string,
    @Query() params: FindOrdersParams,
    @Query(new PaginateParsePipe())
    page_options: PageOptionsDto
  ) {
    let user_id: any;
    let token: string = '';
    if (authorization) {
      token = authorization.split(' ')[1];
      const payload = this.jwtService.decode(token);
      user_id = payload ? payload['id'] : undefined;
    }

    if (params.group_ids) {
      const group_ids = (params.group_ids as string).split(',');
      params.group_ids = Array.isArray(group_ids)
        ? group_ids
        : Array.from(params.group_ids);
    }

    if (params.status) {
      const status = (params.status as string).split(',');
      params.status = Array.isArray(status)
        ? status
        : Array.from(params.status);
    }

    return this.queryBus.execute(
      new FindAllMainOrdersQuery(user_id, params, page_options)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '매출내역 리스트 조회'
  })
  @Get('find/sales')
  async getSales(
    @User() admin: AdminDto,
    @Query() params: FindSalesParams,
    @Query(new PaginateParsePipe()) page_options: PageOptionsDto
  ) {
    return this.queryBus.execute(
      new FindSalesQuery(admin, params, page_options)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '금일 판매 상품 리스트 조회'
  })
  @ApiParam({
    name: 'order_menu_stats_id',
    required: true,
    description: '매출내역 아이디',
    type: 'string'
  })
  @ApiQuery({
    name: 'group_id',
    required: false,
    description: '그룹 아이디',
    type: 'string'
  })
  @Get('find/products/:order_menu_stats_id')
  async getProducts(
    @User() admin: AdminDto,
    @Param('order_menu_stats_id', ParseIntPipe) order_menu_stats_id: number,
    @Query('group_id') group_id: string
  ) {
    return this.queryBus.execute(
      new FindProductsQuery(admin, order_menu_stats_id, group_id)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '대쉬보드 매출 조회'
  })
  @Get('/find/dashboard/sales-total')
  async getDashboardSalesTotal(@Req() req: any, @User() admin: AdminDto) {
    const ip = req.ip;
    const geo = geoip.lookup(ip)?.country || 'Asia/Seoul';
    return this.queryBus.execute(new FindDashboardSalesTotalQuery(admin, geo));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '대쉬보드 주문 조회'
  })
  @Get('/find/dashboard/sales-menus')
  async getDashboardSalesMenus(@Req() req: any, @User() admin: AdminDto) {
    const ip = req.ip;
    const geo = geoip.lookup(ip)?.country || 'Asia/Seoul';
    return this.queryBus.execute(new FindDashboardSalesMenusQuery(admin, geo));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '대쉬보드 랭킹 조회'
  })
  @Get('/find/dashboard/rank')
  async getDashboardSalesRank(@Req() req: any, @User() admin: AdminDto) {
    const ip = req.ip;
    const geo = geoip.lookup(ip)?.country || 'Asia/Seoul';
    return this.queryBus.execute(new FindDashboardSalesRankQuery(admin, geo));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '매출 정산'
  })
  @ApiQuery({
    name: 'group_id',
    required: false,
    description: '그룹 아이디',
    type: 'string',
    example: '1'
  })
  @Post('sales/stats')
  async createSaleStas(
    @Req() req: any,
    @User() admin: AdminDto,
    @Query('group_id') group_id: string
  ) {
    const ip = req.ip;
    const geo = geoip.lookup(ip)?.country || 'Asia/Seoul';
    return this.commandBus.execute(
      new CreateSaleStatsCommand(admin.id, group_id, geo)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({
    summary: '대기 및 진행중인 건 전체 취소'
  })
  @ApiQuery({
    name: 'group_id',
    required: false,
    description: '그룹 아이디',
    type: 'string',
    example: '1'
  })
  @Post('status/cancel')
  async updateWaitAndProgressOrder(
    @User() admin: AdminDto,
    @Query('group_id') group_id: string
  ) {
    return this.commandBus.execute(
      new UpdateAllOrderStatusCommand(admin.id, group_id)
    );
  }
}
