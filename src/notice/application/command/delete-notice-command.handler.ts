import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import { NoticeFactory } from '../../domain/notice.factory';
import { DeleteNoticeCommand } from './delete-notice.command';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';

@CommandHandler(DeleteNoticeCommand)
export class DeleteNoticeCommandHandler
  implements ICommandHandler<DeleteNoticeCommand>
{
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository,
    @Inject(InjectionToken.NOTICE_FACTORY)
    private readonly noticeFactory: NoticeFactory
  ) {}

  async execute(command: DeleteNoticeCommand) {
    const { id } = command;
    const notice = await this.noticeRepository.findById(id);
    if (!notice) throw new CustomError(RESULT_CODE.NOT_FOUND_NOTICE);
    notice.delete();
    return true;
  }
}
