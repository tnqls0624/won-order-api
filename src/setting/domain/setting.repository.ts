import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { SettingEntity } from '../infrastructure/entity/setting.entity';
import { UpdateSettingDto } from '../interface/dto/update-setting.dto';
import { Setting } from './setting';

export interface SettingRepository {
  findById: (id: number) => Promise<Setting | null>;
  update: (
    id: number,
    admin: AdminDto,
    market_id: number,
    body: UpdateSettingDto
  ) => Promise<boolean>;
  save: (setting: Setting) => Promise<SettingEntity | null>;
}
