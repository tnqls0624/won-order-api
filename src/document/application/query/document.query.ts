import { DocumentEntity } from 'src/document/infrastructure/entity/document.entity';

export interface DocumentQuery {
  findById: (id: number) => Promise<DocumentEntity | null>;
}
