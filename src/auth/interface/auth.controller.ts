import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/response/response.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/create-user.command';
import { LoginUserQuery } from '../application/query/login-user.query';
import { JwtAuthGuard } from '../guard';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateUserPasswordCommand } from '../application/command/update-user-password.command';
import { DeleteUserCommand } from '../application/command/delete-user.command';
import { FindPasswordCommand } from '../application/command/find-password.command';
import { LoginAdminQuery } from '../application/query/login-admin.query';
import { UpdateAdminPasswordCommand } from '../application/command/update-admin-password.command';
import { AdminType, Provider } from 'src/types/login.type';
import { CheckDuplicatedIdQuery } from '../application/query/check-duplicated-id.query';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { FindMarketQuery } from '../application/query/find-market.query';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { CheckDuplicatedNickNameQuery } from '../application/query/check-duplicated-nickname.query';
import { CheckDuplicatedPhoneQuery } from '../application/query/check-duplicated-phone.query';
import { UpdateEmployeeCommand } from '../application/command/update-employee.command';
import { DeleteEmployeeCommand } from '../application/command/delete-employee.command';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/req/create-user.dto';
import { FindPasswordDto } from './dto/req/find-password.dto';
import { LoginAdminDto } from './dto/req/login-admin.dto';
import { LoginUserDto } from './dto/req/login-user.dto';
import { UpdatePasswordDto } from './dto/req/password-change.dto';
import { UpdateAuthDto } from './dto/req/update-auth.dto';
import { CreateUserResDto } from './dto/res/create-user-res.dto';
import { RecoveryUserCommand } from '../application/command/recovery-user.command';
import { PaginateParseIntPipe } from '../../utils/pipe';
import { PageOptionsDto } from '../../utils/paginate/dto';
import { AdminDto } from './dto/model/admin.dto';
import { UserDto } from './dto/model/user.dto';
import { DeleteAdminCommand } from '../application/command/delete-admin.command';
import { SignInOauthQuery } from '../application/query/sign-in-oauth.query';
import { FindUserAddressQuery } from '../application/query/find-user-address.query';
import { DeleteUserAddressCommand } from '../application/command/delete-user-address.command';
import { OauthGoogleService } from 'libs/oauth-google/oauth-google.service';
import { UpdateAddressDto } from './dto/req/update-address.dto';
import { UpdateUserAddressCommand } from '../application/command/update-user-address.command';
import { OauthFacebookService } from '../../../libs/oauth-facebook/oauth-facebook.service';
import { OauthAppleService } from '../../../libs/oauth-apple/oauth-apple.service';
import { OauthSignInDto } from './dto/req/oauth-sign-in.dto';
import { SignInOauthDto } from './dto/req/sign-in-oaunth-google.dto';
import { OauthAppleCallbackDto } from './dto/res/oauth-apple-callback.dto';
import { FastifyReply } from 'fastify';
import { UpdateMarketDto } from './dto/req/update-market.dto';
import { UpdateMarketCommand } from '../application/command/update-market.command';
import { DeleteMarketCommand } from '../application/command/delete-market.command';
import { FindAllMarketQuery } from '../application/query/find-all-market.query';
import { CreateEmployeeDto } from './dto/req/create-employee.dto';
import { CreateEmployeeCommand } from '../application/command/create-employee.command';
import { CreateMarketCommand } from '../application/command/create-market.command';
import { CreateMarketDto } from './dto/req/create-market.dto';
import { UpdateEmployeeSelectDto } from './dto/req/update-employee-select.dto';
import { UpdateEmployeeDto } from './dto/req/update-employee.dto';
import { UpdateEmployeeSelectCommand } from '../application/command/update-employee-select.command';
import { FindAllEmployeeQuery } from '../application/query/find-all-employee.query';
import { FindMasterQuery } from '../application/query/find-master.query';
import { UpdateMasterCommand } from '../application/command/update-master.command';
import { UpdateMasterDto } from './dto/req/update-master.dto';
import { CreateMasterDto } from './dto/req/create-master.dto';
import { CreateMasterCommand } from '../application/command/create-master.command';
import { FindAllMasterQuery } from '../application/query/find-all-master.query';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauthGoogle: OauthGoogleService,
    private readonly oauthFacebook: OauthFacebookService,
    private readonly oauthApple: OauthAppleService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마스터 추가' })
  @Post('/master')
  async createMaster(@User() admin: AdminDto, @Body() body: CreateMasterDto) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateMasterCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마스터 수정' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '어드민 아이디',
    type: 'string'
  })
  @Put('/master/:id')
  async updateMaster(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMasterDto
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMasterCommand(id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마스터 삭제' })
  @ApiParam({
    name: 'id',
    required: false,
    description: '마스터 아이디',
    type: 'string'
  })
  @Delete('/master/:id')
  async deleteMaster(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new DeleteAdminCommand(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마스터 단일 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '어드민(마스터) 아이디',
    type: 'string'
  })
  @Get('/master/:id')
  async findMaster(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindMasterQuery(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '모든 마스터 조회' })
  @Get('/master')
  async findAllMaster(@User() admin: AdminDto) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindAllMasterQuery());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마켓 추가' })
  @Post('/market')
  async createMarket(@User() admin: AdminDto, @Body() body: CreateMarketDto) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new CreateMarketCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마켓 수정' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'market 아이디',
    type: 'string'
  })
  @Put('/market/:id')
  async updateMarket(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMarketDto
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new UpdateMarketCommand(id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마켓 삭제' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'market 아이디',
    type: 'string'
  })
  @Delete('/market/:id')
  async deleteMarket(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.commandBus.execute(new DeleteMarketCommand(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '모든 마켓 찾기' })
  @Get('/markets')
  async findAllMarket(@User() admin: AdminDto) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindAllMarketQuery());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '단일 마켓 찾기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'market 아이디',
    type: 'string'
  })
  @Get('/market/:id')
  async findMarketById(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) market_id: number
  ) {
    if (admin.type !== AdminType.SUPER)
      throw new CustomError(RESULT_CODE.NOT_PERMISSION);
    return this.queryBus.execute(new FindMarketQuery(market_id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('/user-register')
  async createUser(@Body() body: CreateUserDto) {
    const result = await this.commandBus.execute(new CreateUserCommand(body));
    return plainToInstance(CreateUserResDto, result);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '점원 추가' })
  @Post('/admin-register')
  async createEmployee(@Body() body: CreateEmployeeDto) {
    return this.commandBus.execute(new CreateEmployeeCommand(body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '구글 로그인 [임시]' })
  @Post('/google-login')
  async googleTokenLogin(@Body() body: SignInOauthDto) {
    return this.queryBus.execute(
      new SignInOauthQuery(body.accessToken, null, Provider.google)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '애플 리다이렉트 Post -> Get' })
  @Post('/apple/redirect')
  async oauthAppleRedirect(
    @Body() body: OauthAppleCallbackDto,
    @Res() reply: FastifyReply
  ) {
    const redirectUrl = new URL(body.state);
    const params = new URLSearchParams();
    params.append('code', body.code);
    if (body.user) params.append('user', body.user);

    // Add the query string to the initial URL
    redirectUrl.search = params.toString();

    reply.code(302).header('Location', redirectUrl.toString()).send();
  }

  @ApiParam({
    name: 'provider',
    required: true,
    description: 'OAUTH 공급자 [google, facebook, apple]',
    type: 'string'
  })
  @ApiOperation({ summary: 'Oauth 페이지 리다이렉트' })
  @Get('/:provider/login')
  async oauthRedirect(
    @Param('provider', new ParseEnumPipe(Provider)) provider: Provider,
    @Query('redirect_uri') redirect_uri: string
  ) {
    switch (provider) {
      case Provider.apple:
        return this.oauthApple.generateAuthUrl(redirect_uri);
      case Provider.facebook:
        return this.oauthFacebook.generateAuthUrl(redirect_uri);
      case Provider.google:
        return this.oauthGoogle.generateAuthUrl(redirect_uri);
    }
  }

  @ApiParam({
    name: 'provider',
    required: true,
    description: 'OAUTH 공급자 [google, facebook, apple]',
    type: 'string'
  })
  @ApiOperation({ summary: 'oauth 콜백 주소' })
  @Post('/:provider/callback')
  async oauthCallback(
    @Param('provider', new ParseEnumPipe(Provider)) provider: Provider,
    @Body() body: OauthSignInDto
  ) {
    let accessToken: string;
    switch (provider) {
      case Provider.apple: {
        accessToken = await this.oauthApple.getTokenByCode(body.code);
        break;
      }
      case Provider.facebook: {
        accessToken = await this.oauthFacebook.getTokenByCode(
          body.code,
          body.redirect_uri
        );
        break;
      }
      case Provider.google: {
        accessToken = await this.oauthGoogle.getTokenByCode(
          body.code,
          body.redirect_uri
        );
      }
    }
    let userDecoded: string | null | undefined;
    if (body.user) {
      userDecoded = decodeURIComponent(body.user);
    }
    return this.queryBus.execute(
      new SignInOauthQuery(accessToken, userDecoded, provider)
    );
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/user-login')
  async loginUser(@Body() body: LoginUserDto) {
    return this.queryBus.execute(new LoginUserQuery(body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '닉네임 중복확인' })
  @Post('/user/check-duplicated-nickname')
  async nicknameDuplicatedCheck(@Query('nickname') nickname: string) {
    return this.queryBus.execute(new CheckDuplicatedNickNameQuery(nickname));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '핸드폰 중복확인' })
  @Post('/user/check-duplicated-phone')
  async phoneDuplicatedCheck(@Query('phone') phone: string) {
    return this.queryBus.execute(new CheckDuplicatedPhoneQuery(phone));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '핸드폰번호로 계정 복구하기' })
  @Post('/user/recovery')
  async recovery(@Query('phone') phone: string) {
    return this.commandBus.execute(new RecoveryUserCommand(phone));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '어드민 아이디 중복확인' })
  @ApiQuery({
    name: 'admin_id',
    required: true,
    type: 'string',
    description: '어드민 ID'
  })
  @Get('/admin-login/check-duplicated-id')
  async checkDuplicatedId(
    @User() admin: AdminDto,
    @Query('admin_id') admin_id: string
  ) {
    return this.queryBus.execute(
      new CheckDuplicatedIdQuery(admin.market_id, admin_id)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '마켓 정보 가져오기' })
  @Get('/market')
  async findMarket(@User() admin: AdminDto) {
    return this.queryBus.execute(new FindMarketQuery(admin.market_id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '어드민 로그인' })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: AdminType,
    description: '어드민 ID'
  })
  @Post('/admin-login')
  async loginAdmin(
    @Query('type', new ParseEnumPipe(AdminType)) type: AdminType,
    @Body() body: LoginAdminDto
  ) {
    if (type === AdminType.EMPLOYEE && !body.access_id)
      throw new CustomError(RESULT_CODE.AUTH_NEED_ACCESS_ID);
    if (type === AdminType.MASTER && body.access_id)
      throw new CustomError(RESULT_CODE.BODY_VALIDATION_ERROR);
    return this.queryBus.execute(new LoginAdminQuery(type, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '정보 조회' })
  @Get('/login')
  getLoginUser(@User() user: UserDto) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '유저 비밀번호 변경' })
  @Put('/user-login/password')
  async updatePassword(@User() user: UserDto, @Body() body: UpdatePasswordDto) {
    const command = new UpdateUserPasswordCommand(user.id, body);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '어드민 비밀번호 변경' })
  @Put('/admin-login/password')
  async updatePasswordAdmin(
    @User() admin: AdminDto,
    @Body() body: UpdatePasswordDto
  ) {
    return this.commandBus.execute(new UpdateAdminPasswordCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '유저 정보 변경 ( 변경된 값만 body에 넣음 )' })
  @Put('/user-login')
  async updateUserAuth(@User() user: UserDto, @Body() body: UpdateAuthDto) {
    return this.commandBus.execute(new UpdateUserCommand(user.id, body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '주소록 리스트 찾기' })
  @ApiQuery({
    name: 'guest_id',
    type: 'string',
    description: '비회원 아이디',
    required: false,
    example: 'dsaf324321'
  })
  @ApiQuery({
    name: 'user_id',
    type: 'string',
    description: '회원 아이디',
    required: false,
    example: 1
  })
  @Get('/find/address')
  async findUserAddress(
    @Query('user_id') user_id: string,
    @Query('guest_id') guest_id: string
  ) {
    return this.queryBus.execute(new FindUserAddressQuery(user_id, guest_id));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '주소 수정' })
  @ApiParam({
    name: 'id',
    required: false,
    description: '주소 아이디',
    type: 'string'
  })
  @Put('/address/:id')
  async updateUserAddress(
    @Param('id') id: number,
    @Body() body: UpdateAddressDto
  ) {
    return this.commandBus.execute(new UpdateUserAddressCommand(id, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '주소 삭제' })
  @Delete('/address/:id')
  async deleteUserAddress(@Param('id') id: number) {
    return this.commandBus.execute(new DeleteUserAddressCommand(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '직원 정보 변경 ( 변경된 값만 body에 넣음 )' })
  @Put('/employee')
  async updateEmployeeAuth(
    @User() admin: AdminDto,
    @Body() body: UpdateEmployeeDto
  ) {
    return this.commandBus.execute(new UpdateEmployeeCommand(admin.id, body));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '유저 비밀번호 찾기 변경' })
  @Post('/user-login/find-password')
  async findPasswordChange(@Body() body: FindPasswordDto) {
    return this.commandBus.execute(new FindPasswordCommand(body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete('/user-login')
  async deleteUser(@User() user: UserDto) {
    return this.commandBus.execute(new DeleteUserCommand(user.id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '회원 탈퇴 ( 점원용 )' })
  @Delete('/admin-login')
  async deleteEmployee(@User() admin: AdminDto) {
    return this.commandBus.execute(new DeleteEmployeeCommand(admin));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '점원 전체 조회' })
  @ApiQuery({
    name: 'group_id',
    description: '그룹 아이디',
    required: false,
    example: 1
  })
  @ApiQuery({
    name: 'admin_id',
    description: '어드민 아이디',
    required: false
  })
  @ApiQuery({
    name: 'nickname',
    description: '이름',
    required: false
  })
  @Get('admin/all')
  async findAllEmployee(
    @User() admin: AdminDto,
    @Query('group_id') group_id: string,
    @Query('admin_id') admin_id: string,
    @Query('nickname') nickname: string,
    @Query(new PaginateParseIntPipe()) page_query: PageOptionsDto
  ) {
    return this.queryBus.execute(
      new FindAllEmployeeQuery(
        admin,
        Number(group_id),
        admin_id,
        nickname,
        page_query
      )
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '점원 업데이트' })
  @ApiParam({
    name: 'id',
    required: false,
    description: '점원 아이디',
    type: 'string'
  })
  @Put('admin/:id')
  async updateEmployeeSelect(
    @User() admin: AdminDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmployeeSelectDto
  ) {
    return this.commandBus.execute(
      new UpdateEmployeeSelectCommand(admin, id, body)
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '점원 삭제' })
  @ApiParam({
    name: 'id',
    required: false,
    description: '점원 아이디',
    type: 'string'
  })
  @Delete('admin/:id')
  async delete(@User() admin: AdminDto, @Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteAdminCommand(id));
  }
}
