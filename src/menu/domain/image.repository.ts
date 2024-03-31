import { ImageEntity } from '../infrastructure/entity/image.entity';
import { Image } from './image';

export interface ImageRepository {
  save: (image: Image) => Promise<ImageEntity | null>;
  delete: (id: number) => Promise<boolean>;
  findByHash: (hash: string) => Promise<ImageEntity | null>;
}
