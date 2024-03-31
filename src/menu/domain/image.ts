import { AggregateRoot } from '@nestjs/cqrs';

export type ImageEssentialProperties = Readonly<
  Required<{
    hash: string;
    w360: string;
    w130: string;
    w120: string;
  }>
>;

export type ImageOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
  }>
>;

export type ImageProperties = ImageEssentialProperties &
  Required<ImageOptionalProperties>;

export interface Image {}

export class ImageImplement extends AggregateRoot implements Image {
  private readonly id: number;
  private hash: string;
  private w360: string;
  private w130: string;
  private w120: string;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: ImageProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
}
