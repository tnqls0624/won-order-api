import { AggregateRoot } from '@nestjs/cqrs';

export type DocumentEssentialProperties = Readonly<
  Required<{
    title: string;
    content: string;
  }>
>;

export type DocumentOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
  }>
>;

export type DocumentProperties = DocumentEssentialProperties &
  Required<DocumentOptionalProperties>;

export interface Document {}

export class DocumentImplement extends AggregateRoot implements Document {
  private readonly id: number;
  private title: string;
  private content: string;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: DocumentProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
}
