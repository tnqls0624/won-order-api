import {
  Global,
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap
} from '@nestjs/common';
import { Server } from 'node:http';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentModule } from './document/document.module';
import { SettingModule } from './setting/setting.module';
import { GroupModule } from './group/group.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { OrderModule } from './order/order.module';
import { TableModule } from './table/table.module';
import { EventModule } from './event/event.module';
import { PushModule } from './push/push.module';
import { MessageModule } from 'libs/message.module';
import { PasswordModule } from 'libs/password.module';
import { RequestStorageMiddleware } from 'libs/request.storage.middleware';
import { CacheStoreModule } from './cache/cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NoticeModule } from './notice/notice.module';
import { CommentModule } from './comment/comment.module';
import { Reflector } from '../libs/reflector';
import { ContactModule } from './contact/contact.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService): Promise<any> => ({
        store: redisStore,
        host: configService.get<string>('ELASTIC_CACHE_HOST') as string,
        port: configService.get<string>('ELASTIC_CACHE_PORT') as string,
        ttl: configService.get<string>('ELASTIC_CACHE_EXPIRED_AT') as string
      })
    }),
    DocumentModule,
    SettingModule,
    GroupModule,
    MenuModule,
    AuthModule,
    VerificationModule,
    OrderModule,
    TableModule,
    NoticeModule,
    CommentModule,
    EventModule,
    PushModule,
    PasswordModule,
    MessageModule,
    CacheStoreModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [Reflector]
})
export class AppModule implements OnApplicationBootstrap {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }

  constructor(private readonly refHost: HttpAdapterHost<AbstractHttpAdapter>) {}

  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
  }
}
