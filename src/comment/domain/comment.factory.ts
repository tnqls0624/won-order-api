import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { CommentImplement, CommentProperties, Comment } from './comment';

type CreateCommentOptions = Readonly<{
  writer_id: number | null;
  writer_name: string;
  group_id: number;
  content: string;
  is_secret: boolean;
  password: string | null;
  parent_id: number | null;
}>;

export class CommentFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateCommentOptions): Comment {
    return this.eventPublisher.mergeObjectContext(
      new CommentImplement({
        ...options,
        remove_at: null,
        create_at: new Date(),
        update_at: new Date()
      })
    );
  }

  reconstitute(properties: CommentProperties): Comment {
    return this.eventPublisher.mergeObjectContext(
      new CommentImplement(properties)
    );
  }
}
