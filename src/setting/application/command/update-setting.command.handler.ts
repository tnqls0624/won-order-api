import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { SettingRepository } from 'src/setting/domain/setting.repository';
import { InjectionToken } from '../Injection-token';
import { UpdateSettingCommand } from './update-setting.command';

@CommandHandler(UpdateSettingCommand)
export class UpdateSettingCommandHandler
  implements ICommandHandler<UpdateSettingCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.SETTING_REPOSITORY)
    private readonly settingRepository: SettingRepository
  ) {}

  async execute(command: UpdateSettingCommand) {
    const { admin, id, body } = command;
    await this.cacheService.delMenuCache(admin.market_id);
    const setting = await this.settingRepository.findById(id);
    if (!setting) throw new CustomError(RESULT_CODE.NOT_FOUND_SETTING);
    setting.update(admin, body);
    return true;
  }
}
