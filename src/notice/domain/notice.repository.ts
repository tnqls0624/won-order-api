import { NoticeEntity } from '../infrastructure/entity/notice.entity';
import { Notice } from './notice';
import { UpdateNoticeDto } from '../interface/dto/update-notice.dto';

export interface NoticeRepository {
  save: (notice: Notice | Notice[]) => Promise<NoticeEntity | null>;
  delete: (id: number) => Promise<boolean>;
  findById: (id: number) => Promise<Notice | null>;
  update: (id: number, body: UpdateNoticeDto) => Promise<boolean>;
  updateIndex: (id: number, index: number) => Promise<boolean>;
  saveImage: (body: any) => Promise<any>;
  findByHash: (hash: string) => Promise<any>;
}
