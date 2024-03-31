import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/service/cache.service';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { GroupFactory } from 'src/group/domain/group.factory';
import { GroupRepository } from 'src/group/domain/group.repository';
import { SettingFactory } from 'src/setting/domain/setting.factory';
import { SettingRepository } from 'src/setting/domain/setting.repository';
import { InjectionToken } from '../injection-token';
import { CreateGroupCommand } from './create-group.command';

@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler
  implements ICommandHandler<CreateGroupCommand>
{
  constructor(
    private readonly cacheService: CacheService,
    @Inject(InjectionToken.GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepository,
    @Inject(InjectionToken.GROUP_FACTORY)
    private readonly groupFactory: GroupFactory,
    @Inject(InjectionToken.SETTING_REPOSITORY)
    private readonly settingRepository: SettingRepository,
    @Inject(InjectionToken.SETTING_FACTORY)
    private readonly settingFactory: SettingFactory
  ) {}

  async execute(command: CreateGroupCommand) {
    const { admin, body } = command;
    const { name } = body;
    if (!name) throw new CustomError(RESULT_CODE.GROUP_NAME_IS_REQUIRE);
    const existing_group = await this.groupRepository.findByName(
      admin.market_id,
      name
    );
    if (existing_group)
      throw new CustomError(RESULT_CODE.DUPLICATED_GROUP_NAME);
    const group = this.groupFactory.create({
      market_id: admin.market_id,
      ...body
    });
    const group_entity = await this.groupRepository.save(
      admin.market_id,
      group
    );
    if (!group_entity) throw new CustomError(RESULT_CODE.NOT_CREATE_ERROR);
    const setting = this.settingFactory.create({
      market_id: admin.market_id,
      group_id: group_entity.id as number,
      start_business_hours: '00:00:00',
      end_business_hours: '00:00:00',
      start_break_time: '00:00:00',
      end_break_time: '00:00:00',
      wifi_ssid: '',
      wifi_password: '',
      comment: '',
      tel: '',
      text_color: '#49382b',
      background_color: '#ffe6ad'
    });
    if (!setting) throw new CustomError(RESULT_CODE.NOT_CREATE_ERROR);
    await this.settingRepository.save(setting);
    await this.cacheService.delMenuCache(admin.market_id);
    return true;
  }
}
