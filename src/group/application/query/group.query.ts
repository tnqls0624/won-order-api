import { GroupEntity } from 'src/group/infrastructure/entity/group.entity';

export interface GroupQuery {
  findById: (id: number) => Promise<GroupEntity | null>;
  findAll: (market_id: number) => Promise<GroupEntity[] | null>;
  findByIdIncludeGroupTl: (
    id: number,
    language_id: number
  ) => Promise<any | null>;
  findByIdWithLanguageId: (
    id: number,
    language_id: number
  ) => Promise<GroupEntity | null>;
  findGroupTl: (id: number) => Promise<any | null>;
}
