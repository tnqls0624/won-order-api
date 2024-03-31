import { SettingEntity } from 'src/setting/infrastructure/entity/setting.entity';

export interface SettingQuery {
  findById: (id: number) => Promise<SettingEntity[] | null>;
  findByGroupId: (id: number) => Promise<SettingEntity | null>;
}
