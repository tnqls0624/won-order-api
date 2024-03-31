import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import { NoticeFactory } from '../../domain/notice.factory';
import { UpdateNoticeCommand } from './update-notice-command';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';

@CommandHandler(UpdateNoticeCommand)
export class UpdateNoticeCommandHandler
  implements ICommandHandler<UpdateNoticeCommand>
{
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository,
    @Inject(InjectionToken.NOTICE_FACTORY)
    private readonly noticeFactory: NoticeFactory
  ) {}

  async execute(command: UpdateNoticeCommand) {
    const notice = await this.noticeRepository.findById(command.id);
    if (!notice) throw new CustomError(RESULT_CODE.NOT_FOUND_NOTICE);
    notice.update(command.body);
    return true;
  }
}
