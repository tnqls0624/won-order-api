import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { CreateNoticeCommand } from './create-notice.command';
import { NoticeRepository } from '../../domain/notice.repository';
import { NoticeFactory } from '../../domain/notice.factory';

@CommandHandler(CreateNoticeCommand)
export class CreateNoticeCommandHandler
  implements ICommandHandler<CreateNoticeCommand>
{
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository,
    @Inject(InjectionToken.NOTICE_FACTORY)
    private readonly noticeFactory: NoticeFactory
  ) {}

  async execute(command: CreateNoticeCommand) {
    const { admin, body } = command;
    const notice = this.noticeFactory.create({
      ...body,
      index: 0,
      writer: admin.id
    });
    return this.noticeRepository.save(notice);
  }
}
