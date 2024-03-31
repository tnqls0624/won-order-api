import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './interface/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateUserCommandHandler } from './application/command/create-user.command.handler';
import { LoginQueryHandler } from './application/query/login-user.query.handler';
import { UpdatePasswordCommandHandler } from './application/command/update-user-password.command.handler';
import { UpdateUserCommandHandler } from './application/command/update-user.command.handler';
import { FindPassWordCommandHandler } from './application/command/find-password.command.handler';
import { VerificationModule } from 'src/verification/verification.module';
import { LoginAdminQueryHandler } from './application/query/login-admin.query.handler';
import { UpdateAdminPasswordCommandHandler } from './application/command/update-admin-password.command.handler';
import { GroupModule } from 'src/group/group.module';
import { SelectGroupCommandHandler } from 'src/group/application/command/select-group.command.handler';
import { CheckDuplicatedIdQueryHandler } from './application/query/check-duplicated-id.query.handler';
import { FindMarketQueryHandler } from './application/query/find-market.query.handler';
import { CacheStoreModule } from 'src/cache/cache.module';
import { JwtStrategy } from './jwt.strategy';
import { InjectionToken } from './application/Injection-token';
import { UserRepositoryImplement } from './infrastructure/repository/user.repository.implement';
import { UserDomainService } from './domain/user.domain.service';
import { UserFactory } from './domain/user.factory';
import { PasswordModule } from 'libs/password.module';
import { DeleteUserHandler } from './application/event/delete-user.handler';
import { DeleteUserCommandHandler } from './application/command/delete-user.command.handler';
import { UpdateUserHandler } from './application/event/update-user.handler';
import { UserQueryImplement } from './infrastructure/query/user.query.implement';
import { AdminRepositoryImplement } from './infrastructure/repository/admin.repository.implement';
import { AdminFactory } from './domain/admin.factory';
import { AdminQueryImplement } from './infrastructure/query/admin.query.implement';
import { GroupDomainService } from 'src/group/domain/group.domain.service';
import { DeleteAdminHandler } from './application/event/delete-admin.handler';
import { CheckDuplicatedNickNameQueryHandler } from './application/query/check-duplicated-nickname.query.handler';
import { CheckDuplicatedPhoneQueryHandler } from './application/query/check-duplicated-phone.query.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateEmployeeCommandHandler } from './application/command/update-employee.command.handler';
import { DeleteEmployeeCommandHandler } from './application/command/delete-employee.command.handler';
import { RecoveryUserCommandHandler } from './application/command/recovery-user.command.handler';
import { RecoveryUserEventHandler } from './application/event/recovery-user.handler';
import { UpdateAdminPasswordHandler } from './application/event/update-admin-password.handler';
import { DeleteAdminCommandHandler } from './application/command/delete-admin.command.handler';
import { FindAllUserQueryHandler } from './application/query/find-all-user.query.handler';
import { CreateSaleStatsCommandHandler } from './application/command/create-sale-stats.command.handler';
import { CreateSaleStatsEventHandler } from './application/event/create-sale-stats.handler';
import { UpdateAllOrderStatusEventHandler } from './application/event/update-all-order-status.handler';
import { UpdateAllOrderStatusCommandHandler } from './application/command/update-all-order-status.command.handler';
import { MainOrderRepositoryImplement } from 'src/order/infrastructure/repository/main-order.repository.implement';
import { MainOrderFactory } from 'src/order/domain/main-order/main-order.factory';
import { SignInOauthQueryHandler } from './application/query/sign-in-oauth-query.handler';
import { FindUserAddressQueryHandler } from './application/query/find-user-address.query.handler';
import { OauthGoogleModule } from 'libs/oauth-google/oauth-google.module';
import { UpdateUserAddressCommandHandler } from './application/command/update-user-address.command.handler';
import { DeleteUserAddressCommandHandler } from './application/command/delete-user-address.command.handler';
import { OauthFacebookModule } from '../../libs/oauth-facebook/oauth-facebook.module';
import { OauthAppleModule } from '../../libs/oauth-apple/oauth-apple.module';
import { CreateMarketCommandHandler } from './application/command/create-market.command.handler';
import { UpdateMarketCommandHandler } from './application/command/update-market.command.handler';
import { UpdateMarketEventHandler } from './application/event/update-market.handler';
import { MarketFactory } from './domain/market.factory';
import { MarketRepositoryImplement } from './infrastructure/repository/market.repository.implement';
import { MarketQueryImplement } from './infrastructure/query/market.query.implement';
import { DeleteMarketCommandHandler } from './application/command/delete-market.command.handler';
import { DeleteMarketEventHandler } from './application/event/delete-market.handler';
import { FindAllMarketQueryHandler } from './application/query/find-all-market.query.handler';
import { CreateEmployeeCommandHandler } from './application/command/create-employee.command.handler';
import { UpdateEmployeeSelectCommandHandler } from './application/command/update-employee-select.command.handler';
import { UpdateEmployeeHandler } from './application/event/update-employee.handler';
import { FindAllEmployeeQueryHandler } from './application/query/find-all-employee.query.handler';
import { FindMasterQueryHandler } from './application/query/find-master.query.handler';
import { CreateMasterCommandHandler } from './application/command/create-master.command.handler';
import { UpdateMasterCommandHandler } from './application/command/update-master.command.handler';
import { UpdateMasterEventHandler } from './application/event/update-master.handler';
import { FindAllMasterQueryHandler } from './application/query/find-all-master.query.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepositoryImplement
  },
  {
    provide: InjectionToken.USER_QUERY,
    useClass: UserQueryImplement
  },
  {
    provide: InjectionToken.USER_FACTORY,
    useClass: UserFactory
  },
  {
    provide: InjectionToken.ADMIN_REPOSITORY,
    useClass: AdminRepositoryImplement
  },
  {
    provide: InjectionToken.ADMIN_QUERY,
    useClass: AdminQueryImplement
  },
  {
    provide: InjectionToken.ADMIN_FACTORY,
    useClass: AdminFactory
  },
  {
    provide: InjectionToken.USER_DOMAIN_SERVICE,
    useClass: UserDomainService
  },
  {
    provide: InjectionToken.MAIN_ORDER_REPOSITORY,
    useClass: MainOrderRepositoryImplement
  },
  {
    provide: InjectionToken.MAIN_ORDER_FACTORY,
    useClass: MainOrderFactory
  },
  {
    provide: InjectionToken.MARKET_FACTORY,
    useClass: MarketFactory
  },
  {
    provide: InjectionToken.MARKET_REPOSITORY,
    useClass: MarketRepositoryImplement
  },
  {
    provide: InjectionToken.MARKET_QUERY,
    useClass: MarketQueryImplement
  }
];

const domain = [
  UserDomainService,
  GroupDomainService,
  UserFactory,
  AdminFactory
];

const application = [
  JwtStrategy,
  JwtService,
  CreateUserCommandHandler,
  UpdatePasswordCommandHandler,
  LoginQueryHandler,
  SignInOauthQueryHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
  DeleteUserHandler,
  DeleteAdminHandler,
  UpdateUserHandler,
  FindPassWordCommandHandler,
  LoginAdminQueryHandler,
  UpdateAdminPasswordCommandHandler,
  UpdateEmployeeHandler,
  CreateEmployeeCommandHandler,
  SelectGroupCommandHandler,
  CheckDuplicatedIdQueryHandler,
  FindMarketQueryHandler,
  CheckDuplicatedNickNameQueryHandler,
  CheckDuplicatedPhoneQueryHandler,
  UpdateEmployeeCommandHandler,
  DeleteAdminCommandHandler,
  DeleteEmployeeCommandHandler,
  RecoveryUserCommandHandler,
  RecoveryUserEventHandler,
  UpdateAdminPasswordHandler,
  FindAllEmployeeQueryHandler,
  FindAllUserQueryHandler,
  UpdateEmployeeSelectCommandHandler,
  CreateSaleStatsCommandHandler,
  CreateSaleStatsEventHandler,
  UpdateAllOrderStatusEventHandler,
  UpdateAllOrderStatusCommandHandler,
  FindUserAddressQueryHandler,
  UpdateUserAddressCommandHandler,
  DeleteUserAddressCommandHandler,
  CreateMarketCommandHandler,
  UpdateMarketCommandHandler,
  UpdateMarketEventHandler,
  DeleteMarketCommandHandler,
  DeleteMarketEventHandler,
  FindAllMarketQueryHandler,
  CreateMasterCommandHandler,
  UpdateMasterCommandHandler,
  UpdateMasterEventHandler,
  FindMasterQueryHandler,
  FindAllMasterQueryHandler
];

@Module({
  imports: [
    OauthGoogleModule,
    OauthAppleModule,
    OauthFacebookModule,
    CqrsModule,
    CacheStoreModule,
    VerificationModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string,
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
          ) as string
        }
      })
    }),
    forwardRef(() => GroupModule),
    PasswordModule
  ],
  controllers: [AuthController],
  providers: [...application, ...infrastructure, ...domain],
  exports: [JwtStrategy, JwtService, ...infrastructure]
})
export class AuthModule {}
