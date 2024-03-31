import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  SetMetadata
} from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import {
  SendMessageCommand,
  SQS,
  SQSClient,
  Message as AWS_SQS_MESSAGE
} from '@aws-sdk/client-sqs';
import {
  CreateTopicCommand,
  SNSClient,
  PublishCommand
} from '@aws-sdk/client-sns';
import { DiscoveryService, DiscoveryModule } from '@golevelup/nestjs-discovery';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RequestStorage } from './request.storage';
import { SqsMessageHandler, SqsModule } from '@ssut/nestjs-sqs';
import { ModulesContainer } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import dayjs from 'dayjs';
import crypto from 'crypto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

type Message = Readonly<{ name: string; body: IEvent; request_id: string }>;
type MessageHandlerMetadata = Readonly<{ name: string }>;

const SQS_CONSUMER_METHOD = Symbol.for('SQS_CONSUMER_METHOD');
export const MessageHandler = (name: string) =>
  SetMetadata<symbol, MessageHandlerMetadata>(SQS_CONSUMER_METHOD, { name });

@Injectable()
export class SQSConsumerService {
  private readonly logger = new Logger(SQSConsumerService.name);
  @Inject() private readonly discover: DiscoveryService;
  @Inject() private readonly modulesContainer: ModulesContainer;

  safeStringify(obj: unknown) {
    const seen = new Set();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    });
  }

  @SqsMessageHandler(process.env.SQS_NAME as string, false)
  async handleMessage(data: AWS_SQS_MESSAGE): Promise<void> {
    this.logger.log(`Original Message : ${this.safeStringify(data)}`);
    if (!data?.Body) return;
    const message: Message = JSON.parse(
      JSON.parse(data.Body as string).Message
    );
    try {
      RequestStorage.reset();
      const handler = (
        await this.discover.controllerMethodsWithMetaAtKey<MessageHandlerMetadata>(
          SQS_CONSUMER_METHOD
        )
      ).find((handler) => handler.meta.name === message.name);
      if (!handler)
        throw new Error(
          `Message handler is not found. Message: ${this.safeStringify(
            message
          )}`
        );
      this.logger.log(`Handler : ${this.safeStringify(handler)}`);
      const controller = Array.from(this.modulesContainer.values())
        .filter((module) => 0 < module.controllers.size)
        .flatMap((module) => Array.from(module.controllers.values()))
        .find(
          (wrapper) => wrapper.name == handler.discoveredMethod.parentClass.name
        );
      if (!controller)
        throw new Error(
          `Message handling controller is not found. Message: ${this.safeStringify(
            message
          )}`
        );
      this.logger.log(`Controller : ${this.safeStringify(controller)}`);
      await handler.discoveredMethod.handler.bind(controller.instance)(message);
    } catch (error) {
      return this.logger.error(
        `Message handling error. Message: ${this.safeStringify(
          message
        )}. Error: ${error}`
      );
    }
  }
}

export enum Topic {
  ORDER_PLACED = 'ORDER_PLACED', // 주문 접수
  ORDER_UPDATED = 'ORDER_UPDATED', // 주문내역 수정
  ORDER_COMPLETED = 'ORDER_COMPLETED', // 주문 완료
  ORDER_UPDATE_COMPLETED = 'ORDER_UPDATE_COMPLETED' // 주문내역 수정 완료
}

export class OrderPlaced {
  constructor(readonly data: string) {}
}

export class OrderUpdated {
  constructor(readonly data: string) {}
}

export class OrderCompleted {
  constructor(
    readonly order_id: string,
    readonly data: string
  ) {}
}

class SESMessagePublisher {
  private readonly sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION
    });
  }

  private readonly logger = new Logger(SESMessagePublisher.name);

  async publish(
    to_address: string,
    title: string,
    content: string
  ): Promise<void> {
    try {
      await this.sesClient.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to_address],
            CcAddresses: [],
            BccAddresses: []
          },
          Message: {
            Body: {
              Text: {
                Data: content,
                Charset: 'utf-8'
              }
            },
            Subject: {
              Data: title,
              Charset: 'utf-8'
            }
          },
          Source: 'itechcompany22@gmail.com',
          ReplyToAddresses: ['itechcompany22@gmail.com']
        })
      );
      this.logger.log(`To. Address: ${to_address}`);
      this.logger.log(
        `Ses Email Published. Title: ${title} , Content: ${content}`
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}

class SNSMessagePublisher {
  private readonly snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION
    });
  }

  private readonly logger = new Logger(SNSMessagePublisher.name);

  async publish(Name: Topic, Message: Message): Promise<void> {
    const body = {
      Message,
      timestamp: dayjs().format('YYYYMMDDHHmmss')
    };
    const string_body = JSON.stringify(body);
    const deduplication_id = crypto
      .createHash('md5')
      .update(string_body)
      .digest('hex');

    const message = {
      TopicArn: (
        await this.snsClient.send(
          new CreateTopicCommand({
            Attributes: {
              FifoTopic: 'true',
              ContentBasedDeduplication: 'true'
            },
            Name:
              process.env.MODE === 'prod'
                ? `${Name}_PROD.fifo`
                : process.env.MODE === 'dev'
                ? `${Name}_DEV.fifo`
                : `${Name}_LOCAL.fifo`
          })
        )
      ).TopicArn,
      Message: JSON.stringify(Message),
      MessageGroupId: `order-planet-place-ch`,
      MessageDeduplicationId: deduplication_id
    };
    await this.snsClient.send(new PublishCommand(message));
    this.logger.log(`Message published. Message: ${JSON.stringify(message)}`);
  }
}

export interface IntegrationSESPublisher {
  publish: (
    to_address: string,
    title: string,
    content: string
  ) => Promise<void>;
}

class IntegrationSESPublisherImplement implements IntegrationSESPublisher {
  @Inject() private readonly sesMessagePublisher: SESMessagePublisher;

  async publish(
    to_address: string,
    title: string,
    content: string
  ): Promise<void> {
    await this.sesMessagePublisher.publish(to_address, title, content);
  }
}

export interface IntegrationEventPublisher {
  publish: (name: Topic, body: IEvent) => Promise<void>;
}

class IntegrationEventPublisherImplement implements IntegrationEventPublisher {
  @Inject() private readonly snsMessagePublisher: SNSMessagePublisher;

  async publish(name: Topic, body: IEvent): Promise<void> {
    await this.snsMessagePublisher.publish(name, {
      name,
      body,
      request_id: RequestStorage.getStorage().request_id
    });
  }
}

export const INTEGRATION_EVENT_PUBLISHER = 'INTEGRATION_EVENT_PUBLISHER';
export const INTEGRATION_SES_PUBLISHER = 'INTEGRATION_SES_PUBLISHER';

class SQSMessagePublisher {
  private readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION
    });
  }

  private readonly logger = new Logger(SQSMessagePublisher.name);

  async publish(message: Message): Promise<void> {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(message),
        DelaySeconds: Math.round(Math.random() * 10)
      })
    );
    this.logger.log(`Message published. Message: ${JSON.stringify(message)}`);
  }
}

export interface TaskPublisher {
  publish: (name: string, task: IEvent) => Promise<void>;
}

class TaskPublisherImplement implements TaskPublisher {
  @Inject() private readonly sqsMessagePublisher: SQSMessagePublisher;

  async publish(name: string, body: IEvent): Promise<void> {
    await this.sqsMessagePublisher.publish({
      name,
      body,
      request_id: RequestStorage.getStorage().request_id
    });
  }
}

export const TASK_PUBLISHER = 'TASK_PUBLISHER';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configSerivce: ConfigService) => {
        return {
          producers: [],
          consumers: [
            {
              name: configSerivce.get<string>('SQS_NAME') as string,
              queueUrl: configSerivce.get<string>('SQS_URL') as string,
              region: configSerivce.get<string>('AWS_REGION') as string,
              sqs: new SQS({
                maxAttempts: 1,
                region: configSerivce.get<string>('AWS_REGION') as string
              })
            }
          ]
        };
      },
      inject: [ConfigService]
    }),
    PrismaModule
  ],
  providers: [
    SQSConsumerService,
    SNSMessagePublisher,
    SQSMessagePublisher,
    SESMessagePublisher,
    {
      provide: INTEGRATION_EVENT_PUBLISHER,
      useClass: IntegrationEventPublisherImplement
    },
    {
      provide: TASK_PUBLISHER,
      useClass: TaskPublisherImplement
    },
    {
      provide: INTEGRATION_SES_PUBLISHER,
      useClass: IntegrationSESPublisherImplement
    }
  ],
  exports: [
    INTEGRATION_SES_PUBLISHER,
    INTEGRATION_EVENT_PUBLISHER,
    TASK_PUBLISHER
  ]
})
export class MessageModule {}
