export interface DocumentRepository {
  findById: (id: number) => Promise<Document | null>;
}
