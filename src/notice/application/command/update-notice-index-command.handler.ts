import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import { NoticeFactory } from '../../domain/notice.factory';
import CustomError from '../../../common/error/custom-error';
import { RESULT_CODE } from '../../../constant';
import { UpdateNoticeIndexCommand } from './update-notice-index-command';

@CommandHandler(UpdateNoticeIndexCommand)
export class UpdateNoticeIndexCommandHandler
  implements ICommandHandler<UpdateNoticeIndexCommand>
{
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository,
    @Inject(InjectionToken.NOTICE_FACTORY)
    private readonly noticeFactory: NoticeFactory
  ) {}

  async execute(command: UpdateNoticeIndexCommand) {
    await Promise.all(
      command.body.notice.map(async (item) => {
        if (!item.id)
          throw new CustomError(RESULT_CODE.NOT_FOUND_MENU_CATEGORY);
        const notice = await this.noticeRepository.findById(item.id);
        if (!notice) throw new CustomError(RESULT_CODE.NOT_FOUND_MENU_CATEGORY);
        notice.updateIndex(item.index);
      })
    );
    return true;
  }
}
