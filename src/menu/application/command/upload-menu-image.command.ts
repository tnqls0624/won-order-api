import { ICommand } from '@nestjs/cqrs';

export class UploadMenuImageCommand implements ICommand {
  constructor(
    readonly filename: string,
    readonly buffer: Buffer
  ) {}
}
