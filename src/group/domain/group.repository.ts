import { GroupEntity } from '../infrastructure/entity/group.entity';
import { UpdateGroupTlsDto } from '../interface/dto/update-group-tl.dto';
import { Group } from './group';

export interface GroupRepository {
  save: (market_id: number, group: Group) => Promise<GroupEntity | null>;
  findById: (id: number) => Promise<Group | null>;
  findByName: (market_id: number, name: string) => Promise<Group | null>;
  update: (
    id: number,
    market_id: number,
    name: string,
    content: string
  ) => Promise<boolean>;
  select: (
    admin_id: number,
    market_id: number,
    select_ids: number[]
  ) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
  findAll: (market_id: number) => Promise<GroupEntity[] | null>;
  findAllWithLanguageId: (
    market_id: number,
    language_id: number
  ) => Promise<GroupEntity[] | null>;
  updateGroupTl: (body: UpdateGroupTlsDto) => Promise<boolean>;
}
