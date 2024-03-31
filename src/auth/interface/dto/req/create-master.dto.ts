import { PickType } from '@nestjs/swagger';
import { AdminEntity } from 'src/auth/infrastructure/entity/admin.entity';

export class CreateMasterDto extends PickType(AdminEntity, [
  'market_id',
  'language_id',
  'admin_id',
  'password',
  'nickname'
] as const) {}
