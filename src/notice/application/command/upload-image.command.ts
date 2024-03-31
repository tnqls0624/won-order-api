import { ICommand } from '@nestjs/cqrs';

export class UploadImageCommand implements ICommand {
  constructor(
    readonly filename: string,
    readonly buffer: Buffer
  ) {}
}
