import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger, INestApplication } from '@nestjs/common';
import AllExceptionsFilter from './common/error/all-exceptions-filter';
import AppLogger from './common/Logger/app-logger';
import { SuccessInterceptor } from './interceptors/sucess.interceptor';
import { RedisIoAdapter } from './adapter/redis.adapter';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import compression from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

declare const module: any;
async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const fastifyAdapter = new FastifyAdapter({
    bodyLimit: 20 * 1024 * 1024
  });
  const app: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      fastifyAdapter,
      {
        logger: new AppLogger(),
        rawBody: true
      }
    );
  app.register(multipart);
  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  await app.register(fastifyHelmet, {
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
    hsts: { maxAge: 5184000 }, // 60 days
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"]
      }
    }
  });

  const redisIoAdapter = await connectRedis(app);
  const port = 3000;
  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);
  app.enableCors({
    origin: true,
    credentials: true
  });
  await app.listen(port, '0.0.0.0');

  logger.log(`Won Order Server is Running On: ${await app.getUrl()}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription(
      process.env.MODE === 'dev' || process.env.MODE === 'local'
        ? '개발용 API 문서입니다'
        : '운영용 API 문서입니다'
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'authorization',
      description: 'Enter JWT token',
      in: 'header'
    })
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });
}

async function connectRedis(
  app: NestFastifyApplication
): Promise<RedisIoAdapter> {
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  return redisIoAdapter;
}

bootstrap();
