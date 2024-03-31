import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { Image, ImageImplement, ImageProperties } from './image';

type CreateImageOptions = Readonly<{
  hash: string;
  w360: string;
  w130: string;
  w120: string;
}>;

export class ImageFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateImageOptions): Image {
    return this.eventPublisher.mergeObjectContext(
      new ImageImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate()
      })
    );
  }

  reconstitute(properties: ImageProperties): Image {
    return this.eventPublisher.mergeObjectContext(
      new ImageImplement(properties)
    );
  }
}
